import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Database, Activity, RefreshCw } from "lucide-react";

const features = [
  {
    name: "React 19 Core",
    focus: "Modern Client UI",
    detail: "Hooks architecture, state management, client routing, context APIs, lazy rendering optimization, and concurrent features.",
    glow: "rgba(97, 218, 251, 0.15)",
    icon: Cpu
  },
  {
    name: "Node.js & Express",
    focus: "API Infrastructure",
    detail: "RESTful architecture routing, robust middleware integration, token-based (JWT) auth, rate-limiting, and error handlers.",
    glow: "rgba(51, 153, 51, 0.12)",
    icon: ShieldCheck
  },
  {
    name: "Tailwind Styling",
    focus: "Responsive Aesthetics",
    detail: "Tailwind CSS v4 framework, custom themes definitions, responsive media design, glassmorphism layouts, and CSS variable styling.",
    glow: "rgba(56, 178, 172, 0.15)",
    icon: Activity
  },
  {
    name: "MongoDB Data Layer",
    focus: "NoSQL DB Architecture",
    detail: "Structuring JSON-based documents models, relational schema setups, Mongoose hooks/validations, indexing, and connection pools.",
    glow: "rgba(71, 162, 72, 0.12)",
    icon: Database
  }
];

export const FeaturedTechnologies = () => {
  return (
    <section id="featured-technologies" className="relative py-20 border-t border-zinc-900 bg-matte-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 z-10 relative">
        
        {/* Intro */}
        <div className="flex flex-col items-start mb-14 text-left max-w-xl">
          <span className="text-xs font-mono text-electric-blue uppercase tracking-widest font-semibold mb-2">
            04 / Technology Focus
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">
            Featured Technologies
          </h2>
          <p className="text-zinc-500 font-sans text-xs md:text-sm font-light mt-3 leading-relaxed">
            A deeper dive into the specific focus areas, architectures, and optimization strategies I apply across my primary engineering tools.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.name}
                className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 text-left relative overflow-hidden group shadow-xl hover:border-zinc-800 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Glow Radial Mask */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                  style={{
                    background: `radial-gradient(circle at 10% 10%, ${item.glow}, transparent 60%)`
                  }}
                />

                {/* Top header */}
                <div className="flex justify-between items-center mb-5">
                  <div className="p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-400 group-hover:text-white group-hover:border-electric-blue/30 transition-all duration-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    {item.focus}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-md text-white mb-2.5">
                  {item.name}
                </h3>

                {/* Detail text */}
                <p className="text-zinc-400 font-sans text-[12px] md:text-[13px] font-light leading-relaxed">
                  {item.detail}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
