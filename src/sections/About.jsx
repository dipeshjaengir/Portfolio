import React from "react";
import { motion } from "framer-motion";
import { MapPin, GraduationCap, Code, Compass, HelpCircle } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="relative py-24 border-t border-zinc-900 bg-matte-black/25">
      <div className="max-w-7xl mx-auto px-6 md:px-12 z-10 relative">
        {/* Section Heading */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs font-mono text-electric-blue uppercase tracking-widest font-semibold mb-2">
            01 / Professional Profile
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
            About Me
          </h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Narrative */}
          <motion.div 
            className="lg:col-span-7 flex flex-col justify-between space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-6 text-zinc-400 font-sans text-sm md:text-base font-light leading-relaxed">
              <p>
                I am a B.Tech Computer Science & Engineering student specializing in Full Stack Development. My passion lies in constructing clean, responsive, and high-performance web applications that solve real-world problems.
              </p>
              <p>
                I focus heavily on building scalable backend architectures, writing modular and reusable React components, and optimizing database queries. I approach development with a strong emphasis on clean code architecture, ensuring codebases remain maintainable and easily extensible as features expand.
              </p>
              <p>
                From interactive user experiences to complete server infrastructures, I strive to combine visual excellence (inspired by minimal modern design languages) with robust logic to deliver projects that look premium and perform flawlessly.
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-900/60">
              <div className="space-y-1">
                <span className="font-display text-3xl font-bold text-white">95%+</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Lighthouse Core</p>
              </div>
              <div className="space-y-1">
                <span className="font-display text-3xl font-bold text-white">100%</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Mobile-First UI</p>
              </div>
              <div className="space-y-1">
                <span className="font-display text-3xl font-bold text-white">15+</span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Repos & Dev Tools</p>
              </div>
            </div>
          </motion.div>

          {/* Right Block: Interactive Cards & Location Widgets */}
          <motion.div 
            className="lg:col-span-5 flex flex-col justify-between gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Academic Card */}
            <div className="glass-card p-6 rounded-2xl flex items-start space-x-4">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-electric-blue flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-md mb-1">B.Tech CSE Student</h4>
                <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed">
                  Focusing on Algorithm Design, Database Management Systems, Software Architecture, and Full-Stack Engineering principles.
                </p>
              </div>
            </div>

            {/* Location Map Mockup Widget */}
            <div className="glass-card p-6 rounded-2xl flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-electric-blue flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white text-sm">Location</h4>
                    <p className="text-xs text-zinc-500 font-mono">Phagwara, Punjab, India</p>
                  </div>
                </div>
              </div>
              
              {/* Abstract Map UI Canvas */}
              <div className="relative h-28 w-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800/80 flex items-center justify-center">
                {/* Abstract grid lines representing streets */}
                <div className="absolute inset-0 opacity-[0.05]" style={{
                  backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                  backgroundSize: "12px 12px"
                }} />
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-zinc-800/30" />
                <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-zinc-800/30" />
                <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-zinc-800/30" />
                
                {/* Glow ring around location marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-electric-blue/15 animate-ping absolute" />
                  <div className="w-6 h-6 rounded-full bg-electric-blue/25 blur-sm absolute" />
                  <MapPin className="w-5 h-5 text-electric-blue relative z-10" />
                </div>
                <span className="absolute bottom-2 right-3 font-mono text-[9px] text-zinc-600">Jalandhar Area</span>
              </div>
            </div>

            {/* Availability Indicator */}
            <div className="glass-card p-4.5 rounded-2xl flex items-center space-x-3.5 border-l-2 border-l-emerald-500 bg-emerald-500/5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <p className="text-xs text-emerald-400 font-mono tracking-wide uppercase font-semibold">
                Available for internships & freelance contracts
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
