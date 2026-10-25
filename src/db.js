/**
 * Data Persistence Layer
 * Provides robust multi-tenant data storage for Waitlist, Users, Proposals, and Orders.
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'dealforge_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory cache synced to disk
class DatabaseStore {
  constructor() {
    this.state = {
      waitlist: [],
      users: [],
      proposals: [],
      orders: [],
      events: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.state = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading database store, initializing defaults:', err.message);
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database store:', err.message);
    }
  }

  // Waitlist Operations
  getWaitlist() {
    return this.state.waitlist;
  }

  findWaitlistByEmail(email) {
    const norm = String(email).trim().toLowerCase();
    return this.state.waitlist.find(w => w.email.toLowerCase() === norm);
  }

  addWaitlistEntry(entry) {
    const existing = this.findWaitlistByEmail(entry.email);
    if (existing) {
      return { isDuplicate: true, entry: existing };
    }
    const position = this.state.waitlist.length + 1;
    const newEntry = {
      id: 'wl_' + Math.random().toString(36).substring(2, 9),
      email: entry.email.trim().toLowerCase(),
      position,
      attribution: entry.attribution || {},
      consentGiven: Boolean(entry.consentGiven),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.state.waitlist.push(newEntry);
    this.save();
    return { isDuplicate: false, entry: newEntry };
  }

  // User Operations
  findUserByEmail(email) {
    const norm = String(email).trim().toLowerCase();
    return this.state.users.find(u => u.email.toLowerCase() === norm);
  }

  findUserById(id) {
    return this.state.users.find(u => u.id === id);
  }

  createUser(user) {
    const newUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: user.email.trim().toLowerCase(),
      name: user.name || 'Agency Founder',
      agencyName: user.agencyName || 'Digital Studio',
      passwordHash: user.passwordHash,
      plan: user.plan || 'starter',
      scansUsedThisMonth: 0,
      createdAt: new Date().toISOString()
    };
    this.state.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id, updates) {
    const user = this.findUserById(id);
    if (user) {
      Object.assign(user, updates);
      this.save();
      return user;
    }
    return null;
  }

  // Proposal & Audit Operations
  addProposal(proposal) {
    const newProposal = {
      id: 'prop_' + Math.random().toString(36).substring(2, 9),
      userId: proposal.userId || 'anon',
      title: proposal.title || 'Untitled Statement of Work',
      rawText: proposal.rawText,
      analysis: proposal.analysis,
      createdAt: new Date().toISOString()
    };
    this.state.proposals.push(newProposal);
    this.save();
    return newProposal;
  }

  getUserProposals(userId) {
    return this.state.proposals.filter(p => p.userId === userId);
  }

  // Order & Payment Operations
  createOrder(order) {
    const newOrder = {
      id: 'ord_' + Math.random().toString(36).substring(2, 9),
      userId: order.userId,
      plan: order.plan,
      amount: order.amount,
      currency: order.currency || 'usd',
      status: order.status || 'pending',
      stripeSessionId: order.stripeSessionId,
      createdAt: new Date().toISOString()
    };
    this.state.orders.push(newOrder);
    this.save();
    return newOrder;
  }

  findOrderByStripeSession(sessionId) {
    return this.state.orders.find(o => o.stripeSessionId === sessionId);
  }

  updateOrderStatus(orderId, status) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.save();
      return order;
    }
    return null;
  }

  // Analytics Event Operations
  logEvent(event) {
    this.state.events.push({
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      ...event,
      recordedAt: new Date().toISOString()
    });
    this.save();
  }
}

export const db = new DatabaseStore();
