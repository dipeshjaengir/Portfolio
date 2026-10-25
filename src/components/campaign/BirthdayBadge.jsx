import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';

export const BirthdayBadge = React.memo(({ campaign }) => {
  const {
    isModalOpen,
    timing,
    offer,
    hasSpun,
    openModal
  } = campaign;

  const isBefore = timing?.status === 'BEFORE';
  const isActive = Boolean(timing?.active);
  const isEnded = timing?.status === 'ENDED';
  const userHasOffer = Boolean(hasSpun || offer);

  // Show badge only when modal is closed
  const shouldShow = !isModalOpen && (isBefore || isActive || isEnded || userHasOffer);

  // Determine badge text state matching reference design specifications
  let badgeLabel = '🎂 BIRTHDAY SALE';
  if (userHasOffer) {
    badgeLabel = '🎂 BIRTHDAY SALE: OFFER UNLOCKED';
  } else if (isBefore) {
    badgeLabel = '🎂 BIRTHDAY SALE — TOMORROW';
  } else if (isActive) {
    badgeLabel = '🎂 BIRTHDAY SALE — LIVE NOW 🟢';
  } else if (isEnded) {
    badgeLabel = '🎂 BIRTHDAY SALE — CONCLUDED';
  }

  const handleClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    openModal();
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.button
          type="button"
          onClick={handleClick}
          className="fixed bottom-6 left-6 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#060C1B]/95 hover:bg-[#0A1329] border border-blue-500/40 hover:border-sky-400 text-sky-300 shadow-[0_4px_25px_rgba(0,140,255,0.3)] hover:shadow-[0_6px_35px_rgba(0,140,255,0.45)] backdrop-blur-md transition-all duration-300 cursor-pointer text-xs md:text-sm font-semibold select-none"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Open Birthday Sale promotion"
        >
          {/* Left Gift Icon Container */}
          <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white shadow-sm shrink-0">
            <Gift className="w-3.5 h-3.5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-300 border border-zinc-950 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-300 border border-zinc-950" />
          </span>

          {/* Text Label */}
          <span className="bg-gradient-to-r from-sky-200 via-cyan-100 to-sky-400 bg-clip-text text-transparent font-bold tracking-wider font-mono text-[11px] sm:text-xs uppercase">
            {badgeLabel}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
});
