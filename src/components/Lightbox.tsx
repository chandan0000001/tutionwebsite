import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import type { FacilityItem } from '../data/facilitiesData';

interface LightboxProps {
  items: FacilityItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || items.length === 0) return null;

  const current = items[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox Viewer"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white border-b border-[#344054] pb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-[#F4C76B]/15 text-[#F4C76B] border border-[#F4C76B]/30">
            {current.category}
          </span>
          <span className="text-xs text-[#AAB4C3]">
            Image {currentIndex + 1} of {items.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-[#202B3D] hover:bg-[#F4C76B] text-[#AAB4C3] hover:text-[#0B0F19] transition-colors cursor-pointer border border-[#344054]"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-[#202B3D]/90 hover:bg-[#F4C76B] text-[#F3F4F6] hover:text-[#0B0F19] transition-all border border-[#344054] hover:border-[#F4C76B] cursor-pointer shadow-lg"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Current Image */}
        <div className="max-w-4xl max-h-[70vh] flex flex-col items-center justify-center p-2">
          <img
            src={current.imageUrl}
            alt={current.title}
            className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-2xl border border-[#344054]"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-[#202B3D]/90 hover:bg-[#F4C76B] text-[#F3F4F6] hover:text-[#0B0F19] transition-all border border-[#344054] hover:border-[#F4C76B] cursor-pointer shadow-lg"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Caption & Attribution Bar */}
      <div className="bg-[#202B3D] border border-[#344054] rounded-xl p-4 max-w-4xl mx-auto w-full text-[#F3F4F6]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
          <h4 className="text-base font-bold text-[#F3F4F6] font-['Outfit',sans-serif]">
            {current.title}
          </h4>
          {current.isAcademyOriginal ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
              Verified Academy Social Photo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/30 px-2 py-0.5 rounded">
              <Info className="w-3 h-3" />
              Illustrative Campus Visualization
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-[#AAB4C3] leading-relaxed mb-2">
          {current.description}
        </p>

        <div className="text-[11px] text-[#AAB4C3] border-t border-[#344054] pt-1.5 flex items-center justify-between">
          <span>{current.attributionNote}</span>
          <span className="hidden sm:inline text-slate-500">Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
