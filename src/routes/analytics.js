/**
 * Analytics API Route Controller
 */

import express from 'express';
import { AnalyticsService } from '../services/analyticsService.js';

export const analyticsRouter = express.Router();

analyticsRouter.post('/event', (req, res) => {
  const { event, metadata } = req.body;
  const result = AnalyticsService.track(event, metadata);
  return res.json(result);
});

analyticsRouter.get('/funnel', (req, res) => {
  const metrics = AnalyticsService.getFunnelMetrics();
  return res.json(metrics);
});
