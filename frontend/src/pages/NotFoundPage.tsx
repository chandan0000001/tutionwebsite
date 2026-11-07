import { Link } from 'react-router-dom';
import { Home, BookOpen, Calendar, PhoneCall, Compass, GraduationCap, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { MagneticButton } from '../components/common/MagneticButton';

export function NotFoundPage() {
  const quickLinks = [
    {
      title: 'Academic Programs',
      description: '+2 Science CHSE, JEE Main/Adv, NEET-UG, OUAT & ICAR',
      icon: BookOpen,
      to: '/courses',
      badge: 'Admissions 2026-27',
    },
    {
      title: 'Class Routine & Timetable',
      description: 'Daily batch timings, doubt desk hours & lab schedules',
      icon: Calendar,
      to: '/timetable',
      badge: 'Weekly Roster',
    },
    {
      title: '1-on-1 Consultation',
      description: 'Schedule a direct academic consultation with our senior faculty',
      icon: PhoneCall,
      to: '/consultation',
      badge: 'Free Slot',
    },
    {
      title: 'Student & Faculty Portal',
      description: 'Sign in to access recorded video lectures and batch materials',
      icon: GraduationCap,
      to: '/student/login',
      badge: 'Portal Access',
    },
  ];

  return (
    <div className="min-h-[85vh] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
      <SEO
        title="404 — Celestial Coordinate Not Found"
        description="The page you requested could not be found on Antariksh Academy. Return to our home page or explore our academic courses and schedules."
      />

      {/* Top Coordinate Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#17365D]/10 dark:bg-[#F4C76B]/15 text-[#17365D] dark:text-[#F4C76B] text-xs font-mono font-bold uppercase tracking-wider mb-6 border border-[#17365D]/20 dark:border-[#F4C76B]/30">
        <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
        <span>Error 404 • Coordinate Uncharted</span>
      </div>

      {/* Large Glowing 404 Display */}
      <div className="relative mb-6">
        <h1 className="text-8xl sm:text-9xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#17365D] via-[#2A4D7C] to-[#C65D1E] dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#C65D1E] drop-shadow-sm select-none">
          404
        </h1>
        <div className="absolute -inset-4 bg-gradient-to-r from-[#17365D]/5 via-[#C65D1E]/10 to-[#F4C76B]/5 blur-2xl -z-10 rounded-full" />
      </div>

      {/* Core Message */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#FFEDD7] font-display mb-3 max-w-xl">
        Lost in the Academic Cosmos?
      </h2>
      <p className="text-sm sm:text-base text-slate-600 dark:text-[#CBB5A1] max-w-lg mb-8 leading-relaxed">
        The celestial coordinate, lecture link, or document you were navigating to has either been relocated, renamed, or does not exist.
      </p>

      {/* Primary Action Button */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-14 w-full sm:w-auto">
        <Link to="/" className="w-full sm:w-auto">
          <MagneticButton
            as="div"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#17365D] to-[#102A43] dark:from-[#F4C76B] dark:to-[#E5B555] dark:text-[#0F172A] shadow-lg shadow-[#17365D]/20 hover:brightness-105 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Institute Home</span>
          </MagneticButton>
        </Link>
        <Link to="/contact" className="w-full sm:w-auto">
          <div className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-[#E8D7C3] bg-white dark:bg-[#1E1915] border border-slate-200 dark:border-[#382E25] hover:bg-slate-50 dark:hover:bg-[#28211B] transition-colors flex items-center justify-center gap-2">
            <span>Contact Admissions Office</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
        </Link>
      </div>

      {/* Quick Navigation Cards Grid */}
      <div className="w-full text-left">
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
            Popular Navigation Corridors
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Antariksh Academy Bijipur</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group relative p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-[#16120E]/80 backdrop-blur-md border border-slate-200/80 dark:border-[#2C241D] hover:border-[#17365D]/40 dark:hover:border-[#F4C76B]/40 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#17365D]/10 dark:bg-[#F4C76B]/15 text-[#17365D] dark:text-[#F4C76B] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-[#FFEDD7] group-hover:text-[#17365D] dark:group-hover:text-[#F4C76B] transition-colors truncate">
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#241D17] text-slate-600 dark:text-slate-400 shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#A89685] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Immediate Assistance Strip */}
      <div className="mt-12 pt-6 border-t border-slate-200 dark:border-[#2C241D] w-full text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>Need urgent academic support or admissions guidance?</span>
        <a
          href="tel:+919090160793"
          className="font-bold text-[#17365D] dark:text-[#F4C76B] hover:underline flex items-center gap-1.5"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call Desk: +91 90901 60793</span>
        </a>
      </div>
    </div>
  );
}

export default NotFoundPage;
