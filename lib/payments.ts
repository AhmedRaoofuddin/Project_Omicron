/**
 * Unified payment API - switches between fake checkout and Stripe
 */

import { config } from './config';

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
}

export interface PaymentConfirmation {
  id: string;
  status: 'succeeded' | 'failed';
  chargeId: string;
}

/**
 * Generate a random ID for demo payments
 */
function generateDemoId(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Create payment intent
 */
export async function createPaymentIntent(params: {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}): Promise<PaymentIntent> {
  if (config.demo) {
    // Demo mode: return fake payment intent
    return {
      id: generateDemoId('demo_pi'),
      client_secret: generateDemoId('demo_secret'),
      amount: params.amount,
      currency: params.currency || 'usd',
      status: 'requires_payment_method',
    };
  } else {
    // Production: use real Stripe
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }
    
    return response.json();
  }
}

/**
 * Confirm payment (demo mode simulates success)
 */
export async function confirmPayment(paymentIntentId: string): Promise<PaymentConfirmation> {
  if (config.demo) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id: paymentIntentId,
      status: 'succeeded',
      chargeId: generateDemoId('demo_ch'),
    };
  } else {
    // Production: confirm with Stripe
    const response = await fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentIntentId }),
    });
    
    if (!response.ok) {
      throw new Error('Payment confirmation failed');
    }
    
    return response.json();
  }
}

/**
 * Get Stripe publishable key
 */
export async function getPublishableKey(): Promise<string | null> {
  if (config.demo) {
    return 'pk_demo_fake_key';
  } else {
    const response = await fetch('/api/payments/publishable-key');
    const data = await response.json();
    return data.publishableKey;
  }
}

/**
 * Check if payment was successful from session
 */
export function isPaymentSucceeded(paymentIntent: PaymentIntent): boolean {
  return paymentIntent.status === 'succeeded';
}

