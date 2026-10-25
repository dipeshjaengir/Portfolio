import { processSpin, parseCookies } from '../../server/campaignService.js';

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const cookies = parseCookies(req.headers.cookie);
    const body = parseBody(req);
    const visitorId = body?.visitorId || cookies['bday_vid'];
    const clientOfferHint = body?.existingOffer || cookies['bday_offer_id'];

    const result = await processSpin(visitorId, null, null, cookies, clientOfferHint);

    if (!result.success) {
      return res.status(result.status || 400).json(result);
    }

    // Set first-party HTTP cookies for cross-session and mobile stability
    if (result.offer) {
      const cookieHeaders = [
        `bday_vid=${encodeURIComponent(result.offer.visitorId || visitorId)}; Path=/; Max-Age=31536000; SameSite=Lax`,
        `bday_offer_id=${encodeURIComponent(result.offer.offerId)}; Path=/; Max-Age=604800; SameSite=Lax`,
        `bday_spun=true; Path=/; Max-Age=604800; SameSite=Lax`
      ];
      res.setHeader('Set-Cookie', cookieHeaders);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('[API /spin] Error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error processing spin' });
  }
}
