import { loadStripe } from "@stripe/stripe-js";

const configValue: string = process.env
  .NEXT_PUBLIC_PUBLISHABLE_STRIPE_KEY as string;
export async function getStripeJs() {
  return await loadStripe(configValue);
}
