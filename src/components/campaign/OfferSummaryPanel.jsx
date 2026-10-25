import React from 'react';
import { CAMPAIGN_CONFIG } from '../../data/campaignConfig';

export const OfferSummaryPanel = ({ offer, standardPrice = 300, isSpinning = false }) => {
  const hasOffer = Boolean(offer && (offer.discount !== undefined || offer.savings !== undefined));
  const discountAmount = hasOffer ? (offer.discount ?? offer.savings) : null;
  const isFree = Boolean(offer?.isFree || offer?.finalPrice === 0 || discountAmount === 300);
  const finalPrice = hasOffer ? (offer.finalPrice !== undefined ? offer.finalPrice : (standardPrice - discountAmount)) : null;

  // The discount and final price must stay hidden while the wheel is spinning
  const showRevealed = hasOffer && !isSpinning;

  return (
    <div className="w-full bg-[#060D1E]/90 border border-blue-500/40 rounded-2xl p-3.5 sm:p-4 my-2.5 shadow-[0_4px_25px_rgba(0,140,255,0.18)] select-none">
      <div className="grid grid-cols-3 divide-x divide-blue-500/25 text-center items-center">
        {/* Column 1: Standard Price */}
        <div className="flex flex-col items-center justify-center px-1 sm:px-2">
          <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 font-medium tracking-wide">
            Standard Price
          </span>
          <span className="font-display font-bold text-base sm:text-xl text-zinc-400 line-through decoration-zinc-500 decoration-2 mt-0.5">
            ${standardPrice}
          </span>
        </div>

        {/* Column 2: Your Discount */}
        <div className="flex flex-col items-center justify-center px-1 sm:px-2">
          <span className="text-[10px] sm:text-[11px] font-mono text-sky-300 font-semibold tracking-wide">
            Your Discount
          </span>
          <span className={`font-display font-black tracking-tight mt-0.5 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] ${
            isSpinning
              ? 'text-xs sm:text-sm text-cyan-300 animate-pulse'
              : 'text-base sm:text-xl text-sky-400'
          }`}>
            {isSpinning
              ? 'Revealing your deal...'
              : showRevealed
              ? (isFree ? '100% OFF' : `$${discountAmount} OFF`)
              : 'Spin to Reveal'}
          </span>
        </div>

        {/* Column 3: Your Final Price */}
        <div className="flex flex-col items-center justify-center px-1 sm:px-2">
          <span className="text-[10px] sm:text-[11px] font-mono text-sky-300 font-semibold tracking-wide">
            Your Final Price
          </span>
          <span className={`font-display font-black tracking-tight mt-0.5 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] ${
            isSpinning
              ? 'text-xs sm:text-sm text-cyan-300 animate-pulse'
              : 'text-base sm:text-xl text-sky-400'
          }`}>
            {isSpinning
              ? 'Spinning...'
              : showRevealed
              ? `$${finalPrice}`
              : 'Up to 100% OFF'}
          </span>
        </div>
      </div>
    </div>
  );
};
