import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, Lock, Mail, Sparkles, AlertCircle
} from 'lucide-react';
import { Instagram } from '../SocialIcons';
import { SpinWheel } from './SpinWheel';
import { CampaignCountdown } from './CampaignCountdown';
import { PackageScopeDetails } from './PackageScopeDetails';
import { OfferScreenshotCard } from './OfferScreenshotCard';
import { OfferSummaryPanel } from './OfferSummaryPanel';
import { GiftBoxGraphic } from './GiftBoxGraphic';
import { CAMPAIGN_CONFIG } from '../../data/campaignConfig';

export const BirthdaySaleModal = ({ campaign }) => {
  const {
    isModalOpen,
    modalView,
    setModalView,
    dismissPopup,
    timing,
    offer,
    isSpinning,
    spinWheel,
    completeSpinAnimation,
    submitClaim,
    claimLoading,
    error
  } = campaign;

  // Claim Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Personal Portfolio Website',
    requirements: ''
  });
  const [formValidationError, setFormValidationError] = useState('');

  const isBeforeLaunch = timing?.status === 'BEFORE';
  const isActive = Boolean(timing?.active);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setFormValidationError('');

    if (!formData.name.trim()) {
      setFormValidationError('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormValidationError('Please enter a valid email address.');
      return;
    }
    if (!formData.requirements.trim()) {
      setFormValidationError('Please describe your project requirements.');
      return;
    }

    try {
      await submitClaim(formData);
    } catch {
      // Handled in hook state
    }
  };

  const formatExpiryIST = (isoString) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' IST';
    } catch {
      return isoString;
    }
  };

  // Generate mailto: link for reliable email fallback to dipeshjangir12@gmail.com
  const generateMailtoLink = () => {
    const recipient = CAMPAIGN_CONFIG?.inquiryEmail || 'dipeshjangir12@gmail.com';
    const isFree = Boolean(offer?.isFree || offer?.finalPrice === 0 || offer?.discount === 300);
    const discountVal = offer?.discount ?? offer?.savings ?? 200;
    const finalPriceVal = offer?.finalPrice !== undefined ? offer.finalPrice : (300 - discountVal);
    const subject = isFree
      ? `Birthday Sale Website Inquiry — 100% OFF (FREE Basic Portfolio) (${offer?.offerId || ''})`
      : `Birthday Sale Website Inquiry — $${discountVal} OFF (${offer?.offerId || ''})`;

    const body = `Hi Dipesh,

I would like to claim my Birthday Sale website development offer!

CLIENT DETAILS:
- Name: ${formData.name || '[Your Name]'}
- Email: ${formData.email || '[Your Email]'}
- Project Type: ${formData.projectType || 'Personal Portfolio Website'}

OFFER DETAILS:
- Offer ID: ${offer?.offerId || 'N/A'}
- Unlocked Discount: ${isFree ? '100% OFF (FREE Basic Portfolio)' : `$${discountVal} OFF`}
- Standard Package: $300
- Final Development Price: $${finalPriceVal}${isFree ? ' (FREE Basic Portfolio)' : ''}
- Client Savings: $${discountVal}
- Valid Until: ${formatExpiryIST(offer?.expiresAt)}

PROJECT REQUIREMENTS:
${formData.requirements || '[Describe your project vision and goals]'}

Looking forward to hearing from you!`;

    return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Smooth scroll to portfolio without page reload
  const handleExplorePortfolio = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    dismissPopup(24);
    setTimeout(() => {
      const target = document.getElementById('projects') || document.getElementById('about');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSpinning) {
              e.preventDefault();
              dismissPopup(24);
            }
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none"
        >
          {/* Backdrop with subtle dark blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isSpinning) dismissPopup(24);
            }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Window Container - Matches Reference Image Exactly */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#050814] border border-blue-500/40 rounded-[28px] shadow-[0_0_55px_rgba(0,140,255,0.28)] p-5 sm:p-7 max-h-[92vh] overflow-y-auto text-white z-10 my-auto text-center overflow-x-hidden"
          >
            {/* Ambient Electric Blue Radial Glow in Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Decorative Electric-Blue Confetti Pieces (Matching Reference Graphic) */}
            <div className="absolute top-10 left-3 w-2.5 h-4 bg-sky-400 rotate-45 rounded-sm opacity-70 pointer-events-none" />
            <div className="absolute top-28 left-5 w-2 h-2 bg-blue-500 -rotate-12 rounded-sm opacity-60 pointer-events-none" />
            <div className="absolute top-16 right-4 w-3 h-2 bg-cyan-300 rotate-30 rounded-sm opacity-65 pointer-events-none" />
            <div className="absolute top-36 right-5 w-2 h-4.5 bg-blue-600 -rotate-45 rounded-sm opacity-75 pointer-events-none" />
            <div className="absolute bottom-28 left-4 w-2 h-4 bg-sky-500 rotate-12 rounded-sm opacity-60 pointer-events-none" />
            <div className="absolute bottom-12 right-4 w-2.5 h-3.5 bg-cyan-400 rotate-45 rounded-sm opacity-70 pointer-events-none" />

            {/* Circular Close Button (Top-Right) */}
            {!isSpinning && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dismissPopup(24);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-sky-500/35 bg-blue-950/60 hover:bg-blue-900/80 text-sky-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-30"
                aria-label="Close Birthday Sale"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* ======================================================== */}
            {/* VIEW 1: BEFORE LIVE (TIMER) — LEFT SIDE OF REFERENCE     */}
            {/* ======================================================== */}
            {isBeforeLaunch && modalView === 'PROMO' && (
              <div className="flex flex-col items-center space-y-3.5">
                {/* Badge: BIRTHDAY SALE — TOMORROW */}
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-950/70 border border-blue-500/40 rounded-full text-sky-400 font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(0,140,255,0.2)]">
                  <span>🎂 BIRTHDAY SALE — TOMORROW</span>
                </div>

                {/* Headings */}
                <div className="space-y-0.5">
                  <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight">
                    MY BIRTHDAY.
                  </h3>
                  <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-sky-400 uppercase leading-tight drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                    YOUR WEBSITE DEAL.
                  </h3>
                </div>

                {/* Subtitle */}
                <p className="text-zinc-300 font-sans text-xs sm:text-sm font-normal leading-relaxed max-w-sm">
                  Spin the wheel to unlock an <strong className="text-sky-400 font-semibold">exclusive deal</strong> on your next website.
                </p>

                {/* Promotional Price Panel — Matches Reference Design */}
                <div className="w-full py-4 px-4 sm:px-6 bg-gradient-to-b from-blue-950/50 to-[#071126]/75 border border-blue-500/40 rounded-2xl shadow-[0_4px_25px_rgba(0,140,255,0.18)]">
                  <div className="grid grid-cols-2 divide-x divide-blue-500/25 items-center text-center">
                    {/* Left Column: UP TO 100% OFF */}
                    <div className="flex flex-col items-center justify-center px-2 py-1">
                      <span className="font-mono text-[11px] sm:text-xs font-bold text-sky-300/80 tracking-widest uppercase">
                        UP TO
                      </span>
                      <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-sky-400 tracking-tight drop-shadow-[0_0_18px_rgba(56,189,248,0.7)] mt-0.5">
                        100% OFF
                      </span>
                    </div>

                    {/* Right Column: STANDARD PRICE $300 */}
                    <div className="flex flex-col items-center justify-center px-2 py-1">
                      <span className="font-mono text-[11px] sm:text-xs font-bold text-zinc-400 tracking-widest uppercase">
                        STANDARD PRICE
                      </span>
                      <span className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-zinc-400 line-through decoration-zinc-500 decoration-2 mt-0.5">
                        $300
                      </span>
                    </div>
                  </div>

                  {/* Supporting Text */}
                  <p className="text-[11px] sm:text-xs font-sans text-zinc-300 text-center pt-2.5 border-t border-blue-500/20 mt-3">
                    Your next website, at a <span className="text-sky-400 font-medium">special birthday price</span>.
                  </p>
                </div>

                {/* 4-Box Countdown: THE SALE GOES LIVE IN */}
                <div className="w-full py-1">
                  <CampaignCountdown
                    targetTimestamp={timing?.startTimestamp || CAMPAIGN_CONFIG.startTimestamp}
                    label="THE SALE GOES LIVE IN"
                  />
                </div>

                {/* Disabled Button: THE WHEEL UNLOCKS WHEN THE SALE GOES LIVE */}
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-4 bg-blue-950/40 border border-blue-500/30 text-sky-300/80 font-display font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                  <Lock className="w-4 h-4 text-sky-400" />
                  <span>THE WHEEL UNLOCKS WHEN THE SALE GOES LIVE</span>
                </button>

                {/* Bottom Graphic & Handwritten Message */}
                <div className="w-full flex items-center justify-between pt-1 px-1">
                  {/* Left: 3D Black Gift Box with Electric Blue Ribbon */}
                  <GiftBoxGraphic className="w-24 h-24 sm:w-28 sm:h-28 -ml-2" />

                  {/* Right: Handwritten Message with Curved Arrow */}
                  <div className="flex-1 flex flex-col items-end text-right pl-2 relative">
                    {/* Curved Arrow SVG pointing to button */}
                    <svg
                      viewBox="0 0 60 40"
                      fill="none"
                      className="w-8 h-8 text-sky-400 mb-1 mr-4 -rotate-12"
                    >
                      <path
                        d="M 10 35 C 30 35, 45 25, 48 10"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 40 12 L 48 8 L 52 18"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <p className="font-sans italic font-medium text-xs sm:text-sm text-sky-200 leading-tight">
                      Come back tomorrow<br />
                      to spin & reveal your deal. <span className="text-sky-400 not-italic">💙</span>
                    </p>
                  </div>
                </div>

                {/* Explore Portfolio Action */}
                <div className="w-full pt-1">
                  <button
                    type="button"
                    onClick={handleExplorePortfolio}
                    className="w-full py-2 px-4 text-zinc-400 hover:text-sky-300 font-mono text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Explore My Portfolio →
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: LIVE (WHEEL ACTIVE) — RIGHT SIDE OF REFERENCE     */}
            {/* ======================================================== */}
            {((isActive && modalView === 'PROMO') || modalView === 'WHEEL') && (
              <div className="flex flex-col items-center space-y-3">
                {/* Badge: BIRTHDAY SALE — LIVE NOW 🟢 */}
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-950/70 border border-blue-500/40 rounded-full text-sky-400 font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(0,140,255,0.2)]">
                  <span>🎂 BIRTHDAY SALE — LIVE NOW</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5" />
                </div>

                {/* Headings */}
                <div className="space-y-0.5">
                  <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight">
                    SPIN THE WHEEL
                  </h3>
                  <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-sky-400 uppercase leading-tight drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                    & UNLOCK YOUR DEAL.
                  </h3>
                </div>

                {/* Subtitle */}
                <p className="text-zinc-300 font-sans text-xs sm:text-sm font-normal leading-relaxed max-w-sm">
                  Try your luck and get an <strong className="text-sky-400 font-semibold">exclusive discount</strong> on your next website.
                </p>

                {/* The 8-Segment Glowing Electric-Blue Wheel */}
                <SpinWheel
                  onSpin={spinWheel}
                  onAnimationComplete={completeSpinAnimation}
                  disabled={isSpinning}
                  isSpinning={isSpinning}
                />

                {/* 3-Column Offer Summary Panel (Directly Below Wheel) */}
                <OfferSummaryPanel offer={offer} standardPrice={CAMPAIGN_CONFIG.standardPrice} />

                {error && (
                  <div className="w-full p-2.5 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 3: REVEAL / UNLOCKED OFFER & CLAIM INQUIRY FORM     */}
            {/* ======================================================== */}
            {(modalView === 'REVEAL' || modalView === 'CLAIM') && offer && (
              <div className="flex flex-col items-center space-y-3.5">
                {/* Congratulations Header */}
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-950/70 border border-blue-500/40 rounded-full text-sky-400 font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(0,140,255,0.3)]">
                  <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                  <span>CONGRATULATIONS! OFFER UNLOCKED</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight">
                    YOU UNLOCKED{' '}
                    <span className="text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
                      {(offer.isFree || offer.finalPrice === 0) ? '100% OFF (FREE)!' : `$${offer.discount || offer.savings} OFF!`}
                    </span>
                  </h3>
                  <p className="font-display text-sm sm:text-base font-bold text-sky-300 tracking-wide">
                    Final Website Price: ${offer.finalPrice !== undefined ? offer.finalPrice : (300 - (offer.discount || offer.savings))}
                    {(offer.isFree || offer.finalPrice === 0) && ' (Save $300)'}
                  </p>
                </div>

                {/* 100% OFF Grand Prize Scope Notice */}
                {(offer.isFree || offer.finalPrice === 0) && (
                  <div className="w-full p-2.5 bg-blue-950/60 border border-sky-400/40 rounded-xl text-xs text-sky-200 font-sans text-center">
                    🎉 <strong>100% OFF Grand Prize:</strong> Covers the full cost ($300 value) of our limited-scope <strong>Basic Portfolio Website package</strong> at <strong>$0</strong>!
                  </div>
                )}

                {/* 3-Column Offer Summary Panel */}
                <OfferSummaryPanel offer={offer} standardPrice={CAMPAIGN_CONFIG.standardPrice} />

                {/* Validity Note */}
                <div className="w-full py-2 px-3 bg-[#060D1E] border border-blue-500/30 rounded-xl flex items-center justify-between text-[11px] font-mono text-zinc-300">
                  <span className="text-zinc-400">Voucher Code:</span>
                  <span className="font-bold text-white tracking-wider">{offer.offerId}</span>
                  <span className="text-sky-400 font-bold">Valid for 7 Days</span>
                </div>

                {/* Claim Inquiry Form */}
                <form onSubmit={handleClaimSubmit} className="w-full space-y-3 text-left pt-1">
                  <div>
                    <label className="block text-[11px] font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Alex Johnson"
                      className="w-full py-2.5 px-3 bg-[#060D1E] border border-blue-500/40 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 rounded-xl text-white text-xs outline-none transition-all placeholder:text-zinc-600 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="alex@example.com"
                      className="w-full py-2.5 px-3 bg-[#060D1E] border border-blue-500/40 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 rounded-xl text-white text-xs outline-none transition-all placeholder:text-zinc-600 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full py-2.5 px-3 bg-[#060D1E] border border-blue-500/40 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 rounded-xl text-white text-xs outline-none transition-all font-sans cursor-pointer"
                    >
                      <option value="Personal Portfolio Website">Personal Portfolio Website</option>
                      <option value="Freelance / Agency Showcase">Freelance / Agency Showcase</option>
                      <option value="Business Landing Page">Business Landing Page</option>
                      <option value="Creator / Link-in-Bio Platform">Creator / Link-in-Bio Platform</option>
                      <option value="Custom Web App Frontend">Custom Web App Frontend</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                      Project Vision / Requirements *
                    </label>
                    <textarea
                      name="requirements"
                      required
                      rows={3}
                      value={formData.requirements}
                      onChange={handleInputChange}
                      placeholder="Briefly describe what you'd like your website to include (e.g. pages, preferred style, inspirations)..."
                      className="w-full py-2.5 px-3 bg-[#060D1E] border border-blue-500/40 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 rounded-xl text-white text-xs outline-none transition-all placeholder:text-zinc-600 font-sans resize-none"
                    />
                  </div>

                  {formValidationError && (
                    <p className="text-xs text-red-400 font-mono">{formValidationError}</p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={claimLoading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-400 hover:from-blue-600 hover:via-sky-400 hover:to-cyan-300 text-white font-display font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-[0_0_25px_rgba(0,140,255,0.45)] cursor-pointer transition-all disabled:opacity-50 disabled:cursor-wait"
                  >
                    {claimLoading
                      ? 'SUBMITTING INQUIRY...'
                      : (offer.isFree || offer.finalPrice === 0)
                      ? 'CLAIM FREE BASIC PORTFOLIO ($0)'
                      : `CLAIM DEAL FOR $${offer.finalPrice !== undefined ? offer.finalPrice : (300 - (offer.discount || offer.savings))}`}
                  </button>

                  {/* Mailto Fallback */}
                  <a
                    href={generateMailtoLink()}
                    className="w-full py-2.5 px-3 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 text-sky-300 font-mono text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span>Send via Direct Email App (dipeshjangir12@gmail.com)</span>
                  </a>
                </form>

                {/* Scope Accordion */}
                <PackageScopeDetails />
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 4: CONFIRMATION / SUCCESS                           */}
            {/* ======================================================== */}
            {modalView === 'CONFIRMATION' && offer && (
              <div className="flex flex-col items-center space-y-3.5">
                <div className="w-14 h-14 rounded-full bg-blue-950 border border-sky-400 flex items-center justify-center shadow-[0_0_30px_rgba(0,140,255,0.5)]">
                  <CheckCircle2 className="w-7 h-7 text-sky-400" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-2xl font-black text-white uppercase">
                    INQUIRY SUBMITTED!
                  </h3>
                  <p className="text-zinc-300 text-xs sm:text-sm">
                    Thank you! I will review your project details and get back to you within 24 hours.
                  </p>
                </div>

                {/* 3-Column Offer Summary Panel */}
                <OfferSummaryPanel offer={offer} standardPrice={CAMPAIGN_CONFIG.standardPrice} />

                {/* Offer Screenshot Voucher Card */}
                <OfferScreenshotCard offer={offer} formatExpiryIST={formatExpiryIST} />

                <button
                  type="button"
                  onClick={() => dismissPopup(48)}
                  className="w-full py-3 bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-400 hover:from-blue-600 hover:via-sky-400 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer mt-2 shadow-[0_0_20px_rgba(0,140,255,0.3)]"
                >
                  Done / Explore Portfolio
                </button>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 5: ALREADY SPUN / REVISITING OFFER                  */}
            {/* ======================================================== */}
            {modalView === 'ALREADY_SPUN' && offer && (
              <div className="flex flex-col items-center space-y-3.5">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-950/70 border border-blue-500/40 rounded-full text-sky-400 font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(0,140,255,0.2)]">
                  <span>🎂 YOUR BIRTHDAY SALE OFFER</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-2xl font-black text-white uppercase">
                    YOU UNLOCKED{' '}
                    <span className="text-sky-400">
                      {(offer.isFree || offer.finalPrice === 0) ? '100% OFF (FREE)!' : `$${offer.discount || offer.savings} OFF!`}
                    </span>
                  </h3>
                  <p className="font-display text-sm font-bold text-sky-300">
                    Final Website Price: ${offer.finalPrice !== undefined ? offer.finalPrice : (300 - (offer.discount || offer.savings))}
                    {(offer.isFree || offer.finalPrice === 0) && ' (Save $300)'}
                  </p>
                </div>

                {/* 100% OFF Grand Prize Scope Notice */}
                {(offer.isFree || offer.finalPrice === 0) && (
                  <div className="w-full p-2.5 bg-blue-950/60 border border-sky-400/40 rounded-xl text-xs text-sky-200 font-sans text-center">
                    🎉 <strong>100% OFF Grand Prize:</strong> Covers the full cost ($300 value) of our limited-scope <strong>Basic Portfolio Website package</strong> at <strong>$0</strong>!
                  </div>
                )}

                {/* 3-Column Offer Summary Panel */}
                <OfferSummaryPanel offer={offer} standardPrice={CAMPAIGN_CONFIG.standardPrice} />

                <div className="w-full p-3 bg-[#060D1E] border border-blue-500/30 rounded-xl text-left text-xs space-y-1">
                  <div className="flex justify-between text-zinc-400 font-mono text-[11px]">
                    <span>Voucher Code:</span>
                    <strong className="text-white">{offer.offerId}</strong>
                  </div>
                  <div className="flex justify-between text-zinc-400 font-mono text-[11px]">
                    <span>Valid Until:</span>
                    <strong className="text-sky-400">{formatExpiryIST(offer.expiresAt)}</strong>
                  </div>
                  <div className="flex justify-between text-zinc-400 font-mono text-[11px]">
                    <span>Status:</span>
                    <strong className={offer.claimed ? 'text-emerald-400' : 'text-amber-400'}>
                      {offer.claimed ? 'Inquiry Submitted' : 'Unclaimed — Ready to Redeem'}
                    </strong>
                  </div>
                </div>

                {!offer.claimed ? (
                  <button
                    type="button"
                    onClick={() => setModalView('CLAIM')}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-400 text-white font-display font-black text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-[0_0_25px_rgba(0,140,255,0.4)] cursor-pointer"
                  >
                    Proceed to Claim Form (
                    {(offer.isFree || offer.finalPrice === 0)
                      ? 'FREE / $0'
                      : `$${offer.finalPrice !== undefined ? offer.finalPrice : (300 - (offer.discount || offer.savings))}`}
                    )
                  </button>
                ) : (
                  <OfferScreenshotCard offer={offer} formatExpiryIST={formatExpiryIST} />
                )}

                <button
                  type="button"
                  onClick={handleExplorePortfolio}
                  className="w-full py-2.5 px-4 text-zinc-400 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Explore My Portfolio →
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
