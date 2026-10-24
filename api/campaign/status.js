import { getCampaignTimingStatus } from '../../server/campaignService.js';
import * as db from '../../server/db.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const visitorId = req.query?.visitorId;
    const timing = getCampaignTimingStatus();
    let existingOffer = null;
    let isExpired = false;

    if (visitorId) {
      existingOffer = await db.getOfferByVisitorId(visitorId);
      if (existingOffer) {
        isExpired = new Date(existingOffer.expiresAt).getTime() < Date.now();
      }
    }

    const storageInfo = db.getStorageDiagnostics();

    return res.status(200).json({
      success: true,
      timing,
      hasSpun: !!existingOffer,
      existingOffer: existingOffer
        ? {
            ...existingOffer,
            isExpired
          }
        : null,
      storage: storageInfo
    });
  } catch (err) {
    console.error('[API /status] Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
