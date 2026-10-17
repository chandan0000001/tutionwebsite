import React, { useState } from 'react';
import { Star, MessageSquareQuote, Quote } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';

export const Testimonials: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Student' | 'Parent'>('All');

  const filteredList =
    filter === 'All'
      ? TESTIMONIALS_DATA
      : TESTIMONIALS_DATA.filter((t) => t.authorType === filter);

  return (
    <section id="testimonials" className="py-10 sm:py-16 md:py-20 bg-[#F8FAFC] dark:bg-[#111827] border-b border-slate-200 dark:border-[#344054] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-[#C6922E] dark:text-[#F4C76B] text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B]" />
            <span>Community Experiences</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Student & Parent Perspectives
          </h2>
          <p className="text-slate-600 dark:text-[#AAB4C3] text-sm sm:text-base leading-relaxed">
            Real reflections on our disciplined classroom atmosphere, personal mentor accessibility, and balanced +2
            Science preparation in Brahmapur.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {(['All', 'Student', 'Parent'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
                  filter === cat
                    ? 'bg-[#17365D] text-white dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] shadow-sm'
                    : 'bg-white dark:bg-[#202B3D] text-slate-600 dark:text-[#AAB4C3] hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#2A374D] border border-slate-200 dark:border-[#344054]'
                }`}
              >
                {cat === 'All' ? 'All Reviews' : `${cat} Feedback`}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group hover:border-[#17365D]/40 dark:hover:border-[#F4C76B]/40"
            >
              <div>
                {/* Rating & Author Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#C6922E] dark:text-[#F4C76B]">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-[#172033] text-[#C6922E] dark:text-[#F4C76B] border border-slate-200 dark:border-[#344054]">
                    {item.authorType} Voice
                  </span>
                </div>

                {/* Quote Content */}
                <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed mb-6 italic relative break-words">
                  <Quote className="w-6 h-6 text-slate-300 dark:text-slate-700 absolute -top-3 -left-2 -z-10" />
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-black/40 border-2 border-[#17365D]/30 dark:border-[#F4C76B]/40 shrink-0 shadow-sm">
                  <img
                    src={item.avatarUrl}
                    alt={item.displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.displayName}
                  </span>
                  <span className="text-[11px] text-[#17365D] dark:text-[#F4C76B] font-semibold truncate">
                    {item.subTitle}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Stream: {item.courseTag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          <p>
            * Testimonials are collected from enrolled students and parents at Antariksh Academy Berhampur center.
          </p>
        </div>

      </div>
    </section>
  );
};
