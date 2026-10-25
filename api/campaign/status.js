import { getCampaignTimingStatus, parseCookies } from '../../server/campaignService.js';
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
    const cookies = parseCookies(req.headers.cookie);
    const visitorId = req.query?.visitorId || cookies['bday_vid'];
    const existingOfferIdHint = req.query?.existingOfferId || cookies['bday_offer_id'];

    const timing = getCampaignTimingStatus();
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

    // Set first-party cookies for persistent cross-session mobile visitor stability
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
