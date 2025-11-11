import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Rate limiting: 5 checkout requests per hour per user
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkRateLimit(
      {
        endpoint: '/api/auth/checkout',
        limit: 5,
        windowSeconds: 3600, // 1 hour
      },
      session.user.id,
      clientIp
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `You have exceeded the rate limit of ${rateLimitResult.limit} checkout requests per hour. Please try again later.`,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': (rateLimitResult.reset - Math.floor(Date.now() / 1000)).toString(),
          },
        }
      );
    }

    const { amount } = await req.json();

    // Validate amount (in EUR)
    if (!amount || amount < 1 || amount > 50) {
      return NextResponse.json(
        { error: "Invalid amount. Must be between €1 and €50" },
        { status: 400 }
      );
    }

    // Convert EUR to cents
    const amountInCents = Math.round(amount * 100);

    // Build success and cancel URLs with dynamic parameters
    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://masqify.io';
    const baseSuccessUrl = process.env.STRIPE_SUCCESS_URL || `${appUrl}/editor?payment=success`;
    const baseCancelUrl = process.env.STRIPE_CANCEL_URL || `${appUrl}/editor?payment=cancelled`;

    // Append amount to success URL (handle both ?payment=success and base URLs)
    const successUrl = baseSuccessUrl.includes('?')
      ? `${baseSuccessUrl}&amount=${amount.toFixed(2)}`
      : `${baseSuccessUrl}?amount=${amount.toFixed(2)}`;

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Account Credits",
              description: `Add €${amount.toFixed(2)} to your account balance`,
            },
            unit_amount: amountInCents,
            tax_behavior: "inclusive", // Tax is included in the price (common in EU)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: baseCancelUrl,
      customer_email: session.user.email,
      client_reference_id: session.user.id, // Link to user
      automatic_tax: {
        enabled: true,
      },
      payment_intent_data: {
        description: `Masqify Account Credits - €${amount.toFixed(2)}`, // Appears on receipt
      },
      metadata: {
        userId: session.user.id,
        amount: amount.toFixed(2),
        currency: "EUR",
      },
    });

    return NextResponse.json({
      url: checkoutSession.url,
      checkoutId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout" },
      { status: 500 }
    );
  }
}
