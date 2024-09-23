import Stripe from "stripe";

export const stripeServerHandler = new Stripe(
  process.env.NEXT_STRIPE_API_KEY_SECRET as string
);
