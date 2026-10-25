/**
 * Attribution & Conversion Telemetry Engine
 * Tracks acquisition sources, conversion funnel velocity, and GDPR compliance
 */

import { db } from '../db.js';

export class AnalyticsService {
  /**
   * Record a lifecycle or funnel event
   * @param {string} eventName
   * @param {Object} metadata
   */
  static track(eventName, metadata = {}) {
    const validEvents = [
      'page_view',
      'cta_click',
      'form_start',
      'waitlist_signup_completed',
      'audit_scan_started',
      'audit_scan_completed',
      'checkout_initiated',
      'payment_completed'
    ];

    const sanitizedEvent = {
      event: validEvents.includes(eventName) ? eventName : 'custom_event',
      name: eventName,
      source: metadata.source || 'direct',
      medium: metadata.medium || 'organic',
      campaign: metadata.campaign || 'launch',
      timestamp: Date.now(),
      meta: metadata
    };

    db.logEvent(sanitizedEvent);
    return { success: true, recorded: sanitizedEvent };
  }

  /**
   * Calculate conversion funnel performance and source breakdown
   */
  static getFunnelMetrics() {
    const events = db.state.events || [];
    const waitlist = db.getWaitlist();

    const counts = {
      pageViews: events.filter(e => e.event === 'page_view' || e.name === 'page_view').length || 1,
      ctaClicks: events.filter(e => e.event === 'cta_click' || e.name === 'cta_click').length,
      formStarts: events.filter(e => e.event === 'form_start' || e.name === 'form_start').length,
      waitlistCompleted: waitlist.length,
      checkoutInitiated: events.filter(e => e.event === 'checkout_initiated' || e.name === 'checkout_initiated').length,
      paymentsCompleted: db.state.orders.filter(o => o.status === 'completed').length
    };

    // Calculate source attribution breakdown
    const sourceBreakdown = {};
    waitlist.forEach(w => {
      const src = (w.attribution && w.attribution.source) || 'direct';
      sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
    });

    const conversionRate = counts.pageViews > 0
      ? ((counts.waitlistCompleted / counts.pageViews) * 100).toFixed(1) + '%'
      : '0.0%';

    return {
      funnel: counts,
      visitorToWaitlistRate: conversionRate,
      attributionBreakdown: sourceBreakdown,
      totalWaitlistSignups: waitlist.length
    };
  }
}
