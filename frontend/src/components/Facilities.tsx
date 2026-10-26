import React, { useState } from 'react';
import { Eye, Layers, Info } from 'lucide-react';
import { FACILITIES_DATA, type FacilityItem } from '../data/facilitiesData';
import { Lightbox } from './Lightbox';

export const Facilities: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Classroom', 'Study Area', 'Doubt & Discussion', 'Testing & Practice', 'Team & Mentorship'];

  const filteredFacilities =
    selectedCategory === 'All'
      ? FACILITIES_DATA
      : FACILITIES_DATA.filter((f) => f.category === selectedCategory);

  const handleOpenLightbox = (facility: FacilityItem) => {
    const idx = FACILITIES_DATA.findIndex((item) => item.id === facility.id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : FACILITIES_DATA.length - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! < FACILITIES_DATA.length - 1 ? prev! + 1 : 0));
  };

  return (
    <section id="facilities" className="py-10 sm:py-16 md:py-20 bg-[#FAF6F0]/90 dark:bg-[#0D0905]/90 text-[#150F0A] dark:text-[#FFEDD7] border-b border-stone-200/90 dark:border-[#FFEDD7]/10 oryzo-blueprint-grid transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#18120B]/90 border border-stone-200/90 dark:border-[#FFEDD7]/15 text-[#C65D1E] dark:text-[#F4C76B] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#C65D1E] dark:text-[#F4C76B]" />
            <span>Infrastructure & Atmosphere</span>
          </div>
          <h2 className="luxury-editorial-heading text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#150F0A] dark:text-[#FFEDD7] tracking-tight mb-3 break-words">
            Classrooms & Campus{' '}
            <span className="font-serif-luxury italic font-normal text-amber-600 dark:text-[#F4C76B]">
              Infrastructure
            </span>
          </h2>
          <p className="font-serif-literata text-slate-600 dark:text-[#D4C3AF] text-xs sm:text-base leading-relaxed">
            A purposeful, distraction-free environment in Bijipur, Brahmapur designed for sustained concentration,
            collaborative doubt clearing, and continuous academic growth.
          </p>

          {/* Category Filter Chips */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
                  selectedCategory === cat
                    ? 'bg-[#17365D] text-white dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] shadow-sm border border-transparent dark:border-amber-300/40'
                    : 'bg-white dark:bg-[#202B3D] text-slate-600 dark:text-[#AAB4C3] hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#2A374D] border border-slate-200 dark:border-[#344054]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => {
            return (
              <div
                key={facility.id}
                onClick={() => handleOpenLightbox(facility)}
                className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer hover:border-[#17365D]/40 dark:hover:border-[#F4C76B]/40"
              >
                {/* Image Container with Hover Action */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100 dark:bg-[#172033]">
                  <img
                    src={facility.imageUrl}
                    alt={facility.title}
                    width="600"
                    height="256"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-85 group-hover:opacity-90 transition-opacity"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-black/60 dark:bg-[#111827]/90 text-white px-2.5 py-0.5 rounded-md border border-white/20 dark:border-[#344054] shadow-xs">
                      {facility.category}
                    </span>
                    {facility.isAcademyOriginal ? (
                      <span className="text-[10px] font-bold bg-[#17365D] text-white dark:bg-[#172033] dark:text-[#F4C76B] border border-transparent dark:border-[#344054] px-2 py-0.5 rounded shadow">
                        Official Academy Photo
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-[#38BDF8] text-slate-950 px-2 py-0.5 rounded shadow">
                        Campus Facility
                      </span>
                    )}
                  </div>

                  {/* Click to Zoom Hover Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px]">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#17365D] text-white dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] font-extrabold text-xs shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-white dark:text-[#0F172A]" />
                      Click to View Full Size
                    </span>
                  </div>

                  {/* Bottom Image Title */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-['Outfit',sans-serif] font-bold text-base leading-snug drop-shadow-md">
                      {facility.title}
                    </h3>
                  </div>
                </div>

                {/* Description Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-slate-600 dark:text-[#AAB4C3] text-xs sm:text-sm leading-relaxed mb-3">
                    {facility.description}
                  </p>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-[#344054] pt-2 flex items-center justify-between">
                    <span className="truncate max-w-[240px]">{facility.attributionNote}</span>
                    <span className="text-[#17365D] dark:text-[#F4C76B] font-bold group-hover:underline">Zoom In →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gallery Note */}
        <div className="mt-10 sm:mt-12 bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-xl p-4 text-center max-w-2xl mx-auto text-xs text-slate-600 dark:text-[#AAB4C3] shadow-sm flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-[#17365D] dark:text-[#38BDF8] shrink-0" />
          <span>
            Visit our Bijipur center at Big Street, Brahmapur to experience the classroom atmosphere and tour the study facilities in person.
          </span>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          items={FACILITIES_DATA}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  );
};
