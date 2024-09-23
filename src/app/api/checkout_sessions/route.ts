import { type NextRequest, NextResponse } from "next/server";
import { stripeServerHandler } from "@/app/stripe/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, subscription } = body;

    if (!priceId) {
      return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
    }

    const session = await stripeServerHandler.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: subscription ? "subscription" : "payment",
      success_url: `${request.headers.get("origin")}/checkout/success`,
      cancel_url: `${request.headers.get("origin")}/checkout/cancel`,
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
