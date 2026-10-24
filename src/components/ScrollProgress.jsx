import React from "react";
import { motion, useScroll } from "framer-motion";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-electric-blue z-[9999] origin-left pointer-events-none will-change-transform"
      style={{ scaleX: scrollYProgress }}
    />
  );
};
