import React, { useState } from 'react';
import { Calendar, Filter, CheckCircle2, Trophy, Sparkles } from 'lucide-react';
import { RESULTS_DATA, RESULT_YEARS, type ResultYear } from '../data/resultsData';

export const Results: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<ResultYear | 'all'>('2026');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'JEE', 'NEET', 'OUAT & ICAR', '+2 Science Board'];

  const filteredResults = RESULTS_DATA.filter((item) => {
    const yearMatch = selectedYear === 'all' || item.year === selectedYear;
    const catMatch = selectedCategory === 'All' || item.category === selectedCategory;
    return yearMatch && catMatch;
  });

  return (
    <section id="results" className="py-10 sm:py-16 md:py-20 bg-[#F8FAFC] dark:bg-[#111827] border-b border-slate-200 dark:border-[#344054] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-[#C6922E] dark:text-[#F4C76B] text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B]" />
            <span>10 Years of Proven Academic Excellence (2017–2026)</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Every Success Has a{' '}
            <span className="text-[#17365D] dark:bg-gradient-to-r dark:from-white dark:via-amber-100 dark:to-[#F4C76B] dark:bg-clip-text dark:text-transparent">
              Story.
            </span>
          </h2>
          <p className="text-slate-600 dark:text-[#AAB4C3] text-sm sm:text-base leading-relaxed">
            Celebrating a decade of dedication, hard work, and remarkable student achievements across Odisha CHSE Science Boards
            and national competitive entrance examinations.
          </p>

          {/* Quick Stats Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] text-center shadow-sm">
              <span className="block text-xl sm:text-2xl font-black text-[#17365D] dark:text-[#F4C76B] font-['Outfit',sans-serif]">99.4%ile+</span>
              <span className="text-[11px] text-slate-500 dark:text-[#AAB4C3] font-semibold uppercase tracking-wider">Top JEE Main Score</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] text-center shadow-sm">
              <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-['Outfit',sans-serif]">678 / 720</span>
              <span className="text-[11px] text-slate-500 dark:text-[#AAB4C3] font-semibold uppercase tracking-wider">Top NEET-UG Score</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] text-center shadow-sm">
              <span className="block text-xl sm:text-2xl font-black text-sky-600 dark:text-[#38BDF8] font-['Outfit',sans-serif]">96.2%</span>
              <span className="text-[11px] text-slate-500 dark:text-[#AAB4C3] font-semibold uppercase tracking-wider">Top +2 CHSE Board</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] text-center shadow-sm">
              <span className="block text-xl sm:text-2xl font-black text-[#C6922E] dark:text-[#F4C76B] font-['Outfit',sans-serif]">State Rank 14</span>
              <span className="text-[11px] text-slate-500 dark:text-[#AAB4C3] font-semibold uppercase tracking-wider">Top OUAT / ICAR Rank</span>
            </div>
          </div>

          {/* Year Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B]" /> Academic Session:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <button
                onClick={() => setSelectedYear('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                  selectedYear === 'all'
                    ? 'bg-[#17365D] text-white dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] shadow-sm border border-transparent dark:border-amber-300/40'
                    : 'bg-white dark:bg-[#202B3D] text-slate-600 dark:text-[#AAB4C3] hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#2A374D] border border-slate-200 dark:border-[#344054]'
                }`}
              >
                All 10 Sessions (2017–2026)
              </button>
              {RESULT_YEARS.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                    selectedYear === yr
                      ? 'bg-[#17365D] text-white dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] shadow-sm border border-transparent dark:border-amber-300/40'
                      : 'bg-white dark:bg-[#202B3D] text-slate-600 dark:text-[#AAB4C3] hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#2A374D] border border-slate-200 dark:border-[#344054]'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Category Filter */}
          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#17365D] dark:text-[#38BDF8]" /> Stream:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                    selectedCategory === cat
                      ? 'bg-[#17365D] text-white dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] shadow-xs font-extrabold border border-transparent dark:border-amber-300/40'
                      : 'bg-white dark:bg-[#202B3D] text-slate-600 dark:text-[#AAB4C3] border border-slate-200 dark:border-[#344054] hover:bg-slate-50 dark:hover:bg-[#2A374D] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Cards Grid - Dynamic Wrapping without text cutoff */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
          {filteredResults.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-[#17365D]/40 dark:hover:border-[#F4C76B]/40 transition-all duration-300 flex flex-col justify-between h-full group"
            >
              <div>
                {/* Card Top: Year & Category Badges */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#172033] text-slate-700 dark:text-white border border-slate-200 dark:border-[#344054]">
                      Session {item.year}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700/50 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#172033] text-[#C6922E] dark:text-[#F4C76B] border border-slate-200 dark:border-[#344054]">
                    {item.category}
                  </span>
                </div>

                {/* Department / Track Record Avatar + Name + Score */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-[#172033] border-2 border-slate-200 dark:border-[#F4C76B]/60 shrink-0 shadow-sm flex items-center justify-center">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.studentName}
                        width="48"
                        height="48"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <Trophy className="w-5 h-5 text-[#C6922E] dark:text-[#F4C76B]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-['Outfit',sans-serif] text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#17365D] dark:group-hover:text-[#F4C76B] transition-colors break-words">
                      {item.studentName}
                    </h3>
                    <div className="text-xs font-extrabold text-[#17365D] dark:text-[#F4C76B] mt-0.5 leading-snug break-words">
                      {item.scoreOrRank}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-[#AAB4C3] break-words leading-tight mt-0.5">
                      {item.allotmentOrCollege}
                    </div>
                  </div>
                </div>

                {/* Achievement Highlight */}
                <div className="bg-slate-50 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] rounded-xl p-2.5 mb-3">
                  <p className="text-xs font-semibold text-slate-800 dark:text-white flex items-start gap-1.5 leading-snug break-words">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item.achievementSummary}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 pl-5 break-words">
                    {item.details}
                  </p>
                </div>

                {/* Student Quote / Review - Dynamic wrap */}
                <div className="text-xs text-slate-700 dark:text-slate-200 italic bg-slate-50 dark:bg-[#172033] border-l-2 border-[#17365D] dark:border-[#F4C76B] pl-3 pr-2 py-2.5 rounded-r-lg leading-relaxed break-words mb-3">
                  "{item.storyQuote}"
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-auto pt-3 border-t border-slate-200 dark:border-[#344054] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-[#C6922E] dark:text-[#F4C76B]" />
                  Antariksh Academy
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  Bijipur, Brahmapur
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Search Fallback */}
        {filteredResults.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#202B3D] rounded-2xl border border-slate-200 dark:border-[#344054] max-w-md mx-auto shadow-sm">
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              No results found for {selectedCategory} in Session {selectedYear}.
            </p>
            <p className="text-xs text-slate-600 dark:text-[#AAB4C3] mb-3">
              Try clicking "All Sessions" or selecting another stream.
            </p>
            <button
              onClick={() => {
                setSelectedYear('all');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-lg text-xs font-extrabold text-white bg-[#17365D] hover:bg-[#102A43] dark:text-[#0F172A] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:hover:brightness-105 transition-colors cursor-pointer min-h-[44px]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-10 sm:mt-12 text-center text-xs text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          <p>
            Student results are updated following every official CHSE Odisha Council and NTA/UPSC declaration.
            Visit our center at Bijipur Big Street, Brahmapur to view full merit certificates and score cards.
          </p>
        </div>

      </div>
    </section>
  );
};
