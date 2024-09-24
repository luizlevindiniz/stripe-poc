import { type NextRequest, NextResponse } from "next/server";
import { stripeServerHandler } from "@/app/stripe/server";

const backendUrl =
  process.env.NODE_ENV === "production"
    ? (process.env.PRODUCTION_URL as string)
    : "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: "Invalid customerId" },
        { status: 400 }
      );
    }

    const session = await stripeServerHandler.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${backendUrl}/`,
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
