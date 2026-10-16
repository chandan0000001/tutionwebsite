import React from 'react';
import {
  Lightbulb,
  Layers,
  HelpCircle,
  FileCheck2,
  Compass,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Shield,
  HeartHandshake,
} from 'lucide-react';

interface AboutProps {
  onLearnMoreCourses: () => void;
  onOpenConsultation: () => void;
}

export const About: React.FC<AboutProps> = ({ onLearnMoreCourses, onOpenConsultation }) => {
  const pillars = [
    {
      icon: Lightbulb,
      title: 'Concept-Based Teaching',
      description:
        'Instead of rote memorization or surface shortcuts, we build concepts from the first principles. Students learn the "why" and "how" behind every formula before tackling complex numericals.',
      color: 'text-[#F4C76B] bg-[#172033] border-[#344054]',
    },
    {
      icon: Layers,
      title: 'Structured Preparation',
      description:
        'We bridge the Odisha CHSE Council syllabus with competitive JEE/NEET patterns through a synchronized chapter flow, eliminating syllabus confusion and academic fatigue.',
      color: 'text-[#38BDF8] bg-[#172033] border-[#344054]',
    },
    {
      icon: HelpCircle,
      title: 'Dedicated Doubt-Clearing',
      description:
        'Learning happens when unresolved questions are addressed promptly. Our teachers maintain scheduled post-class doubt desks for one-on-one clarification every working day.',
      color: 'text-[#F4C76B] bg-[#172033] border-[#344054]',
    },
    {
      icon: FileCheck2,
      title: 'Practice Tests & Timed Revision',
      description:
        'Weekly subjective answer drills for council examinations alongside computerized/OMR simulations for entrance tests develop examination temperament and speed under pressure.',
      color: 'text-emerald-400 bg-[#172033] border-[#344054]',
    },
    {
      icon: Compass,
      title: 'Academic Mentoring',
      description:
        'Students encounter stress and fluctuating confidence during +2 years. Our mentors monitor individual learning curves, identify weak areas, and guide pacing strategies.',
      color: 'text-purple-400 bg-[#172033] border-[#344054]',
    },
    {
      icon: MessageCircle,
      title: 'Parent-Student Communication',
      description:
        'We believe parents are partners in their child’s academic journey. Regular updates, attendance tracking, and feedback meetings ensure everyone remains aligned.',
      color: 'text-[#38BDF8] bg-[#172033] border-[#344054]',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-[#111827] border-b border-[#344054]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F4C76B]/15 border border-[#F4C76B]/30 text-[#F4C76B] text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5 text-[#F4C76B]" />
            <span>10 Years of Academic Excellence • Educational Philosophy</span>
          </div>
          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F3F4F6] tracking-tight mb-4">
            A Balanced Approach to Board & Competitive Mastery
          </h2>
          <p className="text-[#AAB4C3] text-base sm:text-lg leading-relaxed">
            Founded in Bijipur, Brahmapur, Antariksh Academy was established to provide aspiring science students with
            thorough concept-oriented teaching, disciplined study habits, and personal guidance right here in Ganjam.
          </p>
        </div>

        {/* Narrative Feature Row: Mission and Context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16 bg-[#202B3D] border border-[#344054] rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4C76B] bg-[#F4C76B]/15 border border-[#F4C76B]/30 px-2.5 py-1 rounded-md">
              Bridging School & Entrance Examinations
            </span>
            <h3 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-[#F3F4F6]">
              Why We Prioritize Foundation Alongside Problem Solving
            </h3>
            <p className="text-[#CBD5E1] leading-relaxed text-sm sm:text-base">
              Many students in Class 11 and 12 struggle when attempting to manage their +2 board examinations and high-stakes
              competitive exams like JEE Main, NEET-UG, or NDA separately. When taught in silos, students end up feeling
              fatigued and disoriented.
            </p>
            <p className="text-[#CBD5E1] leading-relaxed text-sm sm:text-base">
              At Antariksh Academy, our curriculum brings the two streams into complete harmony. Every topic in Physics,
              Chemistry, Mathematics, and Biology is first taught with crystalline theoretical depth for the Odisha CHSE
              board syllabus, immediately followed by analytical problem-solving sets for entrance examinations.
            </p>
            
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F4C76B] shrink-0" />
                <span>Zero duplicate preparation stress</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F4C76B] shrink-0" />
                <span>Small batch size for direct mentoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>Accessible center in central Brahmapur</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>Ethical, transparent student guidance</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={onLearnMoreCourses}
                className="px-5 py-2.5 bg-gradient-to-r from-[#F4C76B] to-[#E5B555] hover:from-[#E5B555] hover:to-[#D4A344] text-[#0B0F19] rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md font-bold"
              >
                <span>View Program Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenConsultation}
                className="px-5 py-2.5 bg-[#172033] hover:bg-[#202B3D] text-[#F3F4F6] border border-[#344054] hover:border-[#F4C76B]/40 hover:text-[#F4C76B] rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-[#F4C76B]" />
                <span>Book Free Consultation</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl overflow-hidden border border-[#344054] shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
                alt="Students studying science and mathematics with focused guidance"
                className="w-full h-80 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/25 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-bold text-[#F4C76B] uppercase tracking-wider">
                  Center Commitment
                </p>
                <p className="text-sm font-medium text-[#F3F4F6] mt-0.5">
                  "Every student is capable of excellence when provided systematic conceptual clarity and steady personal encouragement."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Key Pillars Grid */}
        <div className="mb-4">
          <h3 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#F3F4F6] text-center mb-8">
            The Six Pillars of Academic Learning at Antariksh Academy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#202B3D] border border-[#344054] hover:border-[#F4C76B]/50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group flex flex-col text-left"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${pillar.color} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-['Outfit',sans-serif] text-lg font-bold text-[#F3F4F6] mb-2 group-hover:text-[#F4C76B] transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-[#AAB4C3] text-sm leading-relaxed flex-1">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
