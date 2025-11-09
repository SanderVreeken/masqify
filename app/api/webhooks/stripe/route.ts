import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { payment } from "@/lib/db/schema";
import { completePayment, createPendingPayment } from "@/lib/balance";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId || session.client_reference_id;
        const amountStr = session.metadata?.amount;

        if (!userId || !amountStr) {
          console.error("Missing userId or amount in session metadata");
          return NextResponse.json(
            { error: "Missing required metadata" },
            { status: 400 }
          );
        }

        const amount = parseFloat(amountStr);
        if (amount <= 0) {
          console.error("Invalid amount in metadata:", amountStr);
          return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // Prevent duplicates
        const existingPayment = await db.query.payment.findFirst({
          where: eq(payment.providerTransactionId, session.id),
        });

        if (existingPayment) {
          return NextResponse.json({ received: true });
        }

        // Create pending payment
        const paymentId = await createPendingPayment(userId, amount, session.id);

        // Complete the payment and add funds
        await completePayment(paymentId, session);

        const paymentIntentId = session.payment_intent as string;
        const customerEmail = session.customer_email;

        if (!customerEmail) {
          console.warn("No customer email provided. Stripe will not send a receipt.");
        }

        if (paymentIntentId) {
          // ⚡ Cast the response to include charges for TypeScript
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId,
            { expand: ["charges.data"] }
          ) as Stripe.PaymentIntent & { charges?: Stripe.ApiList<Stripe.Charge> };

          const charge = paymentIntent.charges?.data?.[0];
          const receiptUrl = charge?.receipt_url;

          if (!receiptUrl) {
            console.warn("Receipt URL not available for this payment.");
          }
        }

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId || session.client_reference_id;
        const amountStr = session.metadata?.amount;

        if (!userId || !amountStr) {
          console.error("Missing userId or amount in session metadata");
          return NextResponse.json(
            { error: "Missing required metadata" },
            { status: 400 }
          );
        }

        const amount = parseFloat(amountStr);

        const existingPayment = await db.query.payment.findFirst({
          where: eq(payment.providerTransactionId, session.id),
        });

        if (existingPayment) {
          return NextResponse.json({ received: true });
        }

        const paymentId = await createPendingPayment(userId, amount, session.id);
        await completePayment(paymentId, session);

        break;
      }

      case "checkout.session.async_payment_failed": {
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    // Log error type only, not full error object that could contain payment details
    console.error("Error processing webhook:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
