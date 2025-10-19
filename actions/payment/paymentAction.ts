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
      // Demo mode: return fake payment intent
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      return {
        id: `demo_pi_${timestamp}_${random}`,
        client_secret: `demo_secret_${timestamp}_${random}`,
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
