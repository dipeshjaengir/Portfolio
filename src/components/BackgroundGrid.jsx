import React from "react";
import { motion } from "framer-motion";

export const BackgroundGrid = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-matte-black overflow-hidden pointer-events-none transform-gpu">
      {/* Vercel Grid Overlay */}
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radiant Glow Mask (fades grid towards edges/corners) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 20%, #0B0B0B 80%)",
        }}
      />

      {/* Floating Organic Glowing Blob 1 - Electric Blue (GPU-friendly radial gradient) */}
      <motion.div
        className="absolute -top-[10%] left-[10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.14) 0%, rgba(59, 130, 246, 0) 70%)",
          transform: "translateZ(0)",
          willChange: "transform, opacity",
        }}
        animate={{
          x: [0, 40, -25, 0],
          y: [0, -40, 30, 0],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Organic Glowing Blob 2 - Deep Purple */}
      <motion.div
        className="absolute bottom-[10%] right-[10%] w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, rgba(147, 51, 234, 0) 70%)",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -25, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Organic Glowing Blob 3 - Light Cyan Glow near middle (hidden on small mobile to conserve GPU) */}
      <motion.div
        className="hidden md:block absolute top-[40%] right-[30%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, rgba(6, 182, 212, 0) 70%)",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
        animate={{
          x: [0, 25, -15, 0],
          y: [0, 30, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
