import React from "react";
import { motion } from "framer-motion";
import { skillCategories } from "../data/skills";
import * as Icons from "lucide-react";

export const Skills = () => {
  return (
    <section id="skills" className="relative py-24 border-t border-zinc-900 bg-matte-black/25">
      <div className="max-w-7xl mx-auto px-6 md:px-12 z-10 relative">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs font-mono text-electric-blue uppercase tracking-widest font-semibold mb-2">
            03 / Skills & Toolkit
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
            My Tech Stack
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.id}
              className="glass-card p-8 rounded-2xl flex flex-col justify-between text-left relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, cubicBezier: [0.16, 1, 0.3, 1] }}
            >
              <div>
                {/* Title & Description */}
                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-electric-blue transition-colors">
                  {category.title}
                </h3>
                <p className="text-zinc-500 font-sans text-xs md:text-sm font-light mb-6">
                  {category.description}
                </p>

                {/* Skills List */}
                <div className="space-y-4">
                  {category.skills.map((skill) => {
                    // Dynamically resolve icon from Lucide React
                    const IconName = skill.icon;
                    const IconComponent = Icons[IconName] || Icons.Cpu;

                    return (
                      <div key={skill.name} className="flex items-center justify-between group/item">
                        <div className="flex items-center space-x-3.5">
                          {/* Skill Icon */}
                          <div 
                            className="p-2 bg-zinc-950 border border-zinc-800/80 rounded-lg text-zinc-400 group-hover/item:text-white transition-all duration-300"
                            style={{ "--hover-color": skill.color }}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          
                          {/* Skill Name */}
                          <span className="font-sans text-sm md:text-base text-zinc-300 font-light group-hover/item:text-white transition-colors duration-300">
                            {skill.name}
                          </span>
                        </div>

                        {/* Level badge */}
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider group-hover/item:text-zinc-400 transition-colors">
                            {skill.level}
                          </span>
                          
                          {/* Level dots */}
                          <div className="flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
                            <span className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
                            <span className={`w-1.5 h-1.5 rounded-full ${skill.level === "Expert" ? "bg-electric-blue" : "bg-zinc-800"}`} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
