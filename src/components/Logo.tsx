/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm tracking-wide',
    md: 'text-base tracking-wider',
    lg: 'text-xl tracking-wider',
    xl: 'text-2xl tracking-widest',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Custom Vector Emblem: Pin + Return Arrow + Belonging Box */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} shrink-0 transition-transform hover:scale-105 duration-200`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Subtle Outer Glow Ring */}
          <circle cx="24" cy="24" r="22" className={isLight ? 'fill-slate-800/40 stroke-amber-400/30' : 'fill-amber-50 stroke-amber-500/20'} strokeWidth="1" />
          
          {/* Campus Location Pin (Upper arc with point at bottom) */}
          <path
            d="M24 6C16.82 6 11 11.82 11 19C11 27.5 24 41 24 41C24 41 37 27.5 37 19C37 11.82 31.18 6 24 6Z"
            className={isLight ? 'fill-slate-900 stroke-amber-400' : 'fill-slate-900 stroke-amber-500'}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Golden Package / Belonging Box in Pin center */}
          <rect
            x="18"
            y="17"
            width="12"
            height="10"
            rx="2"
            className="fill-amber-400/90 stroke-amber-200"
            strokeWidth="1"
          />
          {/* Ribbon on package */}
          <line x1="24" y1="17" x2="24" y2="27" className="stroke-slate-900/60" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
          <line x1="18" y1="22" x2="30" y2="22" className="stroke-slate-900/60" strokeWidth="1.2" />

          {/* Dynamic Return Arrow looping over the crest */}
          <path
            d="M14 16C16.5 10.5 22 8.5 28 10C32.5 11.2 36 15 36.5 19.5"
            stroke="#f59e0b"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Arrowhead pointing forward/back */}
          <path
            d="M14 12V17H19"
            stroke="#f59e0b"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif-title font-bold uppercase ${textSizes[size]} ${
              isLight ? 'text-white' : 'text-slate-900'
            }`}
          >
            Back to You
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
        </div>
        {showTagline && (
          <span
            className={`text-[10px] sm:text-xs font-normal tracking-normal ${
              isLight ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Lost Something? Let's Bring It Back to You.
          </span>
        )}
      </div>
    </div>
  );
};
