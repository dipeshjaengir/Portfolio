import crypto from 'crypto';
import { CAMPAIGN_CONFIG } from './campaignConfig.js';
import * as db from './db.js';
import nodemailer from 'nodemailer';

// Generate secure random float in [0, 1)
function getSecureRandom() {
  const buf = crypto.randomBytes(4);
  return buf.readUInt32BE(0) / 0xffffffff;
}

// Weighted random selection algorithm using configured probabilities
export function selectWeightedOutcome() {
  const rand = getSecureRandom();
  let cumulative = 0;
  for (let i = 0; i < CAMPAIGN_CONFIG.outcomes.length; i++) {
    cumulative += CAMPAIGN_CONFIG.outcomes[i].probability;
    if (rand < cumulative || i === CAMPAIGN_CONFIG.outcomes.length - 1) {
      const outcome = CAMPAIGN_CONFIG.outcomes[i];
      const discount = outcome.discount;
      const standardPrice = CAMPAIGN_CONFIG.standardPrice;
      const finalPrice = Math.max(0, standardPrice - discount);

      return {
        outcomeIndex: i,
        outcome: {
          ...outcome,
          standardPrice,
          discount,
          savings: discount,
          finalPrice
        }
      };
    }
  }
}

// Check campaign active status against exact timestamps
export function getCampaignTimingStatus(currentTimestamp = Date.now(), devOverride = null) {
  const { startTimestamp, endTimestamp, timezone, name } = CAMPAIGN_CONFIG;

  const isDev = process.env.NODE_ENV !== 'production' && !process.env.VERCEL;

  // Local development overrides for manual UI testing
  if (isDev && devOverride) {
    if (devOverride === 'ACTIVE' || devOverride === 'LIVE') {
      return {
        name,
        timezone,
        status: 'ACTIVE',
        active: true,
        serverTime: currentTimestamp,
        startTimestamp: currentTimestamp - 10000,
        endTimestamp: currentTimestamp + 7 * 86400000,
        remainingToEnd: 7 * 86400000,
        isDevOverride: true
      };
    }
    if (devOverride === 'BEFORE') {
      return {
        name,
        timezone,
        status: 'BEFORE',
        active: false,
        serverTime: currentTimestamp,
        startTimestamp,
        endTimestamp,
        remainingToStart: Math.max(0, startTimestamp - currentTimestamp),
        message: 'Birthday Sale begins on 26 October 2026, 12:00 AM IST',
        isDevOverride: true
      };
    }
    if (devOverride === 'COUNTDOWN_10S') {
      const target = currentTimestamp + 10000;
      return {
        name,
        timezone,
        status: 'BEFORE',
        active: false,
        serverTime: currentTimestamp,
        startTimestamp: target,
        endTimestamp: target + 7 * 86400000,
        remainingToStart: 10000,
        message: 'Birthday Sale begins in 10 seconds (Test Simulation)',
        isDevOverride: true
      };
    }
    if (devOverride === 'ENDED') {
      return {
        name,
        timezone,
        status: 'ENDED',
        active: false,
        serverTime: currentTimestamp,
        startTimestamp,
        endTimestamp,
        message: 'Birthday Sale ended on 2 November 2026, 12:00 AM IST. Valid issued offers remain claimable within their 7-day window.',
        isDevOverride: true
      };
    }
  }

  // By default in local development, activate immediately so user can test the live wheel
  if (isDev && devOverride === null) {
    return {
      name,
      timezone,
      status: 'ACTIVE',
      active: true,
      serverTime: currentTimestamp,
      startTimestamp: currentTimestamp - 10000,
      endTimestamp: currentTimestamp + 7 * 86400000,
      remainingToEnd: 7 * 86400000,
      isDevOverride: true
    };
  }

  if (currentTimestamp < startTimestamp) {
    return {
      name,
      timezone,
      status: 'BEFORE',
      active: false,
      serverTime: currentTimestamp,
      startTimestamp,
      endTimestamp,
      remainingToStart: startTimestamp - currentTimestamp,
      message: 'Birthday Sale begins on 26 October 2026, 12:00 AM IST'
    };
  }

  if (currentTimestamp >= endTimestamp) {
    return {
      name,
      timezone,
      status: 'ENDED',
      active: false,
      serverTime: currentTimestamp,
      startTimestamp,
      endTimestamp,
      message: 'Birthday Sale ended on 2 November 2026, 12:00 AM IST. Valid issued offers remain claimable within their 7-day window.'
    };
  }

  return {
    name,
    timezone,
    status: 'ACTIVE',
    active: true,
    serverTime: currentTimestamp,
    startTimestamp,
    endTimestamp,
    remainingToEnd: endTimestamp - currentTimestamp
  };
}

// Active spin mutex map (visitorId -> Promise) to atomically handle concurrent / simultaneous requests
const activeSpinLocks = new Map();

// Helper to parse cookies from header
export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx > 0) {
      const key = pair.substring(0, idx).trim();
      const val = pair.substring(idx + 1).trim();
      try {
        cookies[key] = decodeURIComponent(val);
      } catch {
        cookies[key] = val;
      }
    }
  }
  return cookies;
}

// Handle visitor spin
export async function processSpin(visitorId, forcedTimestamp = null, devOverride = null, reqCookies = {}, existingOfferHint = null) {
  if (!visitorId || typeof visitorId !== 'string' || visitorId.trim().length < 5) {
    return { success: false, status: 400, error: 'A valid visitor identifier is required', code: 'INVALID_VISITOR_ID' };
  }

  // Atomically handle simultaneous requests from the same visitor
  if (activeSpinLocks.has(visitorId)) {
    return await activeSpinLocks.get(visitorId);
  }

  const spinExecution = (async () => {
    const now = forcedTimestamp || Date.now();
    const timing = getCampaignTimingStatus(now, devOverride);

    // Multi-layer check for existing offer:
    // 1. Direct visitor ID
    let existingOffer = await db.getOfferByVisitorId(visitorId);

    // 2. Cookie visitor ID (if cookie has different/previous visitor ID on mobile)
    if (!existingOffer && reqCookies?.['bday_vid'] && reqCookies['bday_vid'] !== visitorId) {
      existingOffer = await db.getOfferByVisitorId(reqCookies['bday_vid']);
    }

    // 3. Cookie offer ID
    if (!existingOffer && reqCookies?.['bday_offer_id']) {
      existingOffer = await db.getOfferById(reqCookies['bday_offer_id']);
    }

    // 4. Client-side offer hint (e.g. from localStorage)
    if (!existingOffer && existingOfferHint) {
      const hintId = typeof existingOfferHint === 'string' ? existingOfferHint : existingOfferHint.offerId;
      if (hintId) {
        existingOffer = await db.getOfferById(hintId);
        // If not in server storage but valid client-stored offer, restore it
        if (!existingOffer && typeof existingOfferHint === 'object' && existingOfferHint.outcomeIndex !== undefined) {
          const hintExpiry = new Date(existingOfferHint.expiresAt).getTime();
          if (hintExpiry > now && existingOfferHint.campaignId === CAMPAIGN_CONFIG.name) {
            existingOffer = existingOfferHint;
            await db.createOffer(existingOfferHint).catch(() => {});
          }
        }
      }
    }

    if (existingOffer) {
      const isExpired = new Date(existingOffer.expiresAt).getTime() < now;
      return {
        success: true,
        alreadySpun: true,
        offer: existingOffer,
        isExpired,
        outcomeIndex: existingOffer.outcomeIndex,
        message: "You've already unlocked your Birthday Sale offer!"
      };
    }

    // If new visitor, enforce campaign schedule
    if (!timing.active) {
      if (timing.status === 'BEFORE') {
        return { success: false, status: 403, error: timing.message, code: 'CAMPAIGN_NOT_STARTED' };
      }
      return { success: false, status: 403, error: timing.message, code: 'CAMPAIGN_ENDED' };
    }

    // Generate weighted outcome
    const { outcomeIndex, outcome } = selectWeightedOutcome();
    const issuedDate = new Date(now);
    const expiryDate = new Date(now + CAMPAIGN_CONFIG.offerValidityDays * 24 * 60 * 60 * 1000);
    const offerId = `BDAY-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const offerRecord = {
      offerId,
      visitorId,
      campaignId: CAMPAIGN_CONFIG.name,
      outcomeIndex,
      segmentNumber: outcome.segmentNumber,
      prizeId: outcome.id,
      prizeLabel: outcome.label, // e.g. "$200 OFF" or "100% OFF (FREE)"
      discount: outcome.discount,
      finalPrice: outcome.finalPrice,
      standardPrice: CAMPAIGN_CONFIG.standardPrice,
      savings: outcome.discount,
      isFree: Boolean(outcome.isFree),
      issuedAt: issuedDate.toISOString(),
      expiresAt: expiryDate.toISOString(),
      claimed: false,
      inquiryStatus: 'unclaimed'
    };

    const createResult = await db.createOffer(offerRecord);
    await db.recordAnalytics({
      type: 'SPIN_COMPLETED',
      visitorId,
      offerId: createResult.offer.offerId,
      prizeId: createResult.offer.prizeId,
      alreadySpun: createResult.isExisting
    });

    return {
      success: true,
      alreadySpun: createResult.isExisting,
      outcomeIndex: createResult.offer.outcomeIndex,
      offer: createResult.offer
    };
  })();

  activeSpinLocks.set(visitorId, spinExecution);
  try {
    return await spinExecution;
  } finally {
    activeSpinLocks.delete(visitorId);
  }
}

// Handle email inquiry delivery
async function sendInquiryEmail(offer, inquiryData) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const isFree = Boolean(offer.isFree || offer.finalPrice === 0 || offer.discount === 300);
  const subject = `Birthday Sale Website Inquiry — ${offer.prizeLabel}`;
  const plainText = `
Hi Dipesh,

You received a new Birthday Sale website development inquiry!

==================================================
CLIENT DETAILS
==================================================
Name: ${inquiryData.name}
Email: ${inquiryData.email}
Project Type: ${inquiryData.projectType}
Submitted At: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

==================================================
OFFER DETAILS
==================================================
Offer ID: ${offer.offerId}
Selected Offer: ${offer.prizeLabel}
Standard Price: $${offer.standardPrice}
Discount: ${isFree ? '100% OFF ($300 Savings)' : `$${offer.discount || offer.savings} OFF`}
Final Price: $${offer.finalPrice !== undefined ? offer.finalPrice : (offer.standardPrice - (offer.discount || offer.savings))}${isFree ? ' (FREE Basic Portfolio Package)' : ''}
Client Savings: $${offer.discount || offer.savings}
Issued At: ${new Date(offer.issuedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
Valid Until: ${new Date(offer.expiresAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

==================================================
PROJECT REQUIREMENTS
==================================================
${inquiryData.requirements}

==================================================
CAMPAIGN DETAILS
==================================================
Campaign: ${CAMPAIGN_CONFIG.name}
Visitor ID: ${offer.visitorId}
`;

  // If Resend API key is configured (preferred modern serverless delivery)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const fromEmail = process.env.RESEND_FROM || 'Birthday Sale <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [CAMPAIGN_CONFIG.inquiryEmail],
          reply_to: inquiryData.email,
          subject,
          text: plainText
        })
      });

      const resData = await res.json();
      if (res.ok) {
        return { delivered: true, method: 'resend', id: resData.id };
      }
      console.error('[EMAIL] Resend API error response:', resData);
    } catch (err) {
      console.error('[EMAIL] Resend fetch error:', err);
    }
  }

  // If SMTP credentials exist, deliver via nodemailer
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });

      await transporter.sendMail({
        from: `"${inquiryData.name}" <${user}>`,
        replyTo: inquiryData.email,
        to: CAMPAIGN_CONFIG.inquiryEmail,
        subject,
        text: plainText
      });

      return { delivered: true, method: 'smtp' };
    } catch (err) {
      console.error('[EMAIL] SMTP Send error:', err);
      return { delivered: false, error: err.message, method: 'smtp' };
    }
  }

  // If credentials are not provided, log and record inquiry securely in database
  console.warn('[EMAIL] No email credentials configured in environment (RESEND_API_KEY or SMTP_HOST/USER/PASS). Inquiry recorded in database for manual follow-up at dipeshjangir12@gmail.com.');
  return { delivered: false, pendingConfig: true, method: 'database_recorded' };
}

// Handle offer claim and inquiry submission
export async function processClaim(claimPayload, forcedTimestamp = null, devOverride = null) {
  const { offerId, visitorId, name, email, projectType, requirements } = claimPayload;

  if (!offerId || !visitorId) {
    return { success: false, status: 400, error: 'Offer ID and Visitor ID are required', code: 'MISSING_OFFER_DATA' };
  }
  if (!name || !name.trim()) {
    return { success: false, status: 400, error: 'Please provide your full name', code: 'MISSING_NAME' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { success: false, status: 400, error: 'Please provide a valid email address', code: 'INVALID_EMAIL' };
  }
  if (!projectType || !projectType.trim()) {
    return { success: false, status: 400, error: 'Please select a project type', code: 'MISSING_PROJECT_TYPE' };
  }
  if (!requirements || !requirements.trim()) {
    return { success: false, status: 400, error: 'Please describe your project requirements', code: 'MISSING_REQUIREMENTS' };
  }

  // Safe development test bypass (e.g. Preview Free Prize)
  if (offerId.startsWith('TEST-') || claimPayload.isTestPreview) {
    console.log('[TEST MODE] Simulated claim submitted for test offer:', offerId);
    return {
      success: true,
      message: '[TEST MODE] Simulated claim received! Real email delivery was skipped for test data.',
      offer: {
        offerId,
        visitorId,
        campaignId: CAMPAIGN_CONFIG.name,
        prizeLabel: '100% OFF (FREE)',
        discount: 300,
        finalPrice: 0,
        standardPrice: 300,
        savings: 300,
        isFree: true,
        isTestPreview: true,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        claimed: true,
        inquiryStatus: 'submitted'
      },
      emailResult: { delivered: false, simulated: true }
    };
  }

  const now = forcedTimestamp || Date.now();
  const offer = await db.getOfferById(offerId);

  if (!offer) {
    return { success: false, status: 404, error: 'Offer record not found', code: 'OFFER_NOT_FOUND' };
  }

  if (offer.visitorId !== visitorId) {
    return { success: false, status: 403, error: 'This offer does not belong to this visitor identity', code: 'OFFER_MISMATCH' };
  }

  // Validate 7-day expiration
  const expiresAtMs = new Date(offer.expiresAt).getTime();
  if (now > expiresAtMs) {
    return {
      success: false,
      status: 400,
      error: `This offer expired on ${new Date(offer.expiresAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST. Offers are valid for 7 days from issue date.`,
      code: 'OFFER_EXPIRED'
    };
  }

  // Prevent duplicate submissions
  if (offer.claimed && offer.inquiryStatus === 'submitted') {
    return {
      success: false,
      status: 400,
      error: 'An inquiry has already been submitted for this Birthday Sale offer.',
      code: 'ALREADY_SUBMITTED'
    };
  }

  // Attempt email delivery
  const emailResult = await sendInquiryEmail(offer, {
    name: name.trim(),
    email: email.trim(),
    projectType: projectType.trim(),
    requirements: requirements.trim()
  });

  const updatedOffer = await db.claimOffer(offerId, visitorId, {
    name: name.trim(),
    email: email.trim(),
    projectType: projectType.trim(),
    requirements: requirements.trim(),
    inquiryStatus: 'submitted',
    emailDelivered: emailResult.delivered
  });

  await db.recordAnalytics({
    type: 'INQUIRY_SUBMITTED',
    visitorId,
    offerId,
    email: email.trim(),
    emailDelivered: emailResult.delivered
  });

  return {
    success: true,
    message: emailResult.delivered
      ? 'Your inquiry and Birthday Sale offer have been delivered to Dipesh!'
      : 'Your inquiry and Birthday Sale offer have been securely recorded and received for Dipesh to review!',
    offer: updatedOffer,
    emailResult
  };
}
