import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getUserBalance,
  calculateCost,
  createRewriteRecord,
  deductFunds,
} from "@/lib/balance";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const maxDuration = 30;

const MODEL = "gpt-4o-mini"; // Using cost-effective model

export async function POST(req: Request) {
  try {
    // Check if user has an active session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json(
        {
          error: "Authentication required",
          message: "Please sign in or create an account to use the AI rewriter.",
        },
        { status: 401 }
      );
    }

    // Check if user is banned
    if (session.user.banned) {
      return Response.json(
        {
          error: "Account suspended",
          message: session.user.banReason || "Your account has been suspended. Please contact support.",
        },
        { status: 403 }
      );
    }

    // Rate limiting: 20 requests per hour per user
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkRateLimit(
      {
        endpoint: '/api/rewrite',
        limit: 20,
        windowSeconds: 3600, // 1 hour
      },
      session.user.id,
      clientIp
    );

    if (!rateLimitResult.success) {
      return Response.json(
        {
          error: "Rate limit exceeded",
          message: `You have exceeded the rate limit of ${rateLimitResult.limit} requests per hour. Please try again later.`,
          retryAfter: rateLimitResult.reset,
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

    const { text } = await req.json();

    // Check user balance
    const userBalance = await getUserBalance(session.user.id);
    if (userBalance <= 0) {
      return Response.json(
        {
          error: "Insufficient balance",
          message: "Please add funds to your account to continue using the AI rewriter.",
        },
        { status: 402 } // Payment Required
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI API with chat completions
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a professional text editor. Rewrite the text to improve clarity, grammar, and professionalism while maintaining the original meaning and tone. Keep any placeholders like [REDACTED-1] exactly as they are - do not modify or remove them.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
    });

    const rewrittenText = response.choices[0]?.message?.content;

    if (!rewrittenText) {
      throw new Error("No response from OpenAI");
    }

    // Get actual token usage from response
    const inputTokens = response.usage?.prompt_tokens || 0;
    const outputTokens = response.usage?.completion_tokens || 0;
    const totalTokens = inputTokens + outputTokens;

    // Calculate cost with 6x markup
    const { cost, pricePerToken } = calculateCost(MODEL, inputTokens, outputTokens);

    // Check if user has enough balance for this specific rewrite
    if (cost > userBalance) {
      return Response.json(
        {
          error: "Insufficient balance",
          message: `This rewrite costs €${cost.toFixed(4)}, but you only have €${userBalance.toFixed(2)}. Please add more funds.`,
        },
        { status: 402 }
      );
    }

    // Create rewrite record
    const rewriteId = await createRewriteRecord(
      session.user.id,
      text.length,
      rewrittenText.length,
      totalTokens,
      pricePerToken,
      cost,
      MODEL,
      {
        inputTokens,
        outputTokens,
      }
    );

    // Deduct funds from user's account
    await deductFunds(session.user.id, cost, rewriteId, {
      model: MODEL,
      tokens: totalTokens,
    });

    return Response.json({
      text: rewrittenText,
      usage: {
        tokens: totalTokens,
        cost: cost,
      },
    });
  } catch (error) {
    // Log error type only, not details that could contain user text
    console.error("Error in rewrite API:", error instanceof Error ? error.constructor.name : "Unknown error");
    return Response.json(
      { error: "Failed to rewrite text" },
      { status: 500 }
    );
  }
}
