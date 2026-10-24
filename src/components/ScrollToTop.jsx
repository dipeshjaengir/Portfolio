import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastVisible = false;

    const toggleVisibility = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 400;
          if (shouldShow !== lastVisible) {
            lastVisible = shouldShow;
            setIsVisible(shouldShow);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-white rounded-full shadow-2xl hover:bg-electric-blue hover:text-white transition-colors cursor-pointer group"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
