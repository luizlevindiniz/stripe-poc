import { type NextRequest, NextResponse } from "next/server";
import { stripeServerHandler } from "@/app/stripe/server";

export async function GET(request: NextRequest) {
  try {
    const customers =
      await stripeServerHandler.customers.retrieve("cus_QuNpPo3m5ZYmIa");

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

/*

async function getCustomerDetails(): Promise<Customer> {
  try {
    const response = await axios.get("/api/customers");

    if (response.status === 200) {
      return response.data.customers;
    }
  } catch (err) {
    console.error("Failed to fetch customers:", err);
  }
  return { id: "", name: "", email: "" };
}


interface Customer {
  id: string;
  name: string;
  email: string;
}

*/
