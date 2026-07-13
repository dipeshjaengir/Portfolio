import React from "react";
import { motion } from "framer-motion";

export const BackgroundGrid = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-matte-black overflow-hidden pointer-events-none">
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

      {/* Floating Organic Glowing Blob 1 - Electric Blue */}
      <motion.div
        className="absolute -top-[10%] left-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-electric-blue/10 blur-[100px] animate-pulse-glow"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -50, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Organic Glowing Blob 2 - Deep Purple */}
      <motion.div
        className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-purple-600/5 blur-[120px]"
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Organic Glowing Blob 3 - Light Cyan Glow near middle-left */}
      <motion.div
        className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-cyan-500/5 blur-[90px]"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
