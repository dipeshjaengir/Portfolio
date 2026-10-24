import React from 'react';

export const GiftBoxGraphic = ({ className = "w-24 h-24 sm:w-28 sm:h-28" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className} select-none pointer-events-none`}>
      {/* Ambient Blue Radial Glow behind gift box */}
      <div className="absolute inset-0 bg-blue-600/30 rounded-full blur-2xl transform scale-110 -bottom-2" />

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,100,255,0.4)]"
      >
        <defs>
          {/* Box Gradient - Left Face */}
          <linearGradient id="boxLeft" x1="40" y1="90" x2="100" y2="175" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0B101E" />
          </linearGradient>

          {/* Box Gradient - Right Face */}
          <linearGradient id="boxRight" x1="100" y1="90" x2="160" y2="175" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          {/* Box Gradient - Top Lid Face */}
          <linearGradient id="boxTop" x1="40" y1="80" x2="160" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Electric Blue Ribbon Gradient */}
          <linearGradient id="ribbonBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Bright Cyan Ribbon Highlight */}
          <linearGradient id="ribbonGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* --- BOX BODY --- */}
        {/* Left Side Face */}
        <polygon points="40,95 100,128 100,180 40,147" fill="url(#boxLeft)" stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.4" />
        
        {/* Right Side Face */}
        <polygon points="100,128 160,95 160,147 100,180" fill="url(#boxRight)" stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.2" />

        {/* --- VERTICAL RIBBONS ON BODY --- */}
        {/* Left Body Ribbon */}
        <polygon points="65,109 76,115 76,167 65,161" fill="url(#ribbonBlue)" />
        {/* Right Body Ribbon */}
        <polygon points="124,115 135,109 135,161 124,167" fill="url(#ribbonBlue)" />

        {/* --- BOX LID (Overhang) --- */}
        {/* Lid Left Lip */}
        <polygon points="34,84 100,119 100,127 34,92" fill="#1E293B" />
        {/* Lid Right Lip */}
        <polygon points="100,119 166,84 166,92 100,127" fill="#0F172A" />
        {/* Lid Top Surface */}
        <polygon points="100,50 166,84 100,119 34,84" fill="url(#boxTop)" stroke="#38BDF8" strokeWidth="0.8" strokeOpacity="0.6" />

        {/* --- RIBBON CROSSING LID --- */}
        {/* Ribbon diagonal 1: Top-Left to Bottom-Right */}
        <polygon points="60,63 74,70 140,105 126,98" fill="url(#ribbonGlow)" />
        {/* Ribbon diagonal 2: Top-Right to Bottom-Left */}
        <polygon points="140,63 126,70 60,105 74,98" fill="url(#ribbonGlow)" />

        {/* --- 3D BOW ON TOP --- */}
        {/* Left Loop */}
        <path
          d="M 100 84 C 70 50, 45 60, 68 82 C 85 92, 100 86, 100 84 Z"
          fill="url(#ribbonGlow)"
          stroke="#38BDF8"
          strokeWidth="0.8"
        />
        {/* Inner Left Shadow */}
        <path
          d="M 94 81 C 78 62, 60 70, 74 81 Z"
          fill="#0369A1"
          opacity="0.8"
        />

        {/* Right Loop */}
        <path
          d="M 100 84 C 130 50, 155 60, 132 82 C 115 92, 100 86, 100 84 Z"
          fill="url(#ribbonGlow)"
          stroke="#38BDF8"
          strokeWidth="0.8"
        />
        {/* Inner Right Shadow */}
        <path
          d="M 106 81 C 122 62, 140 70, 126 81 Z"
          fill="#0369A1"
          opacity="0.8"
        />

        {/* Center Knot */}
        <ellipse cx="100" cy="84" rx="9" ry="7" fill="#38BDF8" stroke="#BAE6FD" strokeWidth="1" />
        <ellipse cx="100" cy="83" rx="5" ry="3" fill="#BAE6FD" opacity="0.6" />

        {/* Trailing Ribbon Ends */}
        <path
          d="M 96 88 C 88 100, 75 110, 65 118 C 72 116, 80 114, 88 116 C 94 108, 98 98, 98 88 Z"
          fill="url(#ribbonBlue)"
        />
        <path
          d="M 104 88 C 112 100, 125 110, 135 118 C 128 116, 120 114, 112 116 C 106 108, 102 98, 102 88 Z"
          fill="url(#ribbonBlue)"
        />
      </svg>
    </div>
  );
};
