import express from 'express';
import { getCampaignTimingStatus, processSpin, processClaim } from './campaignService.js';
import * as db from './db.js';

export const campaignRouter = express.Router();

function getDevOverride(req) {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) return null;
  return req.headers['x-test-mode'] || req.query.testMode || null;
}

// GET /api/campaign/status
campaignRouter.get('/status', async (req, res) => {
  try {
    const visitorId = req.query.visitorId;
    const testMode = getDevOverride(req);
    const timing = getCampaignTimingStatus(Date.now(), testMode);
    let existingOffer = null;
    let isExpired = false;

    if (visitorId) {
      existingOffer = await db.getOfferByVisitorId(visitorId);
      if (existingOffer) {
        isExpired = new Date(existingOffer.expiresAt).getTime() < Date.now();
      }
    }

    res.json({
      success: true,
      timing,
      hasSpun: !!existingOffer,
      existingOffer: existingOffer
        ? {
            ...existingOffer,
            isExpired
          }
        : null
    });
  } catch (err) {
    console.error('Error fetching campaign status:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/campaign/spin
campaignRouter.post('/spin', async (req, res) => {
  try {
    const { visitorId } = req.body || {};
    const testMode = getDevOverride(req);
    const result = await processSpin(visitorId, null, testMode);

    if (!result.success) {
      return res.status(result.status || 400).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error('Error processing spin:', err);
    res.status(500).json({ success: false, error: 'Internal server error processing spin' });
  }
});

// POST /api/campaign/claim
campaignRouter.post('/claim', async (req, res) => {
  try {
    const testMode = getDevOverride(req);
    const result = await processClaim(req.body || {}, null, testMode);

    if (!result.success) {
      return res.status(result.status || 400).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error('Error processing claim:', err);
    res.status(500).json({ success: false, error: 'Internal server error processing inquiry' });
  }
});

// POST /api/campaign/analytics
campaignRouter.post('/analytics', async (req, res) => {
  try {
    const { type, visitorId, metadata } = req.body || {};
    if (type && visitorId) {
      await db.recordAnalytics({ type, visitorId, metadata });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error recording analytics:', err);
    res.status(500).json({ success: false });
  }
});
