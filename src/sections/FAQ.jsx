import React from "react";
import { faqs } from "../data/faq";
import { Accordion } from "../components/Accordion";

export const FAQ = () => {
  return (
    <section id="faq" className="relative py-24 border-t border-zinc-900 bg-matte-black/5">
      <div className="max-w-4xl mx-auto px-6 md:px-12 z-10 relative">
        
        {/* Title */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-xs font-mono text-electric-blue uppercase tracking-widest font-semibold mb-2">
            08 / FAQ
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-500 font-sans text-xs md:text-sm font-light mt-3 max-w-lg leading-relaxed">
            Quick responses to common questions about my technical stack, mobile responsiveness, project delivery process, and opportunities.
          </p>
        </div>

        {/* Collapsible Accordion Wrapper */}
        <Accordion items={faqs} />
      </div>
    </section>
  );
};
