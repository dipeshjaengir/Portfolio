import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-zinc-800/80 last:border-0 overflow-hidden">
      <button
        className="w-full py-5 px-6 flex justify-between items-center text-left text-white hover:bg-zinc-900/20 transition-all cursor-pointer group"
        onClick={onClick}
      >
        <span className="font-display font-medium text-md md:text-lg group-hover:text-electric-blue transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-zinc-400 group-hover:text-white"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 pb-6 pt-1 text-sm md:text-base text-zinc-400 leading-relaxed font-light font-sans">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-[#121212]/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl overflow-hidden divide-y divide-zinc-800/50 shadow-2xl">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};
