import React, { useState } from 'react';
import { ChevronDown, Check, X, Info, Sparkles } from 'lucide-react';
import { CAMPAIGN_CONFIG } from '../../data/campaignConfig';

export const PackageScopeDetails = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scope = CAMPAIGN_CONFIG.packageScope;

  return (
    <div className="w-full bg-[#060D1E]/80 border border-blue-500/35 rounded-xl overflow-hidden mt-3 text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5 font-semibold text-sky-400">
          <Info className="w-3.5 h-3.5" />
          <span>Package Scope & Inclusions</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-sky-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-3 text-xs border-t border-blue-500/20 font-sans">
          {scope.freePrizeScope && (
            <div className="p-2.5 bg-blue-950/60 border border-sky-400/40 rounded-xl space-y-1">
              <h5 className="font-semibold font-mono text-[11px] uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>{scope.freePrizeScope.title}</span>
              </h5>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {scope.freePrizeScope.description}
              </p>
            </div>
          )}

          <div>
            <h5 className="font-semibold mb-1.5 font-mono text-[11px] uppercase tracking-wider text-sky-300">
              What Is Included (Standard Package):
            </h5>
            <ul className="space-y-1 text-zinc-300 text-[11px]">
              {scope.included.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
              Transparent Exclusions:
            </h5>
            <ul className="space-y-1 text-zinc-400 text-[11px]">
              {scope.excluded.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <X className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
