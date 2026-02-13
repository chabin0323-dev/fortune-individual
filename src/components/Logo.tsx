
import React from 'react';

export const Logo: React.FC = () => (
  <div aria-label="mike brand logo" className="flex justify-center py-8">
    <svg width="140" height="40" viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="naturalRainbow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff0000" />
          <stop offset="17%" stopColor="#ff8000" />
          <stop offset="33%" stopColor="#ffff00" />
          <stop offset="50%" stopColor="#00ff00" />
          <stop offset="67%" stopColor="#00ffff" />
          <stop offset="83%" stopColor="#0000ff" />
          <stop offset="100%" stopColor="#8000ff" />
        </linearGradient>
      </defs>
      <style>
        {`.logo-text { font: bold 32px sans-serif; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); }
          .version-text { font: normal 12px sans-serif; opacity: 0.5; fill: #fff; }`}
      </style>
      
      <text x="0" y="32" className="logo-text" fill="url(#naturalRainbow)">m</text>
      <rect x="30" y="14" width="4" height="18" rx="2" fill="url(#naturalRainbow)" />
      <path
        d="M32,0 L34.5,6 L41,6.5 L36,11 L37.5,17 L32,14 L26.5,17 L28,11 L23,6.5 L29.5,6 Z"
        fill="#FBBF24"
        transform="scale(0.8) translate(8, 0)"
      />
      <text x="42" y="32" className="logo-text" fill="url(#naturalRainbow)">ke</text>
      <text x="95" y="30" className="version-text">ver.1</text>
    </svg>
  </div>
);
