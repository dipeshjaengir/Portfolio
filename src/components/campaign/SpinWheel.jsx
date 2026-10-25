import React, { useState, useRef, useEffect } from 'react';
import { CAMPAIGN_CONFIG } from '../../data/campaignConfig';

export const SpinWheel = React.memo(({ onSpin, onAnimationComplete, disabled, isSpinning }) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);
  const animationTimerRef = useRef(null);
  const segments = CAMPAIGN_CONFIG.outcomes; // 9 segments including 100% OFF (FREE)
  const numSegments = segments.length; // 9
  const segmentAngle = 360 / numSegments; // 40 degrees

  // Clean up any in-flight timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const handleSpinClick = async (e) => {
    e.preventDefault();
    if (disabled || isSpinning) return;

    try {
      // 1. Determine and persist winning result BEFORE initiating animation
      const result = await onSpin();
      if (!result) return; // If API failed or rejected, do NOT animate to a fake outcome

      const targetIndex = result.outcomeIndex;
      // Segment 0 is centered at 12 o'clock (0 deg). Segment i center is at i * 45 deg.
      const centerAngle = targetIndex * segmentAngle;

      // Calculate target angle: 7 full rotations (2520 deg) + alignment offset
      const currentFullSpins = Math.ceil(rotation / 360);
      const baseSpins = (currentFullSpins + 7) * 360;
      const targetDegree = baseSpins + (360 - centerAngle);

      // Check reduced motion preference
      const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setRotation(targetDegree);
        animationTimerRef.current = setTimeout(() => {
          onAnimationComplete();
        }, 800);
      } else {
        // Enforce MINIMUM 5,000 milliseconds sustained rotation
        setRotation(targetDegree);
        animationTimerRef.current = setTimeout(() => {
          onAnimationComplete();
        }, 5050); // Exactly 5.05s ensures cubic-bezier transition has fully settled
      }
    } catch (err) {
      console.error('Spin execution failure:', err);
    }
  };

  // Helper to calculate SVG arc path for segment i (centered at 12 o'clock for i = 0)
  // Segment i spans from (i*45 - 22.5) to (i*45 + 22.5) degrees
  const createSegmentPath = (index) => {
    const startDeg = index * segmentAngle - segmentAngle / 2;
    const endDeg = (index + 1) * segmentAngle - segmentAngle / 2;

    const startAngle = (startDeg - 90) * (Math.PI / 180);
    const endAngle = (endDeg - 90) * (Math.PI / 180);
    const radius = 175;
    const center = 200;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full my-1">
      {/* Outer Wheel Glow Container */}
      <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[370px] md:h-[370px] flex items-center justify-center">
        {/* Glowing Cyan Downward Pointer (fixed at 12 o'clock) */}
        <div className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none drop-shadow-[0_4px_16px_rgba(0,210,255,0.9)]">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-cyan-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-white -mt-1 shadow-md border border-cyan-400" />
        </div>

        {/* Wheel SVG with 5-second dynamic rotation */}
        <div
          ref={wheelRef}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? 'transform 5000ms cubic-bezier(0.12, 0.95, 0.28, 1.0)'
              : 'none'
          }}
          className="w-full h-full will-change-transform"
        >
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full drop-shadow-[0_0_40px_rgba(0,140,255,0.45)]"
          >
            <defs>
              {/* Outer Blue Glow Ring Filter */}
              <filter id="blueNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Electric-Blue Outer Rim */}
            <circle
              cx="200"
              cy="200"
              r="195"
              fill="#060C1B"
              stroke="#0080FF"
              strokeWidth="7"
              filter="url(#blueNeonGlow)"
            />
            <circle
              cx="200"
              cy="200"
              r="188"
              fill="none"
              stroke="#00D4FF"
              strokeWidth="2"
              strokeOpacity="0.8"
            />
            <circle
              cx="200"
              cy="200"
              r="176"
              fill="none"
              stroke="#1E3A8A"
              strokeWidth="1.5"
            />

            {/* Perimeter LED Light Dots (24 cyan lights) */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 15 - 90) * (Math.PI / 180);
              const x = 200 + 188 * Math.cos(angle);
              const y = 200 + 188 * Math.sin(angle);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3.2"
                  fill="#38BDF8"
                  stroke="#FFFFFF"
                  strokeWidth="0.8"
                  className="animate-pulse"
                  style={{ animationDuration: `${1.2 + (i % 3) * 0.4}s` }}
                />
              );
            })}

            {/* 9 Wheel Segments */}
            {segments.map((seg, i) => {
              const midAngleDeg = i * segmentAngle;
              const textAngleRad = (midAngleDeg - 90) * (Math.PI / 180);
              const textRadius = 120;
              const tx = 200 + textRadius * Math.cos(textAngleRad);
              const ty = 200 + textRadius * Math.sin(textAngleRad);

              const isElectricBlue = seg.color === '#1D75F2';

              return (
                <g key={seg.id}>
                  {/* Segment Pie Slice */}
                  <path
                    d={createSegmentPath(i)}
                    fill={seg.color}
                    stroke="#00D4FF"
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                  />

                  {/* Segment Content: Line 1 ($XXX / FREE) & Line 2 (OFF / 100% OFF) */}
                  <text
                    x={tx}
                    y={ty - 6}
                    fill="#FFFFFF"
                    fontSize={seg.isFree ? '16' : '18'}
                    fontWeight="900"
                    fontFamily="Space Grotesk, sans-serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${midAngleDeg}, ${tx}, ${ty})`}
                    style={{ letterSpacing: '0.5px' }}
                  >
                    {seg.shortLabel}
                  </text>
                  <text
                    x={tx}
                    y={ty + 11}
                    fill={seg.isFree ? '#BAE6FD' : isElectricBlue ? '#BAE6FD' : '#94A3B8'}
                    fontSize={seg.isFree ? '10' : '11'}
                    fontWeight="800"
                    fontFamily="monospace"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${midAngleDeg}, ${tx}, ${ty})`}
                    style={{ letterSpacing: seg.isFree ? '0.5px' : '1px' }}
                  >
                    {seg.subLabel || 'OFF'}
                  </text>
                </g>
              );
            })}

            {/* Center Inner Ring Mask */}
            <circle cx="200" cy="200" r="50" fill="#060C1B" stroke="#00D4FF" strokeWidth="3" />
          </svg>
        </div>

        {/* Center Interactive SPIN NOW Button */}
        <button
          type="button"
          onClick={handleSpinClick}
          disabled={disabled || isSpinning}
          className={`absolute z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center p-2 text-center transition-all duration-300 cursor-pointer shadow-[0_0_35px_rgba(0,180,255,0.7)] ${
            disabled
              ? 'bg-zinc-800 text-zinc-500 border-2 border-zinc-700 cursor-not-allowed'
              : isSpinning
              ? 'bg-gradient-to-tr from-blue-900 to-sky-700 border-2 border-cyan-300 text-cyan-200 animate-pulse cursor-wait'
              : 'bg-gradient-to-tr from-blue-700 via-sky-500 to-cyan-400 hover:from-blue-600 hover:via-sky-400 hover:to-cyan-300 text-white font-black border-2 border-cyan-100 hover:scale-105 active:scale-95'
          }`}
          aria-label="Spin Birthday Wheel"
        >
          <span className="font-display font-black text-sm sm:text-base tracking-wider uppercase leading-tight text-white drop-shadow-md">
            {isSpinning ? 'SPINNING...' : disabled ? 'LOCKED' : (
              <>
                SPIN<br />NOW
              </>
            )}
          </span>
          {!isSpinning && !disabled && (
            <span className="text-[9px] font-mono font-bold tracking-tight text-cyan-100 opacity-90 mt-0.5">
              1 SPIN ONLY
            </span>
          )}
        </button>
      </div>

      {/* Rules Notice */}
      <div className="flex flex-col items-center text-center space-y-0.5 mt-2">
        <span className="text-sky-400 font-mono text-[11px] font-bold tracking-wider uppercase">
          ONE SPIN PER VISITOR
        </span>
        <span className="text-zinc-400 font-sans text-[11px]">
          Your unlocked offer stays valid for 7 days.
        </span>
      </div>
    </div>
  );
});
