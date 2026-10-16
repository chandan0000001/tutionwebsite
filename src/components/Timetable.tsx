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
    <section id="timetable" className="py-16 sm:py-20 md:py-24 bg-[#111827] border-b border-[#344054]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F4C76B]/15 border border-[#F4C76B]/30 text-[#F4C76B] text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5 text-[#F4C76B]" />
            <span>Academic Routine</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight mb-4">
            Class Timetable & Batch Schedules
          </h2>
          <p className="text-[#AAB4C3] text-base sm:text-lg leading-relaxed">
            Organized batch slots structured around school schedules in Brahmapur to give students ample time for
            lectures, practicals, and self-study revision.
          </p>

          {/* Timetable Disclaimer Alert */}
          <div className="mt-6 bg-[#172033] border border-[#344054] rounded-xl p-3.5 text-xs text-[#CBD5E1] flex items-start gap-2.5 max-w-2xl mx-auto text-left shadow-sm">
            <AlertCircle className="w-4 h-4 text-[#F4C76B] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#F4C76B]">Active Batch Schedules: </span>
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
                    ? 'bg-gradient-to-r from-[#F4C76B] to-[#E5B555] text-[#0B0F19] shadow-md font-bold'
                    : 'bg-[#202B3D] text-[#AAB4C3] hover:text-[#F3F4F6] hover:bg-[#2A374D] border border-[#344054]'
                }`}
              >
                {stream}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Table / Cards Container */}
        <div className="bg-[#202B3D] border border-[#344054] rounded-2xl shadow-lg overflow-hidden">
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#172033] text-[#F3F4F6] text-xs font-bold uppercase tracking-wider border-b border-[#344054]">
                  <th className="py-3.5 px-4">Batch & Target Class</th>
                  <th className="py-3.5 px-4">Stream</th>
                  <th className="py-3.5 px-4">Days</th>
                  <th className="py-3.5 px-4">Class Timing</th>
                  <th className="py-3.5 px-4">Subject Focus</th>
                  <th className="py-3.5 px-4">Faculty & Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#344054] text-xs sm:text-sm">
                {filteredSlots.map((slot, idx) => (
                  <tr
                    key={slot.id}
                    className={`hover:bg-[#253247] transition-colors ${
                      idx % 2 === 0 ? 'bg-[#202B3D]' : 'bg-[#1C2637]'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#F3F4F6] block">{slot.batchName}</span>
                      <span className="text-xs text-[#F4C76B] font-bold">{slot.targetClass}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                        {slot.stream}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#CBD5E1] font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#AAB4C3]" />
                        {slot.days}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#F3F4F6]">
                      <span className="flex items-center gap-1.5 text-[#F3F4F6]">
                        <Clock className="w-3.5 h-3.5 text-[#F4C76B]" />
                        {slot.timeSlot}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#CBD5E1]">
                      {slot.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="block font-bold text-[#CBD5E1] text-xs">
                        {slot.facultyPlaceholder}
                      </span>
                      <span className="text-[11px] text-[#AAB4C3] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#AAB4C3]" />
                        {slot.room}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards View */}
          <div className="lg:hidden divide-y divide-[#344054]">
            {filteredSlots.map((slot) => (
              <div key={slot.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-[#F3F4F6] text-sm">
                      {slot.batchName}
                    </h3>
                    <span className="text-xs font-bold text-[#F4C76B]">
                      {slot.targetClass}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                    {slot.stream}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#172033] p-2.5 rounded-lg border border-[#344054]">
                  <div className="flex items-center gap-1.5 text-[#CBD5E1]">
                    <Calendar className="w-3.5 h-3.5 text-[#AAB4C3]" />
                    <span>{slot.days}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#F3F4F6] font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#F4C76B]" />
                    <span>{slot.timeSlot}</span>
                  </div>
                </div>

                <div className="text-xs text-[#CBD5E1] font-medium">
                  <span className="text-[#AAB4C3] font-normal">Subject: </span>
                  {slot.subject}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#AAB4C3] pt-1 border-t border-[#344054]">
                  <span>{slot.facultyPlaceholder}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#AAB4C3]" />
                    {slot.room}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Timetable CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#172033] via-[#202B3D] to-[#172033] border border-[#344054] text-[#F3F4F6] rounded-2xl p-6 shadow-xl">
          <div className="text-left">
            <h3 className="text-lg font-bold font-['Outfit',sans-serif] text-[#F3F4F6]">
              Need a personalized batch timing or shift adjustment?
            </h3>
            <p className="text-xs sm:text-sm text-[#AAB4C3] mt-1">
              We coordinate batches to avoid school timing conflicts. Speak with our academic coordinator.
            </p>
          </div>
          <button
            onClick={onContactForBatch}
            className="shrink-0 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#0B0F19] bg-gradient-to-r from-[#F4C76B] to-[#E5B555] hover:from-[#E5B555] hover:to-[#D4A344] shadow-md transition-all flex items-center gap-2 cursor-pointer font-bold"
          >
            <Phone className="w-4 h-4 text-[#0B0F19]" />
            <span>Confirm Batch Availability</span>
          </button>
        </div>

      </div>
    </section>
  );
};
