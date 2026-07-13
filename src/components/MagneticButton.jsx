import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export const MagneticButton = ({ children, range = 40, className = "" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Distance from center
    const x = clientX - centerX;
    const y = clientY - centerY;
    
    // Check if within magnetic range
    const distance = Math.sqrt(x * x + y * y);
    if (distance < range) {
      // Pull element towards mouse (attenuated by factor of 0.35)
      setPosition({ x: x * 0.35, y: y * 0.35 });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
