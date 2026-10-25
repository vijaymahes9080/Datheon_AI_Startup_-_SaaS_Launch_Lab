/**
 * Proposal & Contract Risk Audit API Controller
 */

import express from 'express';
import { auditEngine } from '../services/auditEngine.js';
import { db } from '../db.js';

export const proposalRouter = express.Router();

/**
 * Execute audit on proposal / SOW text
 */
proposalRouter.post('/audit', (req, res) => {
  const { title, text, dealValue } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Proposal or Statement of Work text is required' });
  }

  const analysis = auditEngine.auditText(text, dealValue);
  const userId = req.user ? req.user.id : 'anon_demo_user';

  // Persist record into data store
  const savedRecord = db.addProposal({
    userId,
    title: title || 'Untitled Proposal Audit',
    rawText: text.substring(0, 5000), // store safe sample
    analysis
  });

  // Track event telemetry
  db.logEvent({
    type: 'audit_scan_completed',
    riskScore: analysis.riskScore,
    riskLevel: analysis.riskLevel,
    flaggedCount: analysis.flaggedCount,
    dealValue: analysis.dealValue
  });

  return res.json({
    proposalId: savedRecord.id,
    ...analysis
  });
});

/**
 * Retrieve user's historical audits
 */
proposalRouter.get('/', (req, res) => {
  const userId = req.user ? req.user.id : 'anon_demo_user';
  const proposals = db.getUserProposals(userId);
  return res.json({
    total: proposals.length,
    proposals
  });
});
