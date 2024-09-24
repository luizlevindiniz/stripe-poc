import { type NextRequest, NextResponse } from "next/server";
import { stripeServerHandler } from "@/app/stripe/server";

export async function GET(request: NextRequest) {
  try {
    const product = await stripeServerHandler.products.retrieve(
      "prod_QuXGWGx2TwSd4d"
    );

    return NextResponse.json({ product: product });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
