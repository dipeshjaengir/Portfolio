import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, MessageSquare } from "lucide-react";
import { MagneticButton } from "../components/MagneticButton";
import profileImg from "../assets/profile.jpg";

export const Hero = () => {
  const [imgLoadError, setImgLoadError] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10">
        
        {/* Left Column: Text & CTAs */}
        <motion.div 
          className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tagline Badge */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center space-x-2 bg-electric-blue/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-electric-blue/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse" />
            <span className="font-mono text-[10px] md:text-xs text-electric-blue uppercase tracking-widest font-semibold">
              Available for Internships & Projects
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="font-display text-4xl md:text-7xl font-bold tracking-tight text-white leading-none">
              Hi, I'm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-electric-blue">
                Dipesh Jangir
              </span>
            </h1>
            <p className="font-display text-lg md:text-2xl font-light text-zinc-400">
              Full Stack Web Developer &bull; CSE Student
            </p>
          </motion.div>

          {/* Introduction Statement */}
          <motion.p 
            variants={itemVariants}
            className="font-sans text-sm md:text-base text-zinc-400 font-light leading-relaxed max-w-xl"
          >
            I build modern, scalable, and high-performance web applications with a strong focus on clean UI, seamless user experience, and real-world problem solving.
          </motion.p>

          {/* Buttons Area */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 pt-4 w-full"
          >
            <a href="#projects" className="flex-grow sm:flex-grow-0">
              <MagneticButton range={25} className="w-full">
                <div className="flex items-center justify-center gap-2 py-3 px-6 bg-electric-blue hover:bg-blue-600 text-white font-medium rounded-full text-xs md:text-sm shadow-lg shadow-electric-blue/10 hover:shadow-electric-blue/20 transition-all w-full cursor-pointer group">
                  <span>View Projects</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </MagneticButton>
            </a>

            <a href="#contact" className="flex-grow sm:flex-grow-0">
              <MagneticButton range={25} className="w-full">
                <div className="flex items-center justify-center gap-2 py-3 px-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-medium rounded-full text-xs md:text-sm hover:border-zinc-700 transition-all w-full cursor-pointer group">
                  <MessageSquare className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  <span>Contact Me</span>
                </div>
              </MagneticButton>
            </a>

            <a 
              href="/Resume_Dipesh_Jangir.pdf" 
              download="Resume_Dipesh_Jangir.pdf"
              className="flex-grow sm:flex-grow-0"
            >
              <MagneticButton range={25} className="w-full">
                <div className="flex items-center justify-center gap-2 py-3 px-6 bg-transparent hover:bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs md:text-sm rounded-full transition-all w-full cursor-pointer">
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </div>
              </MagneticButton>
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column: Visual Frame (Profile Photo) */}
        <motion.div 
          className="lg:col-span-5 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 group">
            {/* Background Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue via-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-105" />
            
            {/* Border glow wrapper */}
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-zinc-800/80 rounded-2xl group-hover:border-electric-blue/30 transition-all duration-500 overflow-hidden shadow-2xl p-2.5">
              {!imgLoadError ? (
                <img
                  src={profileImg}
                  alt="Dipesh Jangir Profile"
                  onError={() => setImgLoadError(true)}
                  className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-zinc-900 to-zinc-800 flex items-center justify-center text-zinc-500 rounded-xl font-mono text-xs text-center p-6 border border-dashed border-zinc-700">
                  Placeholder <br /> [Profile Image]
                </div>
              )}
            </div>

            {/* Float Element (Dynamic Tech Tags on Border) */}
            <div className="absolute -bottom-4 -left-4 bg-zinc-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-zinc-800/80 shadow-2xl font-mono text-[10px] text-zinc-300">
              React &bull; Node.js
            </div>
            
            <div className="absolute -top-4 -right-4 bg-zinc-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-zinc-800/80 shadow-2xl font-mono text-[10px] text-zinc-300">
              Express &bull; MongoDB
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
