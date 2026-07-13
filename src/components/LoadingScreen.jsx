import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  "Initializing digital portfolio...",
  "Loading architecture systems...",
  "Compiling layout modules...",
  "Pixel perfect grids ready...",
  "Connecting nodes...",
  "Welcome to the workspace"
];

export const LoadingScreen = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Increment loading percentage
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random incremental speed
        const rand = Math.floor(Math.random() * 4) + 1;
        return Math.min(prev + rand, 100);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cycle messages based on counter progress
    if (count < 20) setMsgIdx(0);
    else if (count < 40) setMsgIdx(1);
    else if (count < 65) setMsgIdx(2);
    else if (count < 85) setMsgIdx(3);
    else if (count < 95) setMsgIdx(4);
    else setMsgIdx(5);

    if (count === 100) {
      const timer = setTimeout(() => {
        setIsDone(true);
        const exitTimer = setTimeout(() => {
          if (onComplete) onComplete();
        }, 600); // Wait for transition out
        return () => clearTimeout(exitTimer);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 bg-[#070707] z-[9999] flex flex-col justify-between p-10 md:p-20 pointer-events-auto"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-electric-blue animate-pulse" />
              <span className="font-display tracking-widest text-[10px] text-zinc-500 uppercase">
                Dipesh Jangir &bull; Portfolio v2.0
              </span>
            </div>
            <div className="font-display tracking-widest text-[10px] text-zinc-500 uppercase">
              Developer Edition
            </div>
          </div>

          {/* Center Info */}
          <div className="flex flex-col items-start space-y-6 select-none">
            <div className="relative">
              <motion.h1
                className="font-display text-8xl md:text-[12rem] font-bold text-white tracking-tighter"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {count}%
              </motion.h1>
              <div className="absolute -bottom-4 left-2 w-full h-[2px] bg-zinc-800">
                <motion.div 
                  className="h-full bg-electric-blue" 
                  initial={{ width: "0%" }}
                  animate={{ width: `${count}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
            </div>
            <div className="h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIdx}
                  className="font-sans text-sm md:text-md text-zinc-400 font-light flex items-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-electric-blue mr-2 font-mono">&gt;</span>
                  {messages[msgIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 text-zinc-600 font-mono text-[10px]">
            <div>SYSTEM STATUS: ONLINE</div>
            <div>STABLE CORE V19.0.0</div>
            <div>DESIGN LANGUAGE: apple.vercel.linear</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
