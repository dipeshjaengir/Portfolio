import React from "react";
import { motion } from "framer-motion";
import { Code, Layout, ShieldAlert, Cpu, Heart } from "lucide-react";

const benefits = [
  {
    icon: Code,
    title: "Clean & Scalable Code",
    description: "I write modular, component-based code designed to scale easily. I adhere to rigorous directory organization, custom hook abstractions, and design patterns that keep codebase clean."
  },
  {
    icon: Layout,
    title: "Pixel-Perfect Layouts",
    description: "Every pixel, transition, and padding matters. I design interfaces from a mobile-first philosophy, building designs that scale smoothly across smartphones, tablets, and desktops."
  },
  {
    icon: Cpu,
    title: "Extreme Optimization",
    description: "I optimize assets, minimize bundle footprints, and prevent layout shifts. My focus is on delivering blazing fast page load times and target Lighthouse performance metrics above 95."
  },
  {
    icon: ShieldAlert,
    title: "Professional Security & API",
    description: "From schema validation to JWT authorization and REST endpoints, I implement solid practices to build secure backend routes and keep data safe."
  }
];

export const WhyWorkWithMe = () => {
  return (
    <section id="why-work-with-me" className="relative py-24 border-t border-zinc-900 bg-matte-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 z-10 relative">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs font-mono text-electric-blue uppercase tracking-widest font-semibold mb-2">
            02 / Core Values
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
            Why Work With Me
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                className="glass-card p-8 rounded-2xl flex flex-col items-start text-left relative overflow-hidden group"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, cubicBezier: [0.16, 1, 0.3, 1] }}
              >
                {/* Visual hover background subtle gradient glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-electric-blue/5 rounded-full blur-xl group-hover:bg-electric-blue/10 transition-colors duration-500 pointer-events-none" />

                {/* Icon Wrapper */}
                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-electric-blue mb-6 group-hover:scale-110 group-hover:border-electric-blue/30 transition-all duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg md:text-xl text-white mb-3 group-hover:text-electric-blue transition-colors duration-300">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-zinc-400 font-sans text-sm md:text-base font-light leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
