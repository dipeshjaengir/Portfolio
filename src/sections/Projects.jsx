import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../data/projects";
import { ProjectCard } from "../components/ProjectCard";

const filterOptions = ["All", "Full-Stack", "AI & SaaS", "UI/UX"];

export const Projects = () => {
  const [filter, setFilter] = useState("All");

  const filteredProjects = projects.filter((project) => {
    if (filter === "All") return true;
    if (filter === "Full-Stack") return project.category.toLowerCase().includes("full-stack") || project.category.toLowerCase().includes("enterprise");
    if (filter === "AI & SaaS") return project.category.toLowerCase().includes("ai") || project.category.toLowerCase().includes("saas");
    if (filter === "UI/UX") return project.category.toLowerCase().includes("ui") || project.category.toLowerCase().includes("booking") || project.category.toLowerCase().includes("health");
    return true;
  });

  return (
    <section id="projects" className="relative py-24 border-t border-zinc-900 bg-matte-black/25">
      <div className="max-w-7xl mx-auto px-6 md:px-12 z-10 relative">
        
        {/* Header and Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-left">
          <div className="flex flex-col items-start">
            <span className="text-xs font-mono text-electric-blue uppercase tracking-widest font-semibold mb-2">
              07 / Featured Engineering
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
              Projects & Apps
            </h2>
          </div>

          {/* Dynamic Filter Pill Options */}
          <div className="flex flex-wrap gap-2 bg-zinc-900/40 border border-zinc-800/40 p-1.5 rounded-xl backdrop-blur-md">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-1.5 rounded-lg text-xs font-sans tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                  filter === opt
                    ? "bg-electric-blue text-white font-medium"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
