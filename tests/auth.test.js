import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../src/services/authService.js';

describe('AuthService - Password Hashing & HMAC Session Tokens', () => {
  it('should hash and verify passwords using PBKDF2', () => {
    const raw = 'SuperAgencySecret2026!';
    const hash = AuthService.hashPassword(raw);

    assert.ok(hash.includes(':'), 'Hash should contain salt separator');
    assert.strictEqual(AuthService.verifyPassword(raw, hash), true);
    assert.strictEqual(AuthService.verifyPassword('WrongPassword', hash), false);
  });

  it('should generate and verify valid HMAC-SHA256 session tokens', () => {
    const mockUser = { id: 'usr_test_1', email: 'alex@apexagency.com', plan: 'pro' };
    const token = AuthService.generateToken(mockUser);

    assert.ok(token.includes('.'), 'Token must be formatted with payload.signature');
    const decoded = AuthService.verifyToken(token);
    assert.ok(decoded, 'Decoded token payload must exist');
    assert.strictEqual(decoded.email, mockUser.email);
    assert.strictEqual(decoded.plan, mockUser.plan);
  });

  it('should reject tampered session tokens', () => {
    const mockUser = { id: 'usr_test_2', email: 'bob@agency.io', plan: 'starter' };
    const token = AuthService.generateToken(mockUser);
    const tampered = token.slice(0, -4) + 'abcd';

    assert.strictEqual(AuthService.verifyToken(tampered), null);
  });

  it('should register new users and block duplicate registrations', () => {
    const testEmail = `founder_${Date.now()}@digitalstudio.com`;
    const regResult = AuthService.register({
      email: testEmail,
      password: 'password123',
      name: 'Sarah Connor',
      agencyName: 'Cyberdyne Media'
    });

    assert.strictEqual(regResult.success, true);
    assert.ok(regResult.token);

    // Duplicate attempt
    const dupResult = AuthService.register({
      email: testEmail,
      password: 'password123'
    });
    assert.strictEqual(dupResult.success, false);
    assert.strictEqual(dupResult.code, 'EMAIL_EXISTS');
  });
});
