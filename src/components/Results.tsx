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
    <section id="results" className="py-20 md:py-28 bg-[#111827] border-b border-[#344054]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F4C76B]/15 border border-[#F4C76B]/30 text-[#F4C76B] text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy className="w-3.5 h-3.5 text-[#F4C76B]" />
            <span>10 Years of Proven Academic Excellence (2017–2026)</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight mb-4">
            Every Success Has a Story.
          </h2>
          <p className="text-[#AAB4C3] text-base sm:text-lg leading-relaxed">
            Celebrating a decade of dedication, hard work, and remarkable student achievements across Odisha CHSE Science Boards
            and national competitive entrance examinations.
          </p>

          {/* Quick Stats Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-[#202B3D] border border-[#344054] text-center shadow-sm">
              <span className="block text-xl sm:text-2xl font-extrabold text-[#F4C76B] font-['Outfit',sans-serif]">99.4%ile+</span>
              <span className="text-[11px] text-[#AAB4C3] font-semibold uppercase tracking-wider">Top JEE Main Score</span>
            </div>
            <div className="p-3 rounded-xl bg-[#202B3D] border border-[#344054] text-center shadow-sm">
              <span className="block text-xl sm:text-2xl font-extrabold text-emerald-400 font-['Outfit',sans-serif]">678 / 720</span>
              <span className="text-[11px] text-[#AAB4C3] font-semibold uppercase tracking-wider">Top NEET-UG Score</span>
            </div>
            <div className="p-3 rounded-xl bg-[#202B3D] border border-[#344054] text-center shadow-sm">
              <span className="block text-xl sm:text-2xl font-extrabold text-[#38BDF8] font-['Outfit',sans-serif]">96.2%</span>
              <span className="text-[11px] text-[#AAB4C3] font-semibold uppercase tracking-wider">Top +2 CHSE Board</span>
            </div>
            <div className="p-3 rounded-xl bg-[#202B3D] border border-[#344054] text-center shadow-sm">
              <span className="block text-xl sm:text-2xl font-extrabold text-purple-400 font-['Outfit',sans-serif]">AIR 142</span>
              <span className="text-[11px] text-[#AAB4C3] font-semibold uppercase tracking-wider">UPSC NDA Rank</span>
            </div>
          </div>

          {/* Year Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#AAB4C3] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#F4C76B]" /> Academic Session:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <button
                onClick={() => setSelectedYear('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedYear === 'all'
                    ? 'bg-gradient-to-r from-[#F4C76B] to-[#E5B555] text-[#0B0F19] shadow-md font-bold'
                    : 'bg-[#202B3D] text-[#AAB4C3] hover:text-[#F3F4F6] hover:bg-[#2A374D] border border-[#344054]'
                }`}
              >
                All 10 Sessions (2017–2026)
              </button>
              {RESULT_YEARS.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedYear === yr
                      ? 'bg-gradient-to-r from-[#F4C76B] to-[#E5B555] text-[#0B0F19] shadow-md font-bold'
                      : 'bg-[#202B3D] text-[#AAB4C3] hover:text-[#F3F4F6] hover:bg-[#2A374D] border border-[#344054]'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Category Filter */}
          <div className="mt-3.5 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-[#AAB4C3] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#AAB4C3]" /> Stream:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#38BDF8] to-[#0284C7] text-white shadow-xs font-bold'
                    : 'bg-[#202B3D] text-[#AAB4C3] border border-[#344054] hover:bg-[#2A374D] hover:text-[#F3F4F6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredResults.map((item) => (
            <div
              key={item.id}
              className="bg-[#202B3D] border border-[#344054] rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:border-[#F4C76B]/50"
            >
              <div>
                {/* Card Top: Year & Category Badges */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#172033] text-[#F3F4F6] border border-[#344054]">
                      Session {item.year}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F4C76B]/15 text-[#F4C76B] border border-[#F4C76B]/30">
                    {item.category}
                  </span>
                </div>

                {/* Student Avatar + Name + Score */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#172033] border-2 border-[#F4C76B]/40 shrink-0 shadow-sm">
                    <img
                      src={item.photoUrl}
                      alt={item.studentName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-['Outfit',sans-serif] text-sm font-bold text-[#F3F4F6] truncate group-hover:text-[#F4C76B] transition-colors">
                      {item.studentName}
                    </h3>
                    <div className="text-xs font-extrabold text-[#F4C76B] mt-0.5 leading-snug">
                      {item.scoreOrRank}
                    </div>
                    <div className="text-[11px] text-[#AAB4C3] truncate">
                      {item.allotmentOrCollege}
                    </div>
                  </div>
                </div>

                {/* Achievement Highlight */}
                <div className="bg-[#172033] border border-[#344054] rounded-xl p-2.5 mb-3">
                  <p className="text-xs font-semibold text-[#F3F4F6] flex items-start gap-1.5 leading-snug">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item.achievementSummary}</span>
                  </p>
                  <p className="text-[10px] text-[#AAB4C3] mt-1 pl-5">
                    {item.details}
                  </p>
                </div>

                {/* Student Quote / Review */}
                <p className="text-xs text-[#CBD5E1] italic bg-[#172033]/80 border-l-2 border-[#F4C76B] pl-2.5 py-1.5 pr-1 rounded-r-lg leading-relaxed line-clamp-3">
                  "{item.storyQuote}"
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-2.5 border-t border-[#344054] flex items-center justify-between text-[11px] text-[#AAB4C3]">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-[#F4C76B]" />
                  Antariksh Academy
                </span>
                <span className="text-[10px] text-[#AAB4C3] font-medium">
                  Bijipur, Brahmapur
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Search Fallback */}
        {filteredResults.length === 0 && (
          <div className="text-center py-12 bg-[#202B3D] rounded-2xl border border-[#344054] max-w-md mx-auto">
            <p className="text-sm font-semibold text-[#F3F4F6] mb-1">
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
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-[#0B0F19] bg-gradient-to-r from-[#F4C76B] to-[#E5B555] hover:from-[#E5B555] transition-colors cursor-pointer font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 text-center text-xs text-[#AAB4C3] max-w-2xl mx-auto">
          <p>
            Student results are updated following every official CHSE Odisha Council and NTA/UPSC declaration.
            Visit our center at Bijipur Big Street, Brahmapur to view full merit certificates and score cards.
          </p>
        </div>

      </div>
    </section>
  );
};
