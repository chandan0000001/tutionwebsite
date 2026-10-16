import React, { useState } from 'react';
import { Clock, Calendar, MapPin, AlertCircle, Phone } from 'lucide-react';
import { TIMETABLE_DATA, TIMETABLE_NOTICE } from '../data/timetableData';

interface TimetableProps {
  onContactForBatch: () => void;
}

export const Timetable: React.FC<TimetableProps> = ({ onContactForBatch }) => {
  const [selectedStream, setSelectedStream] = useState<string>('All');

  const streams = ['All', '+2 Science Board', 'JEE Main/Adv', 'NEET-UG', 'NDA Prep', 'Integrated'];

  const filteredSlots =
    selectedStream === 'All'
      ? TIMETABLE_DATA
      : TIMETABLE_DATA.filter((s) => s.stream === selectedStream);

  return (
    <section id="timetable" className="py-16 sm:py-20 md:py-24 bg-[#08090D] border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#141824] border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5 text-[#FC1682]" />
            <span>Academic Routine</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Class Timetable &{' '}
            <span className="bg-gradient-to-r from-white via-pink-200 to-[#FC1682] bg-clip-text text-transparent">
              Batch Schedules
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Organized batch slots structured around school schedules in Brahmapur to give students ample time for
            lectures, practicals, and self-study revision.
          </p>

          {/* Timetable Disclaimer Alert */}
          <div className="mt-6 bg-[#141824] border border-pink-500/30 rounded-xl p-3.5 text-xs text-slate-200 flex items-start gap-2.5 max-w-2xl mx-auto text-left shadow-sm">
            <AlertCircle className="w-4 h-4 text-[#FC1682] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-pink-300">Active Batch Schedules: </span>
              {TIMETABLE_NOTICE}
            </div>
          </div>

          {/* Stream Filter Buttons */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            {streams.map((stream) => (
              <button
                key={stream}
                onClick={() => setSelectedStream(stream)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedStream === stream
                    ? 'bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] text-white shadow-md shadow-pink-600/25 border border-pink-400/40'
                    : 'bg-[#141824] text-slate-300 hover:text-white hover:bg-[#1C2232] border border-pink-500/20'
                }`}
              >
                {stream}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Table / Cards Container */}
        <div className="bg-[#141824] border border-pink-500/25 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0D1017] text-white text-xs font-bold uppercase tracking-wider border-b border-pink-500/25">
                  <th className="py-3.5 px-4">Batch & Target Class</th>
                  <th className="py-3.5 px-4">Stream</th>
                  <th className="py-3.5 px-4">Days</th>
                  <th className="py-3.5 px-4">Class Timing</th>
                  <th className="py-3.5 px-4">Subject Focus</th>
                  <th className="py-3.5 px-4">Faculty & Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-500/15 text-xs sm:text-sm">
                {filteredSlots.map((slot, idx) => (
                  <tr
                    key={slot.id}
                    className={`hover:bg-[#1C2232] transition-colors ${
                      idx % 2 === 0 ? 'bg-[#141824]' : 'bg-[#0E121B]'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{slot.batchName}</span>
                      <span className="text-xs text-pink-300 font-bold">{slot.targetClass}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-[#0D1017] text-pink-300 border border-pink-500/35">
                        {slot.stream}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {slot.days}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      <span className="flex items-center gap-1.5 text-white">
                        <Clock className="w-3.5 h-3.5 text-[#FC1682]" />
                        {slot.timeSlot}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {slot.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="block font-bold text-slate-200 text-xs">
                        {slot.facultyPlaceholder}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
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
          <div className="lg:hidden divide-y divide-pink-500/15">
            {filteredSlots.map((slot) => (
              <div key={slot.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {slot.batchName}
                    </h3>
                    <span className="text-xs font-bold text-pink-300">
                      {slot.targetClass}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#0D1017] text-pink-300 border border-pink-500/35">
                    {slot.stream}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#0D1017] p-2.5 rounded-lg border border-pink-500/20">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot.days}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#FC1682]" />
                    <span>{slot.timeSlot}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-200 font-medium">
                  <span className="text-slate-400 font-normal">Subject: </span>
                  {slot.subject}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-pink-500/20">
                  <span>{slot.facultyPlaceholder}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {slot.room}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Timetable CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#141824] via-[#1A2030] to-[#141824] border border-pink-500/30 text-white rounded-2xl p-6 shadow-xl">
          <div className="text-left">
            <h3 className="text-lg font-bold font-['Outfit',sans-serif] text-white">
              Need a personalized batch timing or shift adjustment?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              We coordinate batches to avoid school timing conflicts. Speak with our academic coordinator.
            </p>
          </div>
          <button
            onClick={onContactForBatch}
            className="shrink-0 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#BE125A] hover:from-[#FF2D92] hover:to-[#FC1682] shadow-md shadow-pink-600/30 border border-pink-400/40 transition-all flex items-center gap-2 cursor-pointer font-bold"
          >
            <Phone className="w-4 h-4 text-white" />
            <span>Confirm Batch Availability</span>
          </button>
        </div>

      </div>
    </section>
  );
};
