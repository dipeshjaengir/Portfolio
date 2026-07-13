import React from "react";
import { motion } from "framer-motion";
import { devProcess } from "../data/process";

export const DevProcess = () => {
  return (
    <section id="process" className="relative py-24 border-t border-zinc-900 bg-matte-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 z-10 relative">
        
        {/* Title */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs font-mono text-electric-blue uppercase tracking-widest font-semibold mb-2">
            06 / Workflow Lifecycle
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
            Development Process
          </h2>
        </div>

        {/* Process Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {devProcess.map((item, index) => (
            <motion.div
              key={item.step}
              className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-8 text-left relative overflow-hidden group shadow-2xl hover:border-zinc-800 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, cubicBezier: [0.16, 1, 0.3, 1] }}
            >
              {/* Step indicator on card corner */}
              <div className="absolute top-6 right-6 font-display font-black text-2xl md:text-3xl text-zinc-800/40 group-hover:text-electric-blue/20 transition-colors duration-500">
                {item.step}
              </div>

              {/* Phase Header */}
              <span className="text-[10px] font-mono text-electric-blue uppercase tracking-widest font-semibold block mb-4">
                {item.phase}
              </span>

              {/* Title */}
              <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-electric-blue transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-400 font-sans text-sm font-light leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
