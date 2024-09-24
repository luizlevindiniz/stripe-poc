import { type NextRequest, NextResponse } from "next/server";
import { stripeServerHandler } from "@/app/stripe/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, subscriptionId } = body;

    // Validate the customerId and subscriptionId
    if (!customerId || !subscriptionId) {
      return NextResponse.json(
        { error: "Invalid customerId or subscriptionId" },
        { status: 400 }
      );
    }

    // Fetch the subscription to get the start date
    const subscription =
      await stripeServerHandler.subscriptions.retrieve(subscriptionId);
    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    // Check if the subscription's start date is within the past 7 days
    const startDate = new Date(subscription.start_date * 1000); // Convert Unix timestamp to JavaScript Date
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    if (dayDiff > 7) {
      return NextResponse.json(
        {
          error: "Refunds are only allowed within 7 days of the first payment.",
        },
        { status: 400 }
      );
    }

    // Fetch the customer's paid invoices
    const paidInvoices = await stripeServerHandler.invoices.list({
      customer: customerId,
      status: "paid",
    });

    // Check if the customer has only one paid invoice since the subscription started no more than 7 days ago
    if (paidInvoices.data.length !== 1) {
      return NextResponse.json(
        { error: "This customer is not eligible for refunding." },
        { status: 400 }
      );
    }

    // Get the latest paid invoice
    const latestInvoice = paidInvoices.data[0];

    // Check if the latest paid invoice is associated with the subscription
    if (latestInvoice.subscription !== subscriptionId) {
      return NextResponse.json(
        { error: "This customer is not eligible for refunding." },
        { status: 400 }
      );
    }

    // Check if the latest paid invoice has a payment intent
    const { payment_intent: paymentIntentId } = latestInvoice;

    // Check if the latest paid invoice has a payment intent
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "This customer is not eligible for refunding." },
        { status: 400 }
      );
    }

    // Refund the payment intent
    await stripeServerHandler.refunds.create({
      payment_intent: paymentIntentId as string,
    });

    // Cancel the subscription
    await stripeServerHandler.subscriptions.cancel(subscriptionId);

    return NextResponse.json({ message: "Refund successful" });
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
subscription cancel return

{
   "id":"sub_1Q2hgmDl1vAuDO1VVXCROe6q",
   "object":"subscription",
   "application":null,
   "application_fee_percent":null,
   "automatic_tax":{
},
   "billing_cycle_anchor":1727380260,
   "billing_cycle_anchor_config":null,
   "billing_thresholds":null,
   "cancel_at":null,
   "cancel_at_period_end":false,
   "canceled_at":1727380260,
   "cancellation_details":{
},
   "collection_method":"charge_automatically",
   "created":1727380260,
   "currency":"brl",
   "current_period_end":1729972260,
   "current_period_start":1727380260,
   "customer":"cus_QuNpPo3m5ZYmIa",
   "days_until_due":null,
   "default_payment_method":"pm_1Q2hglDl1vAuDO1VPkZ7kK57",
   "default_source":null,
   "default_tax_rates":[
],
   "description":null,
   "discount":null,
   "discounts":[
],
   "ended_at":1727380260,
   "invoice_settings":{
},
   "items":{
},
   "latest_invoice":"in_1Q2hjPDl1vAuDO1VPcPQpVnE",
   "livemode":false,
   "metadata":{

   },
   "next_pending_invoice_item_invoice":null,
   "on_behalf_of":null,
   "pause_collection":null,
   "payment_settings":{
},
   "pending_invoice_item_interval":null,
   "pending_setup_intent":null,
   "pending_update":null,
   "plan":{
},
   "quantity":1,
   "schedule":null,
   "start_date":1727380260,
   "status":"canceled",
   "test_clock":"clock_1Q2el1Dl1vAuDO1VO5YxBJEG",
   "transfer_data":null,
   "trial_end":null,
   "trial_settings":{
      "end_behavior":{
         "missing_payment_method":"create_invoice"
      }
   },
   "trial_start":null
}



invoice return

{
   "id":"in_1Q2iFEDl1vAuDO1VVtjRZ7tW",
   "object":"invoice",
   "account_country":"BR",
   "account_name":"Fernandobelotto",
   "account_tax_ids":null,
   "amount_due":2000,
   "amount_paid":2000,
   "amount_remaining":0,
   "amount_shipping":0,
   "application":null,
   "application_fee_amount":null,
   "attempt_count":1,
   "attempted":true,
   "auto_advance":false,
   "automatic_tax":{
      "enabled":false,
      "liability":null,
      "status":null
   },
   "automatically_finalizes_at":null,
   "billing_reason":"subscription_create",
   "charge":"ch_3Q2iFEDl1vAuDO1V1dVH8VN2",
   "collection_method":"charge_automatically",
   "created":1727220852,
   "currency":"brl",
   "custom_fields":null,
   "customer":"cus_QuXF0OpOUTl75w",
   "customer_address":{
      "city":null,
      "country":"BR",
      "line1":null,
      "line2":null,
      "postal_code":null,
      "state":null
   },
   "customer_email":"luiz@fernandobelotto.com",
   "customer_name":"Luiz Diniz",
   "customer_phone":null,
   "customer_shipping":null,
   "customer_tax_exempt":"none",
   "customer_tax_ids":[

   ],
   "default_payment_method":null,
   "default_source":null,
   "default_tax_rates":[

   ],
   "description":null,
   "discount":null,
   "discounts":[

   ],
   "due_date":null,
   "effective_at":1727220852,
   "ending_balance":0,
   "footer":null,
   "from_invoice":null,
   "hosted_invoice_url":"https://invoice.stripe.com/i/acct_1PH3P0Dl1vAuDO1V/test_YWNjdF8xUEgzUDBEbDF2QXVETzFWLF9RdVhKV3dqaGtxVzM3NjJqdlpRT2FXVmZBMVRSa0hyLDExNzc2MTY2NA0200MEt0hVeC?s=ap",
   "invoice_pdf":"https://pay.stripe.com/invoice/acct_1PH3P0Dl1vAuDO1V/test_YWNjdF8xUEgzUDBEbDF2QXVETzFWLF9RdVhKV3dqaGtxVzM3NjJqdlpRT2FXVmZBMVRSa0hyLDExNzc2MTY2NA0200MEt0hVeC/pdf?s=ap",
   "issuer":{
      "type":"self"
   },
   "last_finalization_error":null,
   "latest_revision":null,
   "lines":{
      "object":"list",
      "data":[
         [
            "Object"
         ]
      ],
      "has_more":false,
      "total_count":1,
      "url":"/v1/invoices/in_1Q2iFEDl1vAuDO1VVtjRZ7tW/lines"
   },
   "livemode":false,
   "metadata":{

   },
   "next_payment_attempt":null,
   "number":"1B4B33D5-0001",
   "on_behalf_of":null,
   "paid":true,
   "paid_out_of_band":false,
   "payment_intent":"pi_3Q2iFEDl1vAuDO1V1Zbc4eTS",
   "payment_settings":{
      "default_mandate":null,
      "payment_method_options":{
         "acss_debit":null,
         "bancontact":null,
         "card":[
            "Object"
         ],
         "customer_balance":null,
         "konbini":null,
         "sepa_debit":null,
         "us_bank_account":null
      },
      "payment_method_types":null
   },
   "period_end":1727220852,
   "period_start":1727220852,
   "post_payment_credit_notes_amount":0,
   "pre_payment_credit_notes_amount":0,
   "quote":null,
   "receipt_number":null,
   "rendering":null,
   "shipping_cost":null,
   "shipping_details":null,
   "starting_balance":0,
   "statement_descriptor":null,
   "status":"paid",
   "status_transitions":{
      "finalized_at":1727220852,
      "marked_uncollectible_at":null,
      "paid_at":1727220854,
      "voided_at":null
   },
   "subscription":"sub_1Q2iFEDl1vAuDO1VNRQBEhuv",
   "subscription_details":{
      "metadata":{

      }
   },
   "subtotal":2000,
   "subtotal_excluding_tax":2000,
   "tax":null,
   "test_clock":null,
   "total":2000,
   "total_discount_amounts":[

   ],
   "total_excluding_tax":2000,
   "total_tax_amounts":[

   ],
   "transfer_data":null,
   "webhooks_delivered_at":1727220856
}
*/
