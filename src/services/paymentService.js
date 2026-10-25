/**
 * Stripe Test Mode Payment & Checkout Service
 * Enforces server-side price validation and creates checkout sessions.
 */

import crypto from 'crypto';
import { db } from '../db.js';

export const PLAN_PRICING = {
  pro: {
    name: 'DealForge Agency Pro (Monthly)',
    amountCents: 7900, // $79.00
    currency: 'usd',
    billing: 'monthly',
    stripePriceId: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_test_79'
  },
  pro_annual: {
    name: 'DealForge Agency Pro (Annual)',
    amountCents: 79000, // $790.00
    currency: 'usd',
    billing: 'annual',
    stripePriceId: process.env.STRIPE_PRICE_PRO_ANNUAL || 'price_pro_annual_790'
  },
  lifetime: {
    name: 'DealForge Founder Lifetime License',
    amountCents: 49900, // $499.00
    currency: 'usd',
    billing: 'one_time',
    stripePriceId: process.env.STRIPE_PRICE_LIFETIME || 'price_lifetime_test_499'
  }
};

export class PaymentService {
  /**
   * Create a checkout session with strict server-side price enforcement
   * @param {Object} options - Plan, user, and redirect URLs
   * @returns {Object} Checkout session details
   */
  static createCheckoutSession({ planId, userId = 'anon_agency_user', successUrl, cancelUrl }) {
    const planConfig = PLAN_PRICING[planId];
    if (!planConfig) {
      return { success: false, error: `Invalid plan specified: ${planId}` };
    }

    const sessionId = 'cs_test_' + crypto.randomBytes(16).toString('hex');
    const order = db.createOrder({
      userId,
      plan: planId,
      amount: planConfig.amountCents / 100,
      currency: planConfig.currency,
      status: 'pending',
      stripeSessionId: sessionId
    });

    const mockCheckoutUrl = `/checkout.html?session_id=${sessionId}&plan=${planId}&status=simulated_ready`;

    // Telemetry
    db.logEvent({
      type: 'checkout_initiated',
      orderId: order.id,
      plan: planId,
      amount: planConfig.amountCents / 100
    });

    return {
      success: true,
      orderId: order.id,
      sessionId,
      plan: planConfig.name,
      amountUsd: (planConfig.amountCents / 100).toFixed(2),
      checkoutUrl: mockCheckoutUrl
    };
  }

  /**
   * Retrieve order details by Stripe session ID
   */
  static getSessionOrder(sessionId) {
    return db.findOrderByStripeSession(sessionId);
  }
}
