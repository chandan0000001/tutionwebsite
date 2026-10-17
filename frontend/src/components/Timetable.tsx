import React, { useState } from 'react';
import { Clock, Calendar, MapPin, Phone } from 'lucide-react';
import { TIMETABLE_DATA } from '../data/timetableData';

interface TimetableProps {
  onContactForBatch: () => void;
}

export const Timetable: React.FC<TimetableProps> = ({ onContactForBatch }) => {
  const [selectedSession, setSelectedSession] = useState<string>('All');
  const [selectedStream, setSelectedStream] = useState<string>('All');

  const streams = ['All', '+2 Science Board', 'JEE Main/Adv', 'NEET-UG', 'OUAT & ICAR', 'Integrated'];

  const filteredSlots = TIMETABLE_DATA.filter((slot) => {
    const matchesStream = selectedStream === 'All' || slot.stream === selectedStream;
    const matchesSession =
      selectedSession === 'All' ||
      (selectedSession === 'Morning' && slot.sessionName === 'Morning Session') ||
      (selectedSession === 'Afternoon' && slot.sessionName === 'Afternoon Session') ||
      (selectedSession === 'Evening' && slot.sessionName === 'Evening Session');
    return matchesStream && matchesSession;
  });

  return (
    <section id="timetable" className="py-8 sm:py-16 md:py-20 bg-[#F8FAFC] dark:bg-[#111827] border-b border-slate-200 dark:border-[#344054] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#344054] text-[#C6922E] dark:text-[#F4C76B] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B]" />
            <span>Daily Academic Routine</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2 sm:mb-3 leading-tight">
            Class Timetable &{' '}
            <span className="text-[#17365D] dark:bg-gradient-to-r dark:from-white dark:via-amber-100 dark:to-[#F4C76B] dark:bg-clip-text dark:text-transparent">
              Batch Schedules
            </span>
          </h2>
          <p className="text-slate-600 dark:text-[#AAB4C3] text-xs sm:text-base leading-relaxed max-w-xl mx-auto">
            3 high-performance shifts with 4 parallel batches in each shift, structured around local college hours in Brahmapur.
          </p>

          {/* Clean 3-Session Quick Switcher Grid (Visual, not heavy text) */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedSession(selectedSession === 'Morning' ? 'All' : 'Morning')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedSession === 'Morning'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-300 ring-2 ring-amber-500/30'
                  : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 hover:border-amber-400/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-[#C6922E] dark:text-[#F4C76B]">🌅 Morning Shift</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 font-bold text-amber-800 dark:text-amber-300">4 Batches</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">06:30 AM – 08:30 AM</div>
            </button>

            <button
              onClick={() => setSelectedSession(selectedSession === 'Afternoon' ? 'All' : 'Afternoon')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedSession === 'Afternoon'
                  ? 'bg-sky-500/10 border-sky-500 text-sky-900 dark:text-sky-300 ring-2 ring-sky-500/30'
                  : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 hover:border-sky-400/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-sky-600 dark:text-sky-400">☀️ Afternoon Shift</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 font-bold text-sky-800 dark:text-sky-300">4 Batches</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">02:00 PM – 04:15 PM</div>
            </button>

            <button
              onClick={() => setSelectedSession(selectedSession === 'Evening' ? 'All' : 'Evening')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedSession === 'Evening'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                  : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 hover:border-emerald-400/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400">🌙 Evening Shift</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 font-bold text-emerald-800 dark:text-emerald-300">4 Batches</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">05:00 PM – 08:00 PM</div>
            </button>
          </div>

          {/* Stream Filter Horizontal Chip Bar */}
          <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 sm:justify-center scrollbar-none">
            {streams.map((stream) => (
              <button
                key={stream}
                onClick={() => setSelectedStream(stream)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer min-h-[38px] ${
                  selectedStream === stream
                    ? 'bg-[#17365D] text-white dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:text-[#0F172A] shadow-xs'
                    : 'bg-white dark:bg-[#1E293B] text-slate-600 dark:text-[#AAB4C3] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                }`}
              >
                {stream}
              </button>
            ))}
            {(selectedSession !== 'All' || selectedStream !== 'All') && (
              <button
                onClick={() => {
                  setSelectedSession('All');
                  setSelectedStream('All');
                }}
                className="px-2.5 py-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 whitespace-nowrap cursor-pointer underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Timetable Table / Cards Container */}
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-[#172033] text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-[#344054]">
                  <th className="py-3.5 px-4">Batch & Target Class</th>
                  <th className="py-3.5 px-4">Stream</th>
                  <th className="py-3.5 px-4">Days</th>
                  <th className="py-3.5 px-4">Class Timing</th>
                  <th className="py-3.5 px-4">Subject Focus</th>
                  <th className="py-3.5 px-4">Faculty & Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#344054]/60 text-xs sm:text-sm">
                {filteredSlots.map((slot, idx) => (
                  <tr
                    key={slot.id}
                    className={`hover:bg-slate-50 dark:hover:bg-[#2A374D] transition-colors ${
                      idx % 2 === 0 ? 'bg-white dark:bg-[#202B3D]' : 'bg-slate-50/50 dark:bg-[#172033]'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 dark:text-white block">{slot.batchName}</span>
                      <span className="text-xs text-[#17365D] dark:text-[#F4C76B] font-bold">{slot.targetClass}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-[#172033] text-[#C6922E] dark:text-[#F4C76B] border border-slate-200 dark:border-[#344054]">
                        {slot.stream}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-[#AAB4C3] font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {slot.days}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#17365D] dark:text-[#F4C76B]" />
                        {slot.timeSlot}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                      {slot.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {slot.facultyPlaceholder}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {slot.room}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards View */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredSlots.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No classes match the selected filter. Try choosing "All".
              </div>
            ) : (
              filteredSlots.map((slot) => (
                <div key={slot.id} className="p-3.5 sm:p-4 space-y-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase text-[#C6922E] dark:text-[#F4C76B] block">
                        {slot.targetClass}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 leading-snug">
                        {slot.batchName}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700 shrink-0">
                      {slot.stream}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-[#111827] px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B] shrink-0" />
                      <span>{slot.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{slot.days}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 pt-0.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                      {slot.subject}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 shrink-0">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {slot.room}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Timetable CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] text-slate-800 dark:text-white rounded-2xl p-6 shadow-xl">
          <div className="text-left">
            <h3 className="text-lg font-bold font-['Outfit',sans-serif] text-slate-900 dark:text-white">
              Need a personalized batch timing or shift adjustment?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#AAB4C3] mt-1">
              We coordinate batches to avoid school timing conflicts. Speak with our academic coordinator.
            </p>
          </div>
          <button
            onClick={onContactForBatch}
            className="shrink-0 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-[#17365D] hover:bg-[#102A43] dark:text-[#0F172A] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] dark:hover:brightness-105 shadow-md border border-transparent dark:border-amber-300/40 transition-all flex items-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Phone className="w-4 h-4 text-white dark:text-[#0F172A]" />
            <span>Confirm Batch Availability</span>
          </button>
        </div>

      </div>
    </section>
  );
};
