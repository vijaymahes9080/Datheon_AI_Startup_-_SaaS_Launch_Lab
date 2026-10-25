/**
 * DealForge AI - Main Full-Stack Application Server
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { waitlistRouter } from './routes/waitlist.js';
import { authRouter } from './routes/auth.js';
import { proposalRouter } from './routes/api.js';
import { checkoutRouter } from './routes/checkout.js';
import { webhookRouter } from './routes/webhooks.js';
import { analyticsRouter } from './routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const app = express();
const PORT = process.env.PORT || 3000;

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Public Static Assets
app.use(express.static(PUBLIC_DIR));

// API Routers
app.use('/api/waitlist', waitlistRouter);
app.use('/api/auth', authRouter);
app.use('/api/proposals', proposalRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/webhooks', webhookRouter);
app.use('/api/analytics', analyticsRouter);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DealForge AI MVP Server',
    timestamp: new Date().toISOString()
  });
});

// Start Server (only if run directly)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`⚡ DealForge AI Server running at http://localhost:${PORT}`);
  });
}

export { app };
