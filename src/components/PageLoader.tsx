import React from 'react';

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#111827]">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer glowing spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-[#344054] border-t-[#F4C76B] animate-spin"></div>
        {/* Inner brand emblem */}
        <div className="w-10 h-10 rounded-full bg-[#172033] p-1 shadow-sm border border-[#344054]">
          <img src="/logo_transparent.png" alt="Antariksh Logo" className="w-full h-full object-contain" />
        </div>
      </div>
      <p className="mt-4 text-xs font-bold text-[#F4C76B] tracking-wider uppercase animate-pulse">
        Loading Antariksh Academy...
      </p>
    </div>
  );
};
