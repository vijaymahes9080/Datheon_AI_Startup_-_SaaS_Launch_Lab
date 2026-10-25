/**
 * Authentication & Session Management Service
 * Employs native Node.js crypto for PBKDF2 hashing and HMAC-SHA256 session tokens.
 */

import crypto from 'crypto';
import { db } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dealforge_secure_super_signing_secret_key_2026';

export class AuthService {
  /**
   * Hash a plain text password with a unique salt
   * @param {string} password
   * @returns {string} Salt and hash formatted string
   */
  static hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  /**
   * Verify password against stored salt:hash string
   * @param {string} password
   * @param {string} storedHash
   * @returns {boolean}
   */
  static verifyPassword(password, storedHash) {
    if (!storedHash || !storedHash.includes(':')) return false;
    const [salt, originalHash] = storedHash.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return originalHash === verifyHash;
  }

  /**
   * Generate signed session token (HMAC-SHA256)
   * @param {Object} user
   * @returns {string} Token
   */
  static generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      plan: user.plan,
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(encodedPayload)
      .digest('base64url');
    return `${encodedPayload}.${signature}`;
  }

  /**
   * Verify and decode signed token
   * @param {string} token
   * @returns {Object|null}
   */
  static verifyToken(token) {
    if (!token || typeof token !== 'string' || !token.includes('.')) return null;
    const [encodedPayload, signature] = token.split('.');
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(encodedPayload)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    try {
      const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
      if (payload.exp && Date.now() > payload.exp) {
        return null; // Expired
      }
      return payload;
    } catch (_) {
      return null;
    }
  }

  /**
   * Register a new user
   */
  static register({ email, password, name, agencyName }) {
    if (!email || !password || password.length < 6) {
      return { success: false, error: 'Valid email and password (min 6 chars) are required' };
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return { success: false, error: 'An account with this email already exists', code: 'EMAIL_EXISTS' };
    }

    const passwordHash = this.hashPassword(password);
    const user = db.createUser({
      email,
      name,
      agencyName,
      passwordHash,
      plan: 'starter'
    });

    const token = this.generateToken(user);
    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        agencyName: user.agencyName,
        plan: user.plan
      }
    };
  }

  /**
   * Authenticate an existing user
   */
  static login({ email, password }) {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const user = db.findUserByEmail(email);
    if (!user || !this.verifyPassword(password, user.passwordHash)) {
      return { success: false, error: 'Invalid email or password' };
    }

    const token = this.generateToken(user);
    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        agencyName: user.agencyName,
        plan: user.plan
      }
    };
  }
}
