import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "./MagneticButton";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Process", href: "#process" },
  { name: "Contact", href: "#contact" }
];

export const Navbar = () => {
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle dark navbar pill styling
      setIsScrolled(window.scrollY > 50);

      // Section intersection detection (Scrollspy)
      const sections = navLinks.map(link => document.querySelector(link.href));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].href);
          break;
        }
      }
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-500 py-4 ${
          isScrolled ? "bg-matte-black/50 backdrop-blur-md border-b border-zinc-900/80" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo / Brand */}
          <a href="#" className="flex items-center space-x-2 text-white font-display font-bold text-lg tracking-tight group">
            <span className="w-2 h-2 rounded-full bg-electric-blue group-hover:scale-150 transition-transform duration-300" />
            <span>dipesh.</span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 bg-zinc-900/35 backdrop-blur-lg border border-zinc-800/40 rounded-full px-1.5 py-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-xs font-sans tracking-wide uppercase transition-all duration-300 ${
                  activeSection === link.href
                    ? "bg-zinc-800 text-white font-medium"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Button (Desktop) */}
          <div className="hidden md:block">
            <a href="#contact">
              <MagneticButton range={20}>
                <div className="flex items-center gap-1.5 text-xs font-mono font-medium tracking-wide uppercase bg-white text-black px-4.5 py-2 rounded-full border border-transparent hover:bg-transparent hover:text-white hover:border-zinc-700 transition-all cursor-pointer">
                  <span>Let's Talk</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </MagneticButton>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[72px] bg-matte-black/95 backdrop-blur-xl border-b border-zinc-900 z-35 flex flex-col p-6 space-y-4 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-lg font-display tracking-tight text-left border-b border-zinc-900 last:border-0 ${
                  activeSection === link.href ? "text-electric-blue font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-white text-black text-center rounded-xl font-display font-medium hover:bg-zinc-200 transition-all block"
            >
              Let's Talk
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
