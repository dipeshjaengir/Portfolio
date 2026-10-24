import { useState, useEffect, useCallback, useRef } from 'react';
import { CAMPAIGN_CONFIG } from '../data/campaignConfig';

function getOrGenerateVisitorId() {
  if (typeof window === 'undefined') return '';
  const KEY = 'bday_sale_visitor_id';
  let vid = localStorage.getItem(KEY);
  if (!vid || vid.length < 8) {
    vid = 'vid_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
    localStorage.setItem(KEY, vid);
  }
  return vid;
}

function calculateClientTiming() {
  const now = Date.now();
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
  const [visitorId, setVisitorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [timing, setTiming] = useState(calculateClientTiming);
  const [hasSpun, setHasSpun] = useState(false);
  const [offer, setOffer] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimResult, setClaimResult] = useState(null);
  const [error, setError] = useState('');

  // Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // View states: 'PROMO', 'WHEEL', 'REVEAL', 'CLAIM', 'CONFIRMATION', 'ALREADY_SPUN'
  const [modalView, setModalView] = useState('PROMO');

  const spinLockRef = useRef(false);
  const hasAutoOpenedRef = useRef(false);

  // Initialize and check status with server
  const fetchStatus = useCallback(async (vid) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/campaign/status?visitorId=${encodeURIComponent(vid)}`);
      if (!res.ok) throw new Error('Status request failed');
      const data = await res.json();

      if (data.success) {
        setTiming(data.timing);
        setHasSpun(Boolean(data.hasSpun));
        if (data.existingOffer) {
          setOffer(data.existingOffer);
          if (data.existingOffer.claimed) {
            setClaimSuccess(true);
            setClaimResult({ message: 'Inquiry submitted', offer: data.existingOffer });
          }
        }
      }
    } catch (err) {
      console.warn('Campaign status fetch fallback:', err);
      // Fallback timing calculation on client
      const now = Date.now();
      const isActive = now >= CAMPAIGN_CONFIG.startTimestamp && now < CAMPAIGN_CONFIG.endTimestamp;
      setTiming({
        name: CAMPAIGN_CONFIG.name,
        active: isActive,
        status: now < CAMPAIGN_CONFIG.startTimestamp ? 'BEFORE' : isActive ? 'ACTIVE' : 'ENDED',
        startTimestamp: CAMPAIGN_CONFIG.startTimestamp,
        endTimestamp: CAMPAIGN_CONFIG.endTimestamp,
        remainingToStart: Math.max(0, CAMPAIGN_CONFIG.startTimestamp - now),
        remainingToEnd: Math.max(0, CAMPAIGN_CONFIG.endTimestamp - now)
      });
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
    if (spinLockRef.current || isSpinning) return null;
    spinLockRef.current = true;
    setIsSpinning(true);
    setError('');

    try {
      const res = await fetch('/api/campaign/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete spin. Please try again.');
      }

      setHasSpun(true);
      setOffer(data.offer);

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
      return null;
    }
  }, [visitorId, isSpinning]);

  // Finish spin animation callback (only invoked when wheel rotation of >= 5s completes)
  const completeSpinAnimation = useCallback(() => {
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
    trackEvent,
    refreshStatus: () => fetchStatus(visitorId)
  };
}
