/**
 * Waitlist Service
 * Handles email validation, duplicate detection, and position assignment
 */

import { db } from '../db.js';

export class WaitlistService {
  static validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email.trim().toLowerCase());
  }

  static register(email, attribution = {}, consentGiven = false) {
    if (!this.validateEmail(email)) {
      return { success: false, error: 'Invalid email address format', code: 'INVALID_EMAIL' };
    }

    if (!consentGiven) {
      return { success: false, error: 'Consent to terms and privacy is required', code: 'CONSENT_REQUIRED' };
    }

    const result = db.addWaitlistEntry({ email, attribution, consentGiven });

    if (result.isDuplicate) {
      return {
        success: false,
        code: 'DUPLICATE_EMAIL',
        position: result.entry.position,
        message: 'Email already registered on waitlist'
      };
    }

    // Log telemetry event
    db.logEvent({
      type: 'waitlist_registration',
      emailDomain: email.split('@')[1],
      attribution
    });

    return {
      success: true,
      position: result.entry.position,
      id: result.entry.id
    };
  }

  static getStats() {
    const all = db.getWaitlist();
    return {
      totalSignups: all.length,
      recentSignups: all.slice(-5)
    };
  }
}
