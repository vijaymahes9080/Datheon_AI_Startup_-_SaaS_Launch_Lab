/**
 * Waitlist API Route Controller
 */

import express from 'express';
import { WaitlistService } from '../services/waitlistService.js';

export const waitlistRouter = express.Router();

waitlistRouter.post('/', (req, res) => {
  const { email, attribution, consentGiven } = req.body;
  const result = WaitlistService.register(email, attribution, consentGiven);

  if (!result.success) {
    if (result.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json(result);
    }
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
});

waitlistRouter.get('/stats', (req, res) => {
  const stats = WaitlistService.getStats();
  return res.json(stats);
});
