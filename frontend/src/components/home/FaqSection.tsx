import React, { useState, memo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How does Antariksh Academy balance CHSE Odisha Board syllabus with JEE / NEET preparation?',
    a: 'We utilize a synchronized dual-track pedagogy. Fundamental concepts are taught first for council board theory (subjective answers and derivations), followed immediately by objective shortcut techniques, numerical drills, and negative-marking control for JEE and NEET. This prevents syllabus duplication and eliminates student burnout.',
  },
  {
    q: 'Why is the batch size strictly capped at 30 students?',
    a: 'In crowded coaching centers with 80–150 students, average and hesitant students get left behind. By capping each batch at 30 students, our faculty knows every student personally, identifies conceptual weak spots early, and provides individualized guidance.',
  },
  {
    q: 'What happens if a student has difficulty understanding a specific topic?',
    a: 'We provide dedicated 1-on-1 daily evening doubt desks with our subject mentors. Students can sit with faculty without hesitation until their doubts are 100% resolved. We also offer special concept recap sessions before major weekly tests.',
  },
  {
    q: 'Can parents monitor attendance, test marks, and academic progress?',
    a: 'Yes. Attendance is tracked every session, and weekly test scorecards (OMR analytics + subjective CHSE marks) are shared directly with parents. Periodic Parent-Teacher Mentorship Meetings are conducted to review performance and career roadmaps.',
  },
  {
    q: 'Are fee installment options and merit scholarships available?',
    a: 'Yes. We provide flexible installment payment plans to support parents. Furthermore, students scoring above 85% in their 10th board examinations or performing well in our Antariksh Talent Assessment Test are eligible for merit-based fee concessions.',
  },
];

export const FaqSection: React.FC = memo(() => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-12 sm:py-20 bg-[#F1F5F9] dark:bg-[#111827] border-b border-slate-200 dark:border-[#243042]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8 sm:mb-10">
          <span className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#854D0E] dark:text-[#F4C76B] bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] px-3.5 py-1 rounded-full shadow-xs">
            Frequently Asked Questions
          </span>
          <h2 className="font-display text-xl sm:text-3xl font-extrabold text-[#172033] dark:text-[#F3F4F6] tracking-tight mt-3">
            Answers for Prospective Students & Parents
          </h2>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#202B3D] border border-slate-200 dark:border-[#344054] rounded-xl sm:rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full py-3.5 sm:py-4 px-4 sm:px-6 text-left flex items-center justify-between gap-3 font-display font-bold text-xs sm:text-base text-slate-900 hover:text-[#17365D] dark:text-[#F3F4F6] dark:hover:text-[#F4C76B] transition-colors cursor-pointer min-h-[48px]"
                >
                  <span className="leading-snug">{faq.q}</span>
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#344054] flex items-center justify-center shrink-0 text-slate-500 dark:text-[#AAB4C3]">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-4 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-[#AAB4C3] leading-relaxed border-t border-slate-100 dark:border-[#344054]/60"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
});

FaqSection.displayName = 'FaqSection';
