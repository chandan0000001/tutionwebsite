import React from 'react';

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#08090D]">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer glowing spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-[#FC1682] animate-spin"></div>
        {/* Inner brand emblem */}
        <div className="w-10 h-10 rounded-full bg-[#141824] p-1 shadow-sm border border-pink-500/30">
          <img src="/logo_transparent.png" alt="Antariksh Logo" className="w-full h-full object-contain" />
        </div>
      </div>
      <p className="mt-4 text-xs font-bold text-pink-300 tracking-wider uppercase animate-pulse">
        Loading Antariksh Academy...
      </p>
    </div>
  );
};
