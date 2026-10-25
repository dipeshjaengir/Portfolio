import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// In Vercel serverless functions, the root is read-only; /tmp is the standard writable location
function getWritableDataDir() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return '/tmp';
  }
  return path.join(rootDir, 'data');
}

const dataDir = getWritableDataDir();
const offersFile = path.join(dataDir, 'campaign_offers.json');
const analyticsFile = path.join(dataDir, 'campaign_analytics.json');

// Database state
let mongoClient = null;
let mongoDb = null;
let isMongoInitialized = false;

// Determine active storage provider
export function getStorageProvider() {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (kvUrl && kvToken) {
    return 'upstash_kv';
  }

  if (process.env.MONGODB_URI) {
    return 'mongodb';
  }

  if (process.env.VERCEL) {
    // In Vercel serverless environment with no external database configured
    return 'serverless_unconfigured';
  }

  return 'local_json';
}

export function getStorageDiagnostics() {
  const provider = getStorageProvider();
  return {
    provider,
    persistent: provider === 'upstash_kv' || provider === 'mongodb',
    isServerless: Boolean(process.env.VERCEL),
    notice: provider === 'serverless_unconfigured'
      ? 'Vercel serverless environment detected without persistent storage. Please configure KV_REST_API_URL/TOKEN or MONGODB_URI in Vercel project environment variables.'
      : null
  };
}

// ==================================================
// 1. VERCEL KV / UPSTASH REDIS (HTTP REST)
// ==================================================
async function execKvCommand(cmd) {
  const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, '');
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cmd)
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Upstash KV Error: ${data.error}`);
  }
  return data.result;
}

// ==================================================
// 2. MONGODB ATLAS
// ==================================================
export async function initMongo() {
  if (isMongoInitialized) return mongoDb;
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) return null;

  try {
    const { MongoClient } = await import('mongodb');
    mongoClient = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 4000 });
    await mongoClient.connect();
    const dbName = process.env.MONGODB_DB_NAME || 'developer_portfolio';
    mongoDb = mongoClient.db(dbName);

    // Ensure unique indexes
    await mongoDb.collection('offers').createIndex({ visitorId: 1 }, { unique: true }).catch(() => {});
    await mongoDb.collection('offers').createIndex({ offerId: 1 }, { unique: true }).catch(() => {});
    isMongoInitialized = true;
    return mongoDb;
  } catch (err) {
    console.error('[DB] MongoDB initialization error:', err);
    return null;
  }
}

// Backwards-compatible alias for initMongo
export async function initDb() {
  return initMongo();
}

// ==================================================
// 3. LOCAL FILE STORAGE (Local Offline Dev Only)
// ==================================================
let fileLock = Promise.resolve();
function withFileLock(fn) {
  const next = fileLock.then(fn, fn);
  fileLock = next;
  return next;
}

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readJsonFile(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      ensureDataDir();
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

function writeJsonFileAtomic(filePath, data) {
  ensureDataDir();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// In-memory fallback cache for serverless environments when external db is unconfigured
const memoryFallbackOffers = new Map();
const memoryFallbackVisitors = new Map();
const memoryFallbackAnalytics = [];

// ==================================================
// PUBLIC DATABASE METHODS
// ==================================================

export async function getOfferByVisitorId(visitorId) {
  if (!visitorId) return null;
  const provider = getStorageProvider();

  // 1. Upstash Redis / Vercel KV
  if (provider === 'upstash_kv') {
    const offerId = await execKvCommand(['GET', `bday:visitor:${visitorId}`]);
    if (!offerId) return null;
    const raw = await execKvCommand(['GET', `bday:offer:${offerId}`]);
    return raw ? JSON.parse(raw) : null;
  }

  // 2. MongoDB Atlas
  if (provider === 'mongodb') {
    const db = await initMongo();
    if (db) {
      return await db.collection('offers').findOne({ visitorId });
    }
  }

  // 3. Serverless Unconfigured Guard (Memory + /tmp file persistence)
  if (provider === 'serverless_unconfigured') {
    const offerId = memoryFallbackVisitors.get(visitorId);
    if (offerId && memoryFallbackOffers.has(offerId)) {
      return memoryFallbackOffers.get(offerId);
    }
    // Also check writable /tmp file fallback
    try {
      const offers = readJsonFile(offersFile, []);
      const found = offers.find((o) => o.visitorId === visitorId);
      if (found) {
        memoryFallbackVisitors.set(visitorId, found.offerId);
        memoryFallbackOffers.set(found.offerId, found);
        return found;
      }
    } catch {}
    return null;
  }

  // 4. Local JSON File (Offline Dev)
  return withFileLock(() => {
    const offers = readJsonFile(offersFile, []);
    return offers.find((o) => o.visitorId === visitorId) || null;
  });
}

export async function getOfferById(offerId) {
  if (!offerId) return null;
  const provider = getStorageProvider();

  if (provider === 'upstash_kv') {
    const raw = await execKvCommand(['GET', `bday:offer:${offerId}`]);
    return raw ? JSON.parse(raw) : null;
  }

  if (provider === 'mongodb') {
    const db = await initMongo();
    if (db) {
      return await db.collection('offers').findOne({ offerId });
    }
  }

  if (provider === 'serverless_unconfigured') {
    if (memoryFallbackOffers.has(offerId)) {
      return memoryFallbackOffers.get(offerId);
    }
    try {
      const offers = readJsonFile(offersFile, []);
      const found = offers.find((o) => o.offerId === offerId);
      if (found) {
        memoryFallbackOffers.set(offerId, found);
        return found;
      }
    } catch {}
    return null;
  }

  return withFileLock(() => {
    const offers = readJsonFile(offersFile, []);
    return offers.find((o) => o.offerId === offerId) || null;
  });
}

export async function createOffer(offerData) {
  if (!offerData.visitorId || !offerData.offerId) {
    throw new Error('Missing visitorId or offerId');
  }
  const provider = getStorageProvider();

  // 1. Upstash KV / Vercel KV
  if (provider === 'upstash_kv') {
    // Atomic SET if Not Exists
    const setVisitorResult = await execKvCommand([
      'SET',
      `bday:visitor:${offerData.visitorId}`,
      offerData.offerId,
      'NX'
    ]);

    // If NX was not set, visitor already has an offer
    if (!setVisitorResult || setVisitorResult !== 'OK') {
      const existingOffer = await getOfferByVisitorId(offerData.visitorId);
      return { success: true, offer: existingOffer, isExisting: true };
    }

    // Save offer payload
    await execKvCommand([
      'SET',
      `bday:offer:${offerData.offerId}`,
      JSON.stringify(offerData)
    ]);

    return { success: true, offer: offerData, isExisting: false };
  }

  // 2. MongoDB Atlas
  if (provider === 'mongodb') {
    const db = await initMongo();
    if (db) {
      try {
        await db.collection('offers').insertOne({ ...offerData });
        return { success: true, offer: offerData, isExisting: false };
      } catch (err) {
        if (err.code === 11000) {
          const existing = await db.collection('offers').findOne({ visitorId: offerData.visitorId });
          return { success: true, offer: existing, isExisting: true };
        }
        throw err;
      }
    }
  }

  // 3. Serverless Unconfigured Guard (Memory + /tmp file persistence)
  if (provider === 'serverless_unconfigured') {
    // Check in-memory first
    let existingOffer = null;
    if (memoryFallbackVisitors.has(offerData.visitorId)) {
      const existingOfferId = memoryFallbackVisitors.get(offerData.visitorId);
      existingOffer = memoryFallbackOffers.get(existingOfferId);
    }
    // Check /tmp file
    if (!existingOffer) {
      try {
        const offers = readJsonFile(offersFile, []);
        existingOffer = offers.find((o) => o.visitorId === offerData.visitorId);
      } catch {}
    }

    if (existingOffer) {
      memoryFallbackVisitors.set(offerData.visitorId, existingOffer.offerId);
      memoryFallbackOffers.set(existingOffer.offerId, existingOffer);
      return { success: true, offer: existingOffer, isExisting: true };
    }

    // Save to memory
    memoryFallbackVisitors.set(offerData.visitorId, offerData.offerId);
    memoryFallbackOffers.set(offerData.offerId, offerData);

    // Persist to /tmp file
    withFileLock(() => {
      try {
        const offers = readJsonFile(offersFile, []);
        if (!offers.find((o) => o.visitorId === offerData.visitorId)) {
          offers.push(offerData);
          writeJsonFileAtomic(offersFile, offers);
        }
      } catch (err) {
        console.warn('[STORAGE] /tmp write fallback note:', err);
      }
    });

    return { success: true, offer: offerData, isExisting: false };
  }

  // 4. Local JSON File (Offline Dev)
  return withFileLock(() => {
    const offers = readJsonFile(offersFile, []);
    const existing = offers.find((o) => o.visitorId === offerData.visitorId);
    if (existing) {
      return { success: true, offer: existing, isExisting: true };
    }
    offers.push(offerData);
    writeJsonFileAtomic(offersFile, offers);
    return { success: true, offer: offerData, isExisting: false };
  });
}

export async function claimOffer(offerId, visitorId, claimData) {
  const updatePayload = {
    claimed: true,
    claimedAt: new Date().toISOString(),
    clientName: claimData.name,
    clientEmail: claimData.email,
    projectType: claimData.projectType,
    requirements: claimData.requirements,
    inquiryStatus: claimData.inquiryStatus || 'recorded'
  };

  const provider = getStorageProvider();

  // 1. Upstash KV
  if (provider === 'upstash_kv') {
    const existing = await getOfferById(offerId);
    if (!existing || existing.visitorId !== visitorId) return null;
    const updated = { ...existing, ...updatePayload };
    await execKvCommand(['SET', `bday:offer:${offerId}`, JSON.stringify(updated)]);
    return updated;
  }

  // 2. MongoDB
  if (provider === 'mongodb') {
    const db = await initMongo();
    if (db) {
      const res = await db.collection('offers').findOneAndUpdate(
        { offerId, visitorId },
        { $set: updatePayload },
        { returnDocument: 'after' }
      );
      return res?.value || res;
    }
  }

  // 3. Serverless Unconfigured Guard
  if (provider === 'serverless_unconfigured') {
    let existing = memoryFallbackOffers.get(offerId);
    if (!existing) {
      try {
        const offers = readJsonFile(offersFile, []);
        existing = offers.find((o) => o.offerId === offerId && o.visitorId === visitorId);
      } catch {}
    }
    if (!existing || existing.visitorId !== visitorId) return null;
    const updated = { ...existing, ...updatePayload };
    memoryFallbackOffers.set(offerId, updated);
    withFileLock(() => {
      try {
        const offers = readJsonFile(offersFile, []);
        const idx = offers.findIndex((o) => o.offerId === offerId && o.visitorId === visitorId);
        if (idx !== -1) {
          offers[idx] = updated;
          writeJsonFileAtomic(offersFile, offers);
        }
      } catch {}
    });
    return updated;
  }

  // 4. Local JSON File
  return withFileLock(() => {
    const offers = readJsonFile(offersFile, []);
    const index = offers.findIndex((o) => o.offerId === offerId && o.visitorId === visitorId);
    if (index === -1) return null;
    offers[index] = { ...offers[index], ...updatePayload };
    writeJsonFileAtomic(offersFile, offers);
    return offers[index];
  });
}

export async function recordAnalytics(eventData) {
  const payload = {
    ...eventData,
    timestamp: new Date().toISOString()
  };

  const provider = getStorageProvider();

  if (provider === 'upstash_kv') {
    await execKvCommand(['LPUSH', 'bday:analytics', JSON.stringify(payload)]).catch(() => {});
    await execKvCommand(['LTRIM', 'bday:analytics', '0', '999']).catch(() => {});
    return;
  }

  if (provider === 'mongodb') {
    const db = await initMongo();
    if (db) {
      await db.collection('analytics').insertOne(payload).catch(() => {});
      return;
    }
  }

  if (provider === 'serverless_unconfigured') {
    memoryFallbackAnalytics.push(payload);
    if (memoryFallbackAnalytics.length > 500) memoryFallbackAnalytics.shift();
    return;
  }

  return withFileLock(() => {
    const events = readJsonFile(analyticsFile, []);
    events.push(payload);
    if (events.length > 2000) events.shift();
    writeJsonFileAtomic(analyticsFile, events);
  });
}

export async function getAllOffers() {
  const provider = getStorageProvider();

  if (provider === 'mongodb') {
    const db = await initMongo();
    if (db) {
      return await db.collection('offers').find({}).toArray();
    }
  }

  if (provider === 'serverless_unconfigured') {
    return Array.from(memoryFallbackOffers.values());
  }

  return withFileLock(() => {
    return readJsonFile(offersFile, []);
  });
}

export async function saveAllOffers(offers) {
  return withFileLock(() => {
    writeJsonFileAtomic(offersFile, offers);
  });
}
