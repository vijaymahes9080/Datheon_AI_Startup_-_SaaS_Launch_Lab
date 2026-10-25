/**
 * Stripe Checkout Session Route Controller
 */

import express from 'express';
import { PaymentService } from '../services/paymentService.js';

export const checkoutRouter = express.Router();

checkoutRouter.post('/create-session', (req, res) => {
  const { planId } = req.body;
  const userId = req.user ? req.user.id : 'anon_agency_user';

  const result = PaymentService.createCheckoutSession({
    planId: planId || 'pro',
    userId,
    successUrl: `${req.protocol}://${req.get('host')}/app.html?payment=success`,
    cancelUrl: `${req.protocol}://${req.get('host')}/checkout.html?payment=cancelled`
  });

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json(result);
});
