import { type NextRequest, NextResponse } from "next/server";
import { stripeServerHandler } from "@/app/stripe/server";

export async function GET(request: NextRequest) {
  try {
    const products = await stripeServerHandler.products.list();

    return NextResponse.json({ products: products });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
