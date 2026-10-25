/**
 * Authentication API Route Controller & Route Guard Middleware
 */

import express from 'express';
import { AuthService } from '../services/authService.js';
import { db } from '../db.js';

export const authRouter = express.Router();

/**
 * Route guard middleware to protect private API endpoints
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  const payload = AuthService.verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session token' });
  }

  req.user = payload;
  next();
}

authRouter.post('/register', (req, res) => {
  const result = AuthService.register(req.body);
  if (!result.success) {
    return res.status(result.code === 'EMAIL_EXISTS' ? 409 : 400).json(result);
  }
  return res.status(201).json(result);
});

authRouter.post('/login', (req, res) => {
  const result = AuthService.login(req.body);
  if (!result.success) {
    return res.status(401).json(result);
  }
  return res.json(result);
});

authRouter.get('/me', requireAuth, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User account not found' });
  }
  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      agencyName: user.agencyName,
      plan: user.plan,
      scansUsedThisMonth: user.scansUsedThisMonth || 0
    }
  });
});
