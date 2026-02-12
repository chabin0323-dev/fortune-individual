
import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex flex-col justify-center items-center p-8 space-y-2">
    <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 font-medium animate-pulse tracking-widest text-lg">
      運命を鑑定中...
    </p>
    <div className="relative w-24 h-24">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
      
      {/* Rotating Magic Circle */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full animate-[spin_4s_linear_infinite]"
      >
        <defs>
          <linearGradient id="magicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E879F9" /> {/* Pink */}
            <stop offset="50%" stopColor="#A855F7" /> {/* Purple */}
            <stop offset="100%" stopColor="#22D3EE" /> {/* Cyan */}
          </linearGradient>
        </defs>
        
        {/* Outer Ring */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#magicGradient)" strokeWidth="1" strokeDasharray="5,3" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#magicGradient)" strokeWidth="0.5" />
        
        {/* Hexagram (Star) */}
        <path 
          d="M50 5 L88.9 72.5 L11.1 72.5 Z" 
          fill="none" 
          stroke="url(#magicGradient)" 
          strokeWidth="1.5"
          className="opacity-80"
        />
        <path 
          d="M50 95 L11.1 27.5 L88.9 27.5 Z" 
          fill="none" 
          stroke="url(#magicGradient)" 
          strokeWidth="1.5" 
          className="opacity-80"
        />
        
        {/* Inner Details */}
        <circle cx="50" cy="50" r="10" fill="none" stroke="url(#magicGradient)" strokeWidth="1" />
        <circle cx="50" cy="50" r="4" fill="url(#magicGradient)" className="animate-pulse" />
        
        {/* Planetary dots on the ring */}
        <circle cx="50" cy="5" r="2" fill="#fff" />
        <circle cx="50" cy="95" r="2" fill="#fff" />
        <circle cx="95" cy="50" r="2" fill="#fff" />
        <circle cx="5" cy="50" r="2" fill="#fff" />
      </svg>
    </div>
  </div>
);
