import React from "react";
import { ArrowLeft, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { BackgroundGrid } from "./BackgroundGrid";

export const NotFound = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center select-none bg-matte-black text-white">
      {/* Background layer */}
      <BackgroundGrid />

      <div className="space-y-6 max-w-md z-10">
        {/* Floating graphic */}
        <motion.div
          className="flex justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-3xl text-electric-blue shadow-2xl">
            <Compass className="w-12 h-12 animate-pulse" />
          </div>
        </motion.div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="font-display text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-800">
            404
          </h1>
          <h2 className="font-display text-xl font-bold text-zinc-300">
            Lost in digital space
          </h2>
          <p className="text-zinc-500 font-sans text-xs md:text-sm font-light leading-relaxed">
            The page you are looking for doesn't exist, has been relocated, or is undergoing architectural updates.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-center">
          <a href="/">
            <MagneticButton range={20}>
              <div className="flex items-center gap-2 py-3 px-6 bg-white text-black hover:bg-zinc-200 font-medium rounded-full text-xs md:text-sm shadow-xl transition-all cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                <span>Return Home</span>
              </div>
            </MagneticButton>
          </a>
        </div>
      </div>
    </div>
  );
};
