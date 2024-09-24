import { stripeServerHandler } from "@/app/stripe/server";
import type Stripe from "stripe";

/* da para fazer varios eventos do stripe <- pesquisar */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripeServerHandler.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    return new Response("webhook error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = await stripeServerHandler.subscriptions.retrieve(
      session.subscription as string
    );
    const customerId = String(session.customer);

    await stripeServerHandler.customers.update(customerId, {
      metadata: {
        subscription: "true",
      },
    });

    await handleSuccessfulCheckout(customerId, subscription);
  } else if (event.type === "invoice.payment_succeeded") {
    const session = event.data.object as Stripe.Invoice;
    const subscription = await stripeServerHandler.subscriptions.retrieve(
      session.subscription as string
    );

    await handleSuccessfulSubscription(subscription);
  } else if (event.type === "customer.subscription.deleted") {
    const session = event.data.object as Stripe.Subscription;
    const subscription = await stripeServerHandler.subscriptions.retrieve(
      session.id as string
    );
    const customerId = String(session.customer);
    await stripeServerHandler.customers.update(customerId, {
      metadata: {
        subscription: "false",
      },
    });

    await handleCancelledSubscription(customerId, subscription);
  }

  return new Response("webhook received", { status: 200 });
}

async function handleSuccessfulCheckout(
  customerId: string,
  subscription: Stripe.Subscription
) {
  /*   const user = await prisma.user.findUnique({
    where: {
      stripeCustomerId: customerId,
    },
  });

  if (!user) throw new Error("User not found...");

  await prisma.subscription.create({
    data: {
      stripeSubscriptionId: subscription.id,
      userId: user.id,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      status: subscription.status,
      planId: subscription.items.data[0].plan.id,
      interval: String(subscription.items.data[0].plan.interval),
    },
  });
 */
  console.log("Subscription created successfully");
}

async function handleSuccessfulSubscription(subscription: Stripe.Subscription) {
  /*
  await prisma.subscription.update({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      planId: subscription.items.data[0].price.id,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      status: subscription.status,
    },
  });
} */
  console.log("Subscription updated successfully");
}

async function handleCancelledSubscription(
  customerId: string,
  subscription: Stripe.Subscription
) {
  /* const user = await prisma.user.findUnique({
    where: {
      stripeCustomerId: customerId,
    },
  });
  Logica para cancelar

  */
  console.log("Subscription cancelled successfully");
}

/*
middleware pra checar subscription no DB (fazer um para consultar no stripe)
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';

export async function subscriptionMiddleware(req: NextRequest) {
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { subscriptionStatus: true, subscriptionCurrentPeriodEnd: true },
  });

  if (!user || user.subscriptionStatus !== 'active' || user.subscriptionCurrentPeriodEnd < new Date()) {
    return NextResponse.redirect(new URL('/subscription', req.url));
  }

  return NextResponse.next();
}

*/
