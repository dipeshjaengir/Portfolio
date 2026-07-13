import React from "react";
import { Github, Linkedin, Instagram } from "../components/SocialIcons";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 border-t border-zinc-900 bg-matte-black text-zinc-500 font-sans text-xs font-light">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left copyright and credits */}
        <div className="flex flex-col items-center md:items-start space-y-1 text-center md:text-left">
          <p className="text-zinc-400">
            &copy; {currentYear} Dipesh Jangir. All rights reserved.
          </p>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
            Designed & Engineered with React 19 &amp; Tailwind CSS
          </p>
        </div>

        {/* Center Minimal Branding */}
        <a href="#" className="font-display font-black text-white text-md tracking-tight hover:text-electric-blue transition-colors">
          dipesh.
        </a>

        {/* Right social indicators */}
        <div className="flex items-center space-x-5">
          <a
            href="https://github.com/dipeshjaengir"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/dipesh-jangir-o7336"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com/_dipesh2.0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
