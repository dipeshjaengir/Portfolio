import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code, Layers, Shield } from "lucide-react";
import { Github } from "./SocialIcons";
import { MagneticButton } from "./MagneticButton";

export const ProjectCard = memo(({ project }) => {
  const [imageError, setImageError] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  // Render clean, GPU-friendly visual abstract graphic
  const renderAbstractPlaceholder = () => {
    return (
      <div className={`relative w-full h-full bg-gradient-to-br ${project.gradient} flex flex-col justify-between p-6 overflow-hidden select-none`}>
        {/* Soft Radial Glow Element (GPU-accelerated, zero blur overhead) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0) 70%)"
          }}
        />
        
        {/* Top Header Placeholder */}
        <div className="flex justify-between items-center z-10" />

        {/* Center Graphic */}
        <div className="flex flex-col items-center justify-center space-y-3 z-10 flex-grow py-4">
          <div className="p-4 bg-zinc-950/80 backdrop-blur-sm rounded-2xl border border-zinc-800/80 shadow-2xl group-hover:scale-110 group-hover:border-electric-blue/30 transition-transform duration-300">
            {project.id.includes("recruitment") || project.id.includes("connect") ? (
              <Shield className="w-10 h-10 text-white" />
            ) : project.id.includes("commerce") || project.id.includes("mart") ? (
              <Layers className="w-10 h-10 text-white" />
            ) : (
              <Code className="w-10 h-10 text-white" />
            )}
          </div>
          <span className="font-display font-bold text-lg text-white group-hover:scale-105 transition-transform duration-300">
            {project.title}
          </span>
        </div>

        {/* Bottom Stack Indicators */}
        <div className="flex flex-wrap gap-1.5 z-10">
          {project.techStack.slice(0, 3).map((tech) => (
            <span key={tech} className="text-[9px] text-zinc-500 font-mono bg-zinc-950/40 backdrop-blur-sm px-2 py-0.5 rounded">
              #{tech}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="relative flex flex-col h-full bg-[#121212]/50 border border-zinc-900 rounded-2xl overflow-hidden group shadow-2xl hover:border-zinc-800 transition-all duration-300"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] }}
    >
      {/* Top Banner (Image or Premium Placeholder) */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-zinc-900 bg-zinc-950">
        {/* Category Badge at Top of Card */}
        <div className="absolute top-3 left-3 z-20">
          <span className="text-[10px] tracking-widest text-zinc-300 uppercase font-mono bg-zinc-950/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-zinc-800/80 shadow-md">
            {project.category}
          </span>
        </div>

        {project.image && !imageError ? (
          <img
            src={project.image}
            alt={project.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            decoding="async"
          />
        ) : (
          renderAbstractPlaceholder()
        )}
        {/* Soft shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80 pointer-events-none" />
      </div>

      {/* Body Content */}
      <div className="flex flex-col flex-grow p-6 relative">
        <div className="flex-grow">
          {/* Title */}
          <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-1.5 group-hover:text-electric-blue transition-colors">
            {project.title}
          </h3>
          {/* Highlighted Client Metadata (Location · Profession) */}
          {project.clientMeta && (
            <p className="text-xs font-mono text-electric-blue font-semibold tracking-wide mb-3">
              {project.clientMeta}
            </p>
          )}
          {/* Description */}
          <p className="text-zinc-400 font-sans text-sm font-light leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800/80 px-2.5 py-1 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Expandable Features list */}
        <div className="mb-6">
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="text-xs text-zinc-500 hover:text-white flex items-center gap-1.5 focus:outline-none cursor-pointer transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
            {showFeatures ? "Hide key features" : "View key features"}
          </button>
          
          <AnimatePresence>
            {showFeatures && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-3 space-y-2 border-l border-zinc-800 pl-3 overflow-hidden"
              >
                {project.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="text-xs text-zinc-400 font-sans leading-relaxed font-light"
                  >
                    {feature}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons / Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-zinc-900 mt-auto">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <MagneticButton range={25} className="w-full">
                <div className="flex items-center justify-center gap-2 py-2 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs md:text-sm font-medium rounded-lg transition-colors w-full cursor-pointer">
                  <Github className="w-4 h-4" />
                  <span>Repository</span>
                </div>
              </MagneticButton>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <MagneticButton range={25} className="w-full">
                <div className="flex items-center justify-center gap-2 py-2 px-4 bg-electric-blue hover:bg-blue-600 text-white text-xs md:text-sm font-medium rounded-lg shadow-lg shadow-electric-blue/10 hover:shadow-electric-blue/20 transition-colors w-full cursor-pointer">
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </div>
              </MagneticButton>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
});
ProjectCard.displayName = "ProjectCard";
