"use server";
import { config } from "@/lib/config";

// send stripe publishable key
export const stripePublishableKey = async () => {
  if (config.demo) {
    return "pk_demo_fake_key_for_demo_mode";
  }
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  return publishableKey;
};

// send stripe payment intent
export const stripePaymentIntent = async ({ amount }: { amount: number }) => {
  try {
    if (config.demo) {
      // Demo mode: return fake payment intent with Stripe-like format
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      const id = `pi_${timestamp}_${random}`;
      return {
        id,
        client_secret: `${id}_secret_${random}`,
        amount,
        currency: "usd",
        status: "requires_payment_method",
      };
    }
    
    // Production mode: use real Stripe
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        company: "PromptPlace",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.log(error);
  }
};
