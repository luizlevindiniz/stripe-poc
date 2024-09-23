import { type NextRequest, NextResponse } from "next/server";
import { stripeServerHandler } from "@/app/stripe/server";

const backendUrl =
  process.env.NODE_ENV === "production"
    ? (process.env.PRODUCTION_URL as string)
    : "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, subscription, customerId } = body;

    if (!priceId || !customerId) {
      return NextResponse.json(
        { error: "Invalid priceId or customerId" },
        { status: 400 }
      );
    }

    const session = await stripeServerHandler.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      customer_update: {
        address: "auto",
        name: "auto",
      },
      mode: subscription ? "subscription" : "payment",
      success_url: `${backendUrl}/checkout/success`,
      cancel_url: `${backendUrl}/checkout/cancel`,
      customer: customerId,
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
