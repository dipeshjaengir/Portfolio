import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Motion values for smooth trailing
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device is touch-enabled
    const checkDevice = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("button") || 
        target.closest("a") ||
        target.tagName === "INPUT" || 
        target.tagName === "TEXTAREA" ||
        target.classList.contains("clickable") ||
        window.getComputedStyle(target).cursor === "pointer";
        
      setIsHovered(!!isInteractive);
    };

    if (!isMobile) {
      window.addEventListener("mousemove", moveCursor);
      window.addEventListener("mouseover", handleMouseOver);
    }

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Glow Center Point */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-electric-blue rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* External glow ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-electric-blue/40 pointer-events-none z-50 mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 48 : 28,
          height: isHovered ? 48 : 28,
          backgroundColor: isHovered ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0)",
          boxShadow: isHovered 
            ? "0 0 15px rgba(59, 130, 246, 0.4)" 
            : "0 0 0px rgba(59, 130, 246, 0)",
        }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
      />
    </>
  );
};
