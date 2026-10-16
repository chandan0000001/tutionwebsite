import React, { useState } from 'react';
import { Calendar, Filter, CheckCircle2, Trophy, Sparkles } from 'lucide-react';
import { RESULTS_DATA, RESULT_YEARS, type ResultYear } from '../data/resultsData';

export const Results: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<ResultYear | 'all'>('2026');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'JEE', 'NEET', 'NDA', '+2 Science Board'];

  const filteredResults = RESULTS_DATA.filter((item) => {
    const yearMatch = selectedYear === 'all' || item.year === selectedYear;
    const catMatch = selectedCategory === 'All' || item.category === selectedCategory;
    return yearMatch && catMatch;
  });

  return (
    <section id="results" className="py-10 sm:py-16 md:py-20 bg-[#111827] border-b border-[#344054]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#172033] border border-[#344054] text-[#F4C76B] text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy className="w-3.5 h-3.5 text-[#F4C76B]" />
            <span>10 Years of Proven Academic Excellence (2017–2026)</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Every Success Has a{' '}
            <span className="bg-gradient-to-r from-white via-amber-100 to-[#F4C76B] bg-clip-text text-transparent">
              Story.
            </span>
          </h2>
          <p className="text-[#AAB4C3] text-sm sm:text-base leading-relaxed">
            Celebrating a decade of dedication, hard work, and remarkable student achievements across Odisha CHSE Science Boards
            and national competitive entrance examinations.
          </p>

          {/* Quick Stats Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-[#202B3D] border border-[#344054] text-center shadow-md">
              <span className="block text-xl sm:text-2xl font-black text-[#F4C76B] font-['Outfit',sans-serif]">99.4%ile+</span>
              <span className="text-[11px] text-[#AAB4C3] font-semibold uppercase tracking-wider">Top JEE Main Score</span>
            </div>
            <div className="p-3 rounded-xl bg-[#202B3D] border border-[#344054] text-center shadow-md">
              <span className="block text-xl sm:text-2xl font-black text-emerald-400 font-['Outfit',sans-serif]">678 / 720</span>
              <span className="text-[11px] text-[#AAB4C3] font-semibold uppercase tracking-wider">Top NEET-UG Score</span>
            </div>
            <div className="p-3 rounded-xl bg-[#202B3D] border border-[#344054] text-center shadow-md">
              <span className="block text-xl sm:text-2xl font-black text-[#38BDF8] font-['Outfit',sans-serif]">96.2%</span>
              <span className="text-[11px] text-[#AAB4C3] font-semibold uppercase tracking-wider">Top +2 CHSE Board</span>
            </div>
            <div className="p-3 rounded-xl bg-[#202B3D] border border-[#344054] text-center shadow-md">
              <span className="block text-xl sm:text-2xl font-black text-[#F4C76B] font-['Outfit',sans-serif]">AIR 142</span>
              <span className="text-[11px] text-[#AAB4C3] font-semibold uppercase tracking-wider">UPSC NDA Rank</span>
            </div>
          </div>

          {/* Year Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#F4C76B]" /> Academic Session:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <button
                onClick={() => setSelectedYear('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                  selectedYear === 'all'
                    ? 'bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] text-[#0F172A] shadow-md shadow-amber-900/20 border border-amber-300/40'
                    : 'bg-[#202B3D] text-[#AAB4C3] hover:text-white hover:bg-[#2A374D] border border-[#344054]'
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
                      ? 'bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] text-[#0F172A] shadow-md shadow-amber-900/20 border border-amber-300/40'
                      : 'bg-[#202B3D] text-[#AAB4C3] hover:text-white hover:bg-[#2A374D] border border-[#344054]'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Category Filter */}
          <div className="mt-3.5 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" /> Stream:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] text-[#0F172A] shadow-xs font-bold border border-amber-300/40'
                    : 'bg-[#202B3D] text-[#AAB4C3] border border-[#344054] hover:bg-[#2A374D] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Cards Grid - Dynamic Wrapping without text cutoff */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
          {filteredResults.map((item) => (
            <div
              key={item.id}
              className="bg-[#202B3D] border border-[#344054] rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:border-[#F4C76B]/40 transition-all duration-300 flex flex-col justify-between h-full group"
            >
              <div>
                {/* Card Top: Year & Category Badges */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#172033] text-white border border-[#344054]">
                      Session {item.year}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-700/50 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#172033] text-[#F4C76B] border border-[#344054]">
                    {item.category}
                  </span>
                </div>

                {/* Student Avatar + Name + Score */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#172033] border-2 border-[#F4C76B]/60 shrink-0 shadow-md shadow-amber-900/20">
                    <img
                      src={item.photoUrl}
                      alt={item.studentName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-['Outfit',sans-serif] text-sm font-bold text-white group-hover:text-[#F4C76B] transition-colors break-words">
                      {item.studentName}
                    </h3>
                    <div className="text-xs font-extrabold text-[#F4C76B] mt-0.5 leading-snug break-words">
                      {item.scoreOrRank}
                    </div>
                    <div className="text-[11px] text-[#AAB4C3] break-words leading-tight mt-0.5">
                      {item.allotmentOrCollege}
                    </div>
                  </div>
                </div>

                {/* Achievement Highlight */}
                <div className="bg-[#172033] border border-[#344054] rounded-xl p-2.5 mb-3">
                  <p className="text-xs font-semibold text-white flex items-start gap-1.5 leading-snug break-words">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item.achievementSummary}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 pl-5 break-words">
                    {item.details}
                  </p>
                </div>

                {/* Student Quote / Review - Dynamic wrap */}
                <div className="text-xs text-slate-200 italic bg-[#172033] border-l-2 border-[#F4C76B] pl-3 pr-2 py-2.5 rounded-r-lg leading-relaxed break-words mb-3">
                  "{item.storyQuote}"
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-auto pt-3 border-t border-[#344054] flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-[#F4C76B]" />
                  Antariksh Academy
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Bijipur, Brahmapur
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Search Fallback */}
        {filteredResults.length === 0 && (
          <div className="text-center py-12 bg-[#202B3D] rounded-2xl border border-[#344054] max-w-md mx-auto">
            <p className="text-sm font-semibold text-white mb-1">
              No results found for {selectedCategory} in Session {selectedYear}.
            </p>
            <p className="text-xs text-[#AAB4C3] mb-3">
              Try clicking "All Sessions" or selecting another stream.
            </p>
            <button
              onClick={() => {
                setSelectedYear('all');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-lg text-xs font-extrabold text-[#0F172A] bg-gradient-to-r from-[#F4C76B] via-[#E5B555] to-[#D4A33B] hover:brightness-105 transition-colors cursor-pointer min-h-[44px]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-10 sm:mt-12 text-center text-xs text-slate-400 max-w-2xl mx-auto">
          <p>
            Student results are updated following every official CHSE Odisha Council and NTA/UPSC declaration.
            Visit our center at Bijipur Big Street, Brahmapur to view full merit certificates and score cards.
          </p>
        </div>

      </div>
    </section>
  );
};
