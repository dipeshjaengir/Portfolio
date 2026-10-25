import express from 'express';
import { getCampaignTimingStatus, processSpin, processClaim, parseCookies } from './campaignService.js';
import * as db from './db.js';

export const campaignRouter = express.Router();

function getDevOverride(req) {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) return null;
  return req.headers['x-test-mode'] || req.query.testMode || null;
}

// GET /api/campaign/status
campaignRouter.get('/status', async (req, res) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const visitorId = req.query.visitorId || cookies['bday_vid'];
    const existingOfferIdHint = req.query.existingOfferId || cookies['bday_offer_id'];
    const testMode = getDevOverride(req);
    const timing = getCampaignTimingStatus(Date.now(), testMode);
    let existingOffer = null;
    let isExpired = false;

    if (visitorId) {
      existingOffer = await db.getOfferByVisitorId(visitorId);
    }
    if (!existingOffer && cookies['bday_vid'] && cookies['bday_vid'] !== visitorId) {
      existingOffer = await db.getOfferByVisitorId(cookies['bday_vid']);
    }
    if (!existingOffer && existingOfferIdHint) {
      existingOffer = await db.getOfferById(existingOfferIdHint);
    }

    if (existingOffer) {
      isExpired = new Date(existingOffer.expiresAt).getTime() < Date.now();
    }

    if (visitorId) {
      const cookieHeaders = [
        `bday_vid=${encodeURIComponent(visitorId)}; Path=/; Max-Age=31536000; SameSite=Lax`
      ];
      if (existingOffer) {
        cookieHeaders.push(`bday_offer_id=${encodeURIComponent(existingOffer.offerId)}; Path=/; Max-Age=604800; SameSite=Lax`);
        cookieHeaders.push(`bday_spun=true; Path=/; Max-Age=604800; SameSite=Lax`);
      }
      res.setHeader('Set-Cookie', cookieHeaders);
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
    const cookies = parseCookies(req.headers.cookie);
    const { visitorId: bodyVid, existingOffer: clientOfferHint } = req.body || {};
    const visitorId = bodyVid || cookies['bday_vid'];
    const testMode = getDevOverride(req);
    const result = await processSpin(visitorId, null, testMode, cookies, clientOfferHint);

    if (!result.success) {
      return res.status(result.status || 400).json(result);
    }

    if (result.offer) {
      const cookieHeaders = [
        `bday_vid=${encodeURIComponent(result.offer.visitorId || visitorId)}; Path=/; Max-Age=31536000; SameSite=Lax`,
        `bday_offer_id=${encodeURIComponent(result.offer.offerId)}; Path=/; Max-Age=604800; SameSite=Lax`,
        `bday_spun=true; Path=/; Max-Age=604800; SameSite=Lax`
      ];
      res.setHeader('Set-Cookie', cookieHeaders);
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
