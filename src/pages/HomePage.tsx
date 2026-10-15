import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Trophy,
  Users,
  Sparkles,
  Phone,
  Send,
  Star,
} from 'lucide-react';
import { COURSES_DATA } from '../data/coursesData';
import { RESULTS_DATA } from '../data/resultsData';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';
import { submitEnquiryToGmail } from '../services/formSubmission';
import { sanitizeMobileInput, getMobileValidationError } from '../utils/validation';

export const HomePage: React.FC = () => {

  // Instant Callback Bar State
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickCourse, setQuickCourse] = useState('Integrated Board + Entrance');
  const [quickStatus, setQuickStatus] = useState<string | null>(null);
  const [isQuickSubmitting, setIsQuickSubmitting] = useState(false);

  const handleQuickCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) {
      setQuickStatus('Please enter student or parent name.');
      return;
    }
    const phoneErr = getMobileValidationError(quickPhone);
    if (phoneErr) {
      setQuickStatus(phoneErr);
      return;
    }

    setIsQuickSubmitting(true);
    setQuickStatus(null);

    await submitEnquiryToGmail({
      formType: 'Callback Request',
      fullName: quickName.trim(),
      mobileNumber: quickPhone.trim(),
      courseInterest: quickCourse,
      preferredTime: 'Immediate Callback Requested',
    });

    setIsQuickSubmitting(false);
    setQuickStatus('SUCCESS: Callback request dispatched! Our senior academic counselor will call you within 15 minutes.');
    setQuickName('');
    setQuickPhone('');
  };

  // Top 4 results for preview
  const topResults = RESULTS_DATA.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      
      {/* 1. EXECUTIVE BUSINESS HERO SECTION */}
      <section className="relative w-full py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-slate-50/80 to-pink-50/20 text-slate-900 overflow-hidden border-b border-slate-200">
        {/* Ambient Brand Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FC1682]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00C8FF]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-[#BE125A] shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-[#FC1682] animate-pulse"></span>
                <span>Admissions Active 2026–27</span>
                <span className="text-pink-300">|</span>
                <span className="text-slate-700 font-semibold">Bijipur, Brahmapur Center</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-['Outfit',sans-serif] text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#0F172A]">
                Empowering <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#0284C7]">
                  +2 Science & Entrance
                </span>{' '}
                <br />
                Aspirants to Excel.
              </h1>

              {/* Sub-text */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                Prepare for your Odisha CHSE Council Board examinations alongside national competitive entrance exams
                (JEE Main & Advanced, NEET-UG, NDA) with personal faculty attention, structured drills, and daily doubt clearing.
              </p>

              {/* Business Value Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
                  <span className="block text-xl sm:text-2xl font-extrabold text-[#FC1682] font-['Outfit',sans-serif]">99.4%ile</span>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Top JEE Score</span>
                </div>
                <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
                  <span className="block text-xl sm:text-2xl font-extrabold text-emerald-700 font-['Outfit',sans-serif]">678 / 720</span>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Top NEET Mark</span>
                </div>
                <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
                  <span className="block text-xl sm:text-2xl font-extrabold text-[#0284C7] font-['Outfit',sans-serif]">96.2%</span>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Top CHSE Board</span>
                </div>
                <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
                  <span className="block text-xl sm:text-2xl font-extrabold text-purple-700 font-['Outfit',sans-serif]">AIR 142</span>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">UPSC NDA Rank</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/courses"
                  className="px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#D9146C] hover:from-[#E00E70] shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-center"
                >
                  <span>Explore Courses & Fees</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/consultation"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-[#FC1682] shadow-sm transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Calendar className="w-4 h-4 text-[#FC1682]" />
                  <span>Book Free Consultation</span>
                </Link>
              </div>

              <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Small 30-student batches • 1-on-1 daily faculty doubt desk • Zero syllabus confusion</span>
              </p>
            </div>

            {/* Right Card / Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xl">
                
                {/* Classroom Image */}
                <div className="relative h-60 sm:h-64 rounded-2xl overflow-hidden mb-5 border border-slate-200 group">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
                    alt="Antariksh Academy Classroom Session"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 right-3 bg-[#FC1682] text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-md">
                    2026-27 Enrollment
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="bg-slate-900/90 backdrop-blur-md font-semibold px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-[#00C8FF]" />
                      Bijipur Big Street • Brahmapur
                    </span>
                    <span className="bg-pink-950/80 text-pink-200 font-bold px-2 py-0.5 rounded text-[11px] border border-pink-700">
                      Ganjam, Odisha
                    </span>
                  </div>
                </div>

                {/* 4 Feature Badges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                      Academic Pillars
                    </span>
                    <span className="text-[11px] font-extrabold text-[#FC1682] bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-md">
                      Excellence Standard
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-500 font-medium">Odisha CHSE +2</span>
                      <span className="text-xs font-bold text-slate-900 mt-0.5">Dual-Track Syllabus</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-500 font-medium">Daily Doubts</span>
                      <span className="text-xs font-bold text-slate-900 mt-0.5">1-on-1 Faculty Desks</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-500 font-medium">Assessments</span>
                      <span className="text-xs font-bold text-slate-900 mt-0.5">OMR & Subjective Drills</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex flex-col">
                      <span className="text-[11px] text-slate-500 font-medium">Batch Ratio</span>
                      <span className="text-xs font-bold text-slate-900 mt-0.5">Max 30 Students</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/faculty"
                      className="w-full py-2 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#FC1682] font-bold text-xs flex items-center justify-between transition-colors"
                    >
                      <span>Meet Our 7 Subject Mentors</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FAST 15-MINUTE CALLBACK CAPTURE BAR */}
      <section className="bg-white border-b border-slate-200 py-6 sm:py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={(e) => { e.preventDefault(); void handleQuickCallback(e); }} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 text-left w-full lg:w-auto">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-[#FC1682] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Outfit',sans-serif] text-sm sm:text-base font-bold text-slate-900">
                  Request an Instant Admissions Callback
                </h3>
                <p className="text-xs text-slate-500">
                  Speak directly with our senior counselor within 15 minutes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Student / Parent Name"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FC1682]"
              />
              <div className="relative">
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="10-Digit Mobile No."
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(sanitizeMobileInput(e.target.value))}
                  maxLength={10}
                  className="w-full px-3.5 pr-14 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FC1682] font-mono tracking-wider"
                />
                <span className="absolute right-2.5 top-2.5 text-[10px] font-semibold text-slate-400 pointer-events-none">
                  {quickPhone.length}/10
                </span>
              </div>
              <select
                value={quickCourse}
                onChange={(e) => setQuickCourse(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FC1682]"
              >
                <option value="Integrated Board + Entrance">Integrated +2 & Entrance</option>
                <option value="JEE Main & Advanced">JEE Main & Advanced</option>
                <option value="NEET-UG Medical">NEET-UG Medical</option>
                <option value="+2 Science Board">+2 Science Board (CHSE)</option>
                <option value="NDA Defense Prep">NDA Defense Prep</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isQuickSubmitting}
              className="w-full lg:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FC1682] to-[#D9146C] hover:from-[#E00E70] shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
            >
              {isQuickSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Call Me</span>
                </>
              )}
            </button>
          </form>

          {quickStatus && (
            <div className={`mt-3 p-3 rounded-xl text-xs text-center font-semibold flex items-center justify-center gap-2 ${
              quickStatus.startsWith('SUCCESS')
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {quickStatus.startsWith('SUCCESS') ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Phone className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{quickStatus}</span>
            </div>
          )}
        </div>
      </section>

      {/* 3. TARGETED ACADEMIC STREAMS (4 CARDS) */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#BE125A] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#FC1682]" />
              <span>Structured Academic Streams</span>
            </div>
            <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
              Programs Tailored for Every Academic Ambition
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Whether your goal is securing an IIT seat, a government medical college, defense commissioning, or 95%+ in CHSE Council boards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES_DATA.slice(0, 4).map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group hover:border-[#FC1682]/60"
              >
                <div>
                  {/* Badge & Target Student Stream */}
                  <div className="mb-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-pink-50 text-[#BE125A] border border-pink-200 uppercase tracking-wider">
                        {course.badge}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#0284C7] bg-cyan-50/70 border border-cyan-200/80 px-2 py-0.5 rounded-md inline-block">
                      {course.targetStudents}
                    </p>
                  </div>

                  <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-slate-900 group-hover:text-[#FC1682] transition-colors mb-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {course.shortDescription}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 pt-3 mb-4">
                    {course.keyBenefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">{course.batchType}</span>
                  <Link
                    to="/courses"
                    className="text-xs font-bold text-[#FC1682] group-hover:underline flex items-center gap-1"
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-[#FC1682] shadow-xs transition-colors"
            >
              <span>View All 5 Courses & Syllabi</span>
              <ArrowRight className="w-4 h-4 text-[#FC1682]" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. RESULTS & HONORS WALL PREVIEW */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#BE125A] text-xs font-bold uppercase tracking-wider mb-2">
                <Trophy className="w-3.5 h-3.5 text-[#FC1682]" />
                <span>10 Years of Proven Success (2017–2026)</span>
              </div>
              <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Every Success Has a Story.
              </h2>
            </div>

            <Link
              to="/results"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FC1682] hover:underline shrink-0"
            >
              <span>View All 50+ Student Records (2017–2026)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topResults.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group hover:border-[#FC1682]/60"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        Session {item.year}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-50 text-[#BE125A] border border-pink-200">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-[#FC1682]/40 shrink-0">
                      <img src={item.photoUrl} alt={item.studentName} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-slate-900 truncate">
                        {item.studentName}
                      </h4>
                      <div className="text-xs font-extrabold text-[#FC1682]">
                        {item.scoreOrRank}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {item.allotmentOrCollege}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic bg-pink-50/50 border-l-2 border-[#FC1682] pl-2.5 py-1.5 rounded-r-lg line-clamp-2">
                    "{item.storyQuote}"
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium line-clamp-1">{item.achievementSummary}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ACADEMY LEADERSHIP & FACULTY PREVIEW */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-r from-pink-50 via-white to-cyan-50 border-2 border-pink-200 rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full max-w-sm lg:w-80 h-64 rounded-2xl overflow-hidden shrink-0 border-2 border-[#FC1682] shadow-md relative">
              <img
                src="/images/academy_faculty_fb.jpg"
                alt="Antariksh Academy Faculty Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-md px-2 py-1 rounded text-[11px] font-bold text-pink-300 text-center">
                Antariksh Berhampur Faculty Panel
              </div>
            </div>

            <div className="space-y-4 text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FC1682]/15 text-[#BE125A] text-xs font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#FC1682]" />
                <span>Dedicated Classroom Mentors</span>
              </div>
              <h2 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug">
                Teaching is Personal at Antariksh Academy
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                Unlike mass commercial factories where students are lost in crowds of hundreds, our 7 dedicated faculty members
                conduct interactive lectures, assign targeted question banks, and maintain daily evening desks for one-on-one doubt clarification.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/faculty"
                  className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#FC1682] to-[#D9146C] hover:from-[#E00E70] shadow-md shadow-pink-500/20 transition-all"
                >
                  Meet All 7 Faculty Mentors
                </Link>
                <Link
                  to="/timetable"
                  className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 transition-colors"
                >
                  View Weekly Class Schedules
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS HIGHLIGHT STRIP */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#BE125A] bg-pink-50 border border-pink-200 px-3 py-1 rounded-full">
              Voices of Trust
            </span>
            <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-3 mb-2">
              What Students & Parents in Brahmapur Say
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Real reflections on our disciplined atmosphere, mentor accessibility, and balanced preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {TESTIMONIALS_DATA.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-50 text-[#0284C7] border border-cyan-200">
                      {item.authorType} Voice
                    </span>
                  </div>

                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic mb-4">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-[#FC1682]/40 shrink-0">
                    <img src={item.avatarUrl} alt={item.displayName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.displayName}</span>
                    <span className="text-[11px] text-[#FC1682] font-semibold block">{item.subTitle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. HIGH CONVERSION BOTTOM LEAD CAPTURE */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FC1682]/20 text-pink-300 text-xs font-bold uppercase tracking-wider border border-pink-500/30">
            <Calendar className="w-3.5 h-3.5 text-[#FC1682]" />
            <span>Admissions Guidance Desk</span>
          </div>

          <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Accelerate Your Academic Journey?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Schedule a 30-minute one-on-one consultation with our faculty or visit our Bijipur campus today.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/consultation"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FC1682] via-[#E11D74] to-[#D9146C] hover:from-[#E00E70] shadow-lg shadow-pink-500/25 transition-all text-center"
            >
              Book a Free Consultation
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-center"
            >
              Visit Bijipur Campus
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
export default HomePage;
