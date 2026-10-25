import { useState, useEffect, useCallback, useRef } from 'react';
import { CAMPAIGN_CONFIG } from '../data/campaignConfig';

// Storage keys
const VID_KEY = 'bday_sale_visitor_id';
const OFFER_KEY = 'bday_sale_offer';
const SPUN_KEY = 'bday_sale_has_spun';

// Safe cookie helpers
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function setCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return;
  try {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  } catch (e) {
    console.warn('Could not set cookie:', e);
  }
}

function safeGetStorage(key) {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('Could not set localStorage:', e);
  }
}

// Stable visitor ID across mobile reloads, tab closes, and browser restarts
function getOrGenerateVisitorId() {
  if (typeof window === 'undefined') return '';

  // 1. Check localStorage first
  let vid = safeGetStorage(VID_KEY);

  // 2. Fall back to persistent cookie
  if (!vid || vid.length < 8) {
    vid = getCookie('bday_vid');
  }

  // 3. Generate if new
  if (!vid || vid.length < 8) {
    vid = 'vid_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
  }

  // 4. Ensure synced to both localStorage and cookie
  safeSetStorage(VID_KEY, vid);
  setCookie('bday_vid', vid, 365);

  return vid;
}

// Retrieve persisted offer from localStorage or cookie with expiration check
function getPersistedOffer() {
  if (typeof window === 'undefined') return null;

  // 1. Try localStorage
  try {
    const raw = safeGetStorage(OFFER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.offerId) {
        if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
          parsed.isExpired = true;
        }
        return parsed;
      }
    }
  } catch {}

  // 2. Try cookie fallback
  try {
    const cookieRaw = getCookie('bday_offer_data');
    if (cookieRaw) {
      const parsed = JSON.parse(cookieRaw);
      if (parsed && parsed.offerId) {
        if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
          parsed.isExpired = true;
        }
        return parsed;
      }
    }
  } catch {}

  return null;
}

// Save offer to both localStorage and persistent first-party cookie
function persistOffer(offer) {
  if (!offer || !offer.offerId) return;

  try {
    const serialized = JSON.stringify(offer);
    safeSetStorage(OFFER_KEY, serialized);
    safeSetStorage(SPUN_KEY, 'true');

    // 7-day cookie matching campaign offer validity
    setCookie('bday_offer_id', offer.offerId, 7);
    setCookie('bday_offer_data', serialized, 7);
    setCookie('bday_spun', 'true', 7);
  } catch (e) {
    console.warn('Error persisting offer to client storage:', e);
  }
}

function calculateClientTiming() {
  const now = Date.now();
  const isDev = Boolean(import.meta.env.DEV);

  // In local development, activate immediately so testing the live wheel is frictionless
  if (isDev) {
    return {
      name: CAMPAIGN_CONFIG.name,
      active: true,
      status: 'ACTIVE',
      startTimestamp: now - 10000,
      endTimestamp: now + 7 * 86400000,
      remainingToEnd: 7 * 86400000,
      isDevOverride: true
    };
  }

  const isActive = now >= CAMPAIGN_CONFIG.startTimestamp && now < CAMPAIGN_CONFIG.endTimestamp;
  return {
    name: CAMPAIGN_CONFIG.name,
    active: isActive,
    status: now < CAMPAIGN_CONFIG.startTimestamp ? 'BEFORE' : isActive ? 'ACTIVE' : 'ENDED',
    startTimestamp: CAMPAIGN_CONFIG.startTimestamp,
    endTimestamp: CAMPAIGN_CONFIG.endTimestamp,
    remainingToStart: Math.max(0, CAMPAIGN_CONFIG.startTimestamp - now),
    remainingToEnd: Math.max(0, CAMPAIGN_CONFIG.endTimestamp - now)
  };
}

export function useCampaign() {
  const isDev = Boolean(import.meta.env.DEV);

  // Immediately hydrate from persistent client storage before initial render
  const initialVid = getOrGenerateVisitorId();
  const initialOffer = getPersistedOffer();
  const hasInitialOffer = Boolean(initialOffer && initialOffer.offerId);

  const [visitorId, setVisitorId] = useState(initialVid);
  const [loading, setLoading] = useState(true);
  const [timing, setTiming] = useState(calculateClientTiming);
  const [hasSpun, setHasSpun] = useState(hasInitialOffer);
  const [offer, setOffer] = useState(initialOffer);
  const [isSpinning, setIsSpinning] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(Boolean(initialOffer?.claimed));
  const [claimResult, setClaimResult] = useState(
    initialOffer?.claimed ? { message: 'Inquiry submitted', offer: initialOffer } : null
  );
  const [error, setError] = useState('');

  // Modal visibility: if already spun, directly show the ALREADY_SPUN view
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState(hasInitialOffer ? 'ALREADY_SPUN' : 'PROMO');

  const spinLockRef = useRef(false);
  const pendingOfferRef = useRef(null);

  // Sync across multiple browser tabs in real-time
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorageEvent = (e) => {
      if (e.key === OFFER_KEY && e.newValue) {
        try {
          const syncedOffer = JSON.parse(e.newValue);
          if (syncedOffer && syncedOffer.offerId) {
            setOffer(syncedOffer);
            setHasSpun(true);
            setModalView('ALREADY_SPUN');
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  // Initialize and check status with server
  const fetchStatus = useCallback(async (vid) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ visitorId: vid });
      const currentPersisted = getPersistedOffer();
      if (currentPersisted?.offerId) {
        queryParams.set('existingOfferId', currentPersisted.offerId);
      }

      const res = await fetch(`/api/campaign/status?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Status request failed');
      const data = await res.json();

      if (data.success) {
        setTiming(data.timing);

        if (data.existingOffer) {
          // Reconcile with server authoritative state
          persistOffer(data.existingOffer);
          setOffer(data.existingOffer);
          setHasSpun(true);
          if (data.existingOffer.claimed) {
            setClaimSuccess(true);
            setClaimResult({ message: 'Inquiry submitted', offer: data.existingOffer });
          }
        } else if (currentPersisted?.offerId) {
          // Server cold start fallback: protect client's verified offer
          setOffer(currentPersisted);
          setHasSpun(true);
        } else {
          setHasSpun(Boolean(data.hasSpun));
        }
      }
    } catch (err) {
      console.warn('Campaign status fetch fallback:', err);
      setTiming(calculateClientTiming());
      const currentPersisted = getPersistedOffer();
      if (currentPersisted?.offerId) {
        setOffer(currentPersisted);
        setHasSpun(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const vid = getOrGenerateVisitorId();
    setVisitorId(vid);
    fetchStatus(vid);
  }, [fetchStatus]);

  // Spin Wheel action
  const spinWheel = useCallback(async () => {
    // Client-side hard check: Reject if already spun, offer exists, or spin in-flight
    if (hasSpun || offer) {
      console.warn('Spin rejected: visitor already has an active offer.');
      return {
        alreadySpun: true,
        offer: offer || getPersistedOffer(),
        outcomeIndex: offer?.outcomeIndex || 0
      };
    }

    if (spinLockRef.current || isSpinning) return null;
    spinLockRef.current = true;
    setIsSpinning(true);
    setError('');

    try {
      const persisted = getPersistedOffer();
      const res = await fetch('/api/campaign/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          existingOffer: persisted
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete spin. Please try again.');
      }

      // Immediately save to persistent storage so closing tab mid-animation still protects the offer
      persistOffer(data.offer);
      pendingOfferRef.current = data.offer;

      return {
        outcomeIndex: data.outcomeIndex,
        offer: data.offer,
        alreadySpun: data.alreadySpun
      };
    } catch (err) {
      console.error('Spin execution error:', err);
      setError(err.message || 'Error occurred while spinning');
      setIsSpinning(false);
      spinLockRef.current = false;
      pendingOfferRef.current = null;
      return null;
    }
  }, [visitorId, isSpinning, hasSpun, offer]);

  // Finish spin animation callback (invoked when wheel rotation of >= 5s settles)
  const completeSpinAnimation = useCallback(() => {
    if (pendingOfferRef.current) {
      persistOffer(pendingOfferRef.current);
      setOffer(pendingOfferRef.current);
      setHasSpun(true);
      pendingOfferRef.current = null;
    }
    setIsSpinning(false);
    spinLockRef.current = false;
    setModalView('REVEAL');
  }, []);

  // Claim Offer action
  const submitClaim = useCallback(async (formData) => {
    if (claimLoading || !offer) return null;
    setClaimLoading(true);
    setError('');

    try {
      const res = await fetch('/api/campaign/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: offer.offerId,
          visitorId,
          ...formData
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setClaimSuccess(true);
      setClaimResult(data);
      if (data.offer) {
        setOffer(data.offer);
      }
      setModalView('CONFIRMATION');
      return data;
    } catch (err) {
      console.error('Submit claim error:', err);
      setError(err.message || 'Error submitting offer claim');
      throw err;
    } finally {
      setClaimLoading(false);
    }
  }, [claimLoading, offer, visitorId]);

  // Handle countdown transition when reaching 0s (for live launch)
  const handleCountdownComplete = useCallback(() => {
    const liveTiming = {
      name: CAMPAIGN_CONFIG.name,
      active: true,
      status: 'ACTIVE',
      startTimestamp: Date.now() - 1000,
      endTimestamp: Date.now() + 7 * 86400000,
      remainingToEnd: 7 * 86400000,
      isDevOverride: isDev
    };
    setTiming(liveTiming);
    if (!hasSpun) {
      setModalView('PROMO');
    }
  }, [hasSpun, isDev]);

  // Analytics helper
  const trackEvent = useCallback((type, metadata = {}) => {
    if (!visitorId) return;
    try {
      fetch('/api/campaign/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, visitorId, metadata })
      }).catch(() => {});
    } catch {}
  }, [visitorId]);

  const dismissPopup = useCallback((hours = 24) => {
    setIsModalOpen(false);
    localStorage.setItem('bday_popup_dismissed_until', (Date.now() + hours * 3600 * 1000).toString());
    trackEvent('POPUP_DISMISSED');
  }, [trackEvent]);

  const openModal = useCallback((view = null) => {
    setIsModalOpen(true);
    setError('');
    if (view) {
      setModalView(view);
    } else if (hasSpun && offer) {
      setModalView('ALREADY_SPUN');
    } else {
      setModalView('PROMO');
    }
    trackEvent('POPUP_VIEWED');
  }, [hasSpun, offer, trackEvent]);

  return {
    visitorId,
    loading,
    timing,
    hasSpun,
    offer,
    isSpinning,
    claimLoading,
    claimSuccess,
    claimResult,
    error,
    isModalOpen,
    modalView,
    setModalView,
    openModal,
    dismissPopup,
    spinWheel,
    completeSpinAnimation,
    submitClaim,
    handleCountdownComplete,
    trackEvent,
    refreshStatus: () => fetchStatus(visitorId),
    isDev
  };
}
