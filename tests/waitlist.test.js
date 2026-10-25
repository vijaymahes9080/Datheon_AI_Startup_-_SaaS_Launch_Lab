import { describe, it } from 'node:test';
import assert from 'node:assert';
import { WaitlistService } from '../src/services/waitlistService.js';

describe('WaitlistService - Email Validation & Position Management', () => {
  it('should validate standard and reject malformed email addresses', () => {
    assert.strictEqual(WaitlistService.validateEmail('founder@apexagency.com'), true);
    assert.strictEqual(WaitlistService.validateEmail('invalid-email-address'), false);
    assert.strictEqual(WaitlistService.validateEmail('@nodomain.com'), false);
  });

  it('should register a valid email with consent and assign sequential position', () => {
    const testEmail = `wl_test_${Date.now()}@digitalagency.com`;
    const res = WaitlistService.register(testEmail, { source: 'unit_test' }, true);

    assert.strictEqual(res.success, true);
    assert.ok(res.position > 0);
  });

  it('should reject registration when consent is false', () => {
    const res = WaitlistService.register('unconsenting@agency.com', {}, false);
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'CONSENT_REQUIRED');
  });

  it('should detect duplicate email submissions', () => {
    const dupEmail = `dup_${Date.now()}@agency.com`;
    WaitlistService.register(dupEmail, {}, true);

    const dupRes = WaitlistService.register(dupEmail, {}, true);
    assert.strictEqual(dupRes.success, false);
    assert.strictEqual(dupRes.code, 'DUPLICATE_EMAIL');
  });
});
