import { type NextRequest, NextResponse } from "next/server";
import { stripeServerHandler } from "@/app/stripe/server";

export async function GET(request: NextRequest) {
  try {
    const customers =
      await stripeServerHandler.customers.retrieve("cus_Qu5mjfBbdxL7vX");

    return NextResponse.json({ customers: customers });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
