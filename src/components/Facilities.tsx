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
    <section id="facilities" className="py-16 sm:py-20 md:py-24 bg-[#08090D] border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#141824] border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-[#FC1682]" />
            <span>Infrastructure & Atmosphere</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Classrooms & Campus{' '}
            <span className="bg-gradient-to-r from-white via-pink-200 to-[#FC1682] bg-clip-text text-transparent">
              Infrastructure
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            A purposeful, distraction-free environment in Bijipur, Brahmapur designed for sustained concentration,
            collaborative doubt clearing, and continuous academic growth.
          </p>

          {/* Category Filter Chips */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] text-white shadow-md shadow-pink-600/30 border border-pink-400/40'
                    : 'bg-[#141824] text-slate-300 hover:text-white hover:bg-[#1C2232] border border-pink-500/20'
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
                className="bg-[#141824] border border-pink-500/25 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer hover:border-pink-500/60"
              >
                {/* Image Container with Hover Action */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-[#0D1017]">
                  <img
                    src={facility.imageUrl}
                    alt={facility.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-transparent to-transparent opacity-85 group-hover:opacity-90 transition-opacity"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#08090D]/90 text-white px-2.5 py-0.5 rounded-md border border-pink-500/30 shadow-xs">
                      {facility.category}
                    </span>
                    {facility.isAcademyOriginal ? (
                      <span className="text-[10px] font-bold bg-[#FC1682] text-white px-2 py-0.5 rounded shadow shadow-pink-600/30">
                        Official Academy Photo
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-[#38BDF8] text-black px-2 py-0.5 rounded shadow">
                        Campus Facility
                      </span>
                    )}
                  </div>

                  {/* Click to Zoom Hover Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px]">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FC1682] text-white font-bold text-xs shadow-lg shadow-pink-600/40 transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-white" />
                      Click to View Full Size
                    </span>
                  </div>

                  {/* Bottom Image Title */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-['Outfit',sans-serif] font-bold text-base leading-snug drop-shadow-sm">
                      {facility.title}
                    </h3>
                  </div>
                </div>

                {/* Description Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
                    {facility.description}
                  </p>

                  <div className="text-[11px] text-slate-400 border-t border-pink-500/20 pt-2 flex items-center justify-between">
                    <span className="truncate max-w-[240px]">{facility.attributionNote}</span>
                    <span className="text-[#FC1682] font-bold group-hover:underline">Zoom In →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gallery Note */}
        <div className="mt-12 bg-[#141824] border border-pink-500/25 rounded-xl p-4 text-center max-w-2xl mx-auto text-xs text-slate-300 shadow-md flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-[#38BDF8] shrink-0" />
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
