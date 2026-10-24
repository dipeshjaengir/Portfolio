import express from 'express';
import { getCampaignTimingStatus, processSpin, processClaim } from './campaignService.js';
import * as db from './db.js';

export const campaignRouter = express.Router();

// GET /api/campaign/status
campaignRouter.get('/status', async (req, res) => {
  try {
    const visitorId = req.query.visitorId;
    const timing = getCampaignTimingStatus();
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
    const result = await processSpin(visitorId);

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
    const result = await processClaim(req.body || {});

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
