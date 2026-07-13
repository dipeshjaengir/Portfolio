import React from "react";
import { motion } from "framer-motion";
import { Globe, Code2, ShieldCheck, Flame } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Full-Stack Web Apps",
    details: "Developing end-to-end web applications. Designing databases, building robust server layers in Express, and linking client interfaces in React."
  },
  {
    icon: Code2,
    title: "UI/UX Development",
    details: "Crafting beautiful, modern frontends based on Apple/Vercel philosophies. Pixel-perfect styles, smooth layout micro-animations, and complete responsiveness."
  },
  {
    icon: ShieldCheck,
    title: "API & Auth Design",
    details: "Engineering RESTful API endpoints. Setting up secure authentication schemes (JWT), cookies, CORS controls, and robust validation structures."
  },
  {
    icon: Flame,
    title: "Performance & SEO Tuning",
    details: "Optimizing bundle structures, compressions, rendering pipelines, and layouts shifts. Adding descriptors tags, OG labels, and structured sitemaps."
  }
];

export const Services = () => {
  return (
    <section id="services" className="relative py-24 border-t border-zinc-900 bg-matte-black/25">
      <div className="max-w-7xl mx-auto px-6 md:px-12 z-10 relative">
        
        {/* Title */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs font-mono text-electric-blue uppercase tracking-widest font-semibold mb-2">
            05 / Core Competencies
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
            Services I Offer
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                className="glass-card p-8 rounded-2xl flex flex-col md:flex-row items-start text-left gap-6 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1, cubicBezier: [0.16, 1, 0.3, 1] }}
              >
                {/* Icon wrapper */}
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-electric-blue flex-shrink-0 group-hover:scale-105 group-hover:border-electric-blue/30 transition-all duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-electric-blue transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 font-sans text-sm md:text-base font-light leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
