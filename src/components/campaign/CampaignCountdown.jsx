import React, { useState, useEffect } from 'react';
import { CAMPAIGN_CONFIG } from '../../data/campaignConfig';

export const CampaignCountdown = React.memo(({ targetTimestamp, label = 'THE SALE GOES LIVE IN' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false
  });

  useEffect(() => {
    const endMs = targetTimestamp || CAMPAIGN_CONFIG.startTimestamp;

    const calculateTime = () => {
      const now = Date.now();
      const diff = endMs - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isEnded: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  if (timeLeft.isEnded) {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-950/60 border border-blue-500/50 rounded-full text-sky-300 font-mono text-xs shadow-[0_0_15px_rgba(0,140,255,0.3)]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold">Sale is Now Live!</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center select-none">
      {label && (
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-sky-300 font-bold mb-2.5">
          {label}
        </span>
      )}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full">
        {/* Days */}
        <div className="flex flex-col items-center justify-center flex-1 py-2 sm:py-2.5 px-2 bg-[#071126] border border-blue-500/40 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,140,255,0.15)]">
          <span className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-none">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[9px] font-mono font-bold text-sky-400 tracking-wider uppercase mt-1">
            DAYS
          </span>
        </div>

        <span className="text-sky-400/80 font-bold text-base sm:text-lg mb-2">:</span>

        {/* Hours */}
        <div className="flex flex-col items-center justify-center flex-1 py-2 sm:py-2.5 px-2 bg-[#071126] border border-blue-500/40 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,140,255,0.15)]">
          <span className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-none">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[9px] font-mono font-bold text-sky-400 tracking-wider uppercase mt-1">
            HOURS
          </span>
        </div>

        <span className="text-sky-400/80 font-bold text-base sm:text-lg mb-2">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center justify-center flex-1 py-2 sm:py-2.5 px-2 bg-[#071126] border border-blue-500/40 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,140,255,0.15)]">
          <span className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-none">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[9px] font-mono font-bold text-sky-400 tracking-wider uppercase mt-1">
            MINUTES
          </span>
        </div>

        <span className="text-sky-400/80 font-bold text-base sm:text-lg mb-2">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center justify-center flex-1 py-2 sm:py-2.5 px-2 bg-[#071126] border border-blue-500/40 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,140,255,0.15)]">
          <span className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-none">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[9px] font-mono font-bold text-sky-400 tracking-wider uppercase mt-1">
            SECONDS
          </span>
        </div>
      </div>
    </div>
  );
});
