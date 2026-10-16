import React from 'react';
import { Users, BookOpen, CheckCircle2, Award } from 'lucide-react';
import { FACULTY_DATA } from '../data/facultyData';

export const Teachers: React.FC = () => {
  return (
    <section id="teachers" className="py-16 sm:py-20 md:py-24 bg-[#111827] border-b border-[#344054]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F4C76B]/15 border border-[#F4C76B]/30 text-[#F4C76B] text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5 text-[#F4C76B]" />
            <span>Academic Leadership</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight mb-4">
            Our Subject Mentors & Expert Teachers
          </h2>
          <p className="text-[#AAB4C3] text-base sm:text-lg leading-relaxed">
            Our experienced multidisciplinary team guides students through crystal-clear theoretical fundamentals,
            daily numerical drills, and personalized rank improvement strategies.
          </p>
        </div>

        {/* Center Leadership & Founders Real Photo Banner */}
        <div className="mb-14 bg-gradient-to-r from-[#172033] via-[#202B3D] to-[#172033] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#344054] flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full max-w-sm lg:w-72 h-56 rounded-2xl overflow-hidden shrink-0 border-2 border-[#F4C76B] shadow-lg relative">
            <img
              src="/images/academy_faculty_fb.jpg"
              alt="Antariksh Academy Berhampur Faculty"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-[#0B0F19]/90 backdrop-blur-md px-2 py-1 rounded text-[11px] font-bold text-[#F4C76B] text-center border border-[#344054]">
              Antariksh Berhampur Team
            </div>
          </div>

          <div className="space-y-3 text-left flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#F4C76B]/15 text-[#F4C76B] text-xs font-bold uppercase tracking-wider border border-[#F4C76B]/30">
              <Award className="w-3.5 h-3.5 text-[#F4C76B]" />
              <span>Dedicated Classroom Mentorship</span>
            </div>
            <h3 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-[#F3F4F6]">
              Led by Educators Who Care About Every Single Student
            </h3>
            <p className="text-[#AAB4C3] text-sm sm:text-base leading-relaxed">
              At Antariksh Academy, teaching is personal. Unlike large commercial factories where students are lost in crowds
              of hundreds, our educators are present on campus every day for one-on-one doubt clearance, motivation, and
              continuous guidance until the final examination day.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#CBD5E1]">
              <span className="flex items-center gap-1.5 font-semibold text-[#F3F4F6]">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
                7 Dedicated Subject Disciplines
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#F3F4F6]">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
                Daily Evening Doubt Desks
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#F3F4F6]">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
                Small Batch Sizes (Max 30 Students)
              </span>
            </div>
          </div>
        </div>

        {/* 7 Faculty Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FACULTY_DATA.map((faculty, index) => {
            const isLead = index === 6; // Lead Mentor card
            return (
              <div
                key={faculty.id}
                className={`bg-[#202B3D] border border-[#344054] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:border-[#F4C76B]/50 ${
                  isLead ? 'sm:col-span-2 lg:col-span-3 xl:col-span-1' : ''
                }`}
              >
                <div>
                  {/* Portrait Container */}
                  <div className="relative h-64 w-full overflow-hidden bg-[#172033]">
                    <img
                      src={faculty.avatarUrl}
                      alt={`${faculty.name} - ${faculty.subject}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#202B3D] via-[#202B3D]/30 to-transparent"></div>

                    {/* Subject Pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="bg-[#111827]/95 backdrop-blur-md text-[#F3F4F6] text-xs font-bold px-2.5 py-1 rounded-md shadow-sm border border-[#344054] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#F4C76B]" />
                        {faculty.subject}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#172033]/90 text-[#38BDF8] px-2 py-0.5 rounded border border-[#344054]">
                        Faculty Desk
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-[#F3F4F6] mb-0.5 group-hover:text-[#F4C76B] transition-colors">
                      {faculty.name}
                    </h3>
                    
                    <p className="text-xs font-bold text-[#38BDF8] mb-3">
                      {faculty.roleTitle}
                    </p>

                    <p className="text-[#AAB4C3] text-xs sm:text-sm leading-relaxed mb-4">
                      {faculty.shortIntro}
                    </p>

                    {/* Areas of Expertise */}
                    <div className="pt-3 border-t border-[#344054]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#AAB4C3] block mb-2">
                        Specialized Modules:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {faculty.areasOfExpertise.map((area, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-[#172033] text-[#CBD5E1] border border-[#344054] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#F4C76B] shrink-0" />
                            <span>{area}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Indicator */}
                <div className="px-5 py-3 bg-[#172033]/80 border-t border-[#344054] text-[11px] text-[#AAB4C3] flex items-center justify-between">
                  <span className="text-[#AAB4C3] font-medium">Berhampur Campus</span>
                  <span className="font-bold text-[#F4C76B]">Active Mentor</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Discrete Configuration Footnote */}
        <div className="mt-12 text-center text-xs text-[#AAB4C3] max-w-xl mx-auto">
          <p>
            * Faculty profiles represent our 7 core teaching domains at Antariksh Academy. To consult with subject faculty or schedule a counseling session, visit our Bijipur campus or book a consultation online.
          </p>
        </div>

      </div>
    </section>
  );
};
