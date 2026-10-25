import { describe, it } from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';
import { PaymentService, PLAN_PRICING } from '../src/services/paymentService.js';
import { verifyStripeSignature } from '../src/routes/webhooks.js';

describe('Payment & Webhook Security', () => {
  it('should enforce server-side prices and reject invalid plans', () => {
    assert.strictEqual(PLAN_PRICING.pro.amountCents, 7900);
    assert.strictEqual(PLAN_PRICING.lifetime.amountCents, 49900);

    const invalidSession = PaymentService.createCheckoutSession({ planId: 'hacked_free_plan' });
    assert.strictEqual(invalidSession.success, false);

    const validSession = PaymentService.createCheckoutSession({ planId: 'pro' });
    assert.strictEqual(validSession.success, true);
    assert.strictEqual(validSession.amountUsd, '79.00');
  });

  it('should verify legitimate Stripe webhook cryptographic signatures', () => {
    const secret = 'whsec_test_secret_key_123';
    const payload = JSON.stringify({ id: 'evt_test_1', type: 'checkout.session.completed' });
    const timestamp = Math.floor(Date.now() / 1000);

    const signedPayload = `${timestamp}.${payload}`;
    const hmacSig = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
    const header = `t=${timestamp},v1=${hmacSig}`;

    const isValid = verifyStripeSignature(payload, header, secret);
    assert.strictEqual(isValid, true, 'Valid signature must pass');
  });

  it('should reject tampered or replayed webhook payloads', () => {
    const secret = 'whsec_test_secret_key_123';
    const payload = JSON.stringify({ id: 'evt_test_2' });
    const timestamp = Math.floor(Date.now() / 1000);

    const invalidHeader = `t=${timestamp},v1=bad_hash_value_1234567890abcdef`;
    assert.strictEqual(verifyStripeSignature(payload, invalidHeader, secret), false);

    // Stale timestamp (600 seconds old)
    const oldTimestamp = timestamp - 600;
    const oldSigned = `${oldTimestamp}.${payload}`;
    const oldSig = crypto.createHmac('sha256', secret).update(oldSigned).digest('hex');
    const oldHeader = `t=${oldTimestamp},v1=${oldSig}`;
    assert.strictEqual(verifyStripeSignature(payload, oldHeader, secret), false, 'Replayed event must be rejected');
  });
});
