import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  User,
  BookOpen,
  Calendar,
  LogOut,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';

export const StudentDashboardPage: React.FC = () => {
  const { student, logout, token } = useAuth();
  const [totalLectures, setTotalLectures] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;
      try {
        const [lecRes, subRes] = await Promise.all([
          fetch(`${API_BASE_URL}/lectures?limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/lectures/subjects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (lecRes.ok) {
          const lecData = await lecRes.json();
          if (lecData.success) {
            setTotalLectures(lecData.pagination?.totalRecords || 0);
          }
        }

        if (subRes.ok) {
          const subData = await subRes.json();
          if (subData.success) {
            setSubjects(subData.data || []);
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        setIsLoadingStats(false);
      }
    }

    fetchStats();
  }, [token]);

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#0B1120] py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#17365D] via-[#1B3F6E] to-[#17365D] dark:from-[#0E1626] dark:via-[#131E33] dark:to-[#0E1626] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-700/50 dark:border-slate-800 text-white mb-8 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#C6922E]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 dark:bg-slate-900/60 p-2 flex items-center justify-center border-2 border-[#F4C76B]/60 shadow-xl backdrop-blur-md shrink-0">
                <img
                  src="/logo_transparent.png"
                  alt="Antariksh Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F4C76B] text-[#0B1120]">
                    Batch {student?.batch || '2026'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Enrolled & Verified
                  </span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white">
                  Welcome back, {student?.name || 'Student'}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                  <span>Username: <strong className="text-amber-300 font-mono">{student?.username}</strong></span>
                  {student?.college && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-amber-300" />
                        {student.college}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    Bijipur Center, Brahmapur
                  </span>
                </p>
              </div>
            </div>

            {/* Logout CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/student/profile"
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] flex items-center justify-center shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Recorded Lectures
              </p>
              <p className="text-2xl font-black text-[#17365D] dark:text-white mt-0.5">
                {isLoadingStats ? '...' : totalLectures !== null ? `${totalLectures} Classes` : 'Available'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Active Subjects
              </p>
              <p className="text-2xl font-black text-[#17365D] dark:text-white mt-0.5">
                {isLoadingStats ? '...' : subjects.length > 0 ? `${subjects.length} Streams` : '4 Streams'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Batch Year
              </p>
              <p className="text-2xl font-black text-[#17365D] dark:text-white mt-0.5">
                {student?.batch || '2026'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Support Hours
              </p>
              <p className="text-2xl font-black text-[#17365D] dark:text-white mt-0.5">
                7 AM – 7:30 PM
              </p>
            </div>
          </div>
        </div>

        {/* Action Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Action: Go to Recorded Lectures */}
          <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#C6922E] dark:text-[#F4C76B]">
                  Batch {student?.batch} Digital Classroom
                </span>
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-[#17365D] dark:text-white">
                Recorded Class Sessions & Problem Solving
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Missed a live class due to college practicals or need to revise important concepts for your upcoming tests? Stream published video lectures for your batch across Physics, Chemistry, Mathematics, and Biology with high-definition YouTube playback.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Restricted to Batch {student?.batch} Enrolled Students</span>
              </div>
              <Link
                to="/student/lectures"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse All Batch Lectures</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Info / Center Notice */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-display font-black text-lg text-[#17365D] dark:text-white mb-2">
                Academy Academic Notice
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Weekly offline doubt-clearing sessions and OMR mock tests are held every Sunday between 8:00 AM and 1:00 PM at our Bijipur Center.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Center:</strong> Bijipur, Big Street, Brahmapur</p>
                <p><strong>Desk Phone:</strong> +91 90901 60793</p>
                <p><strong>Timing:</strong> Mon–Sat: 7:00 AM – 7:30 PM</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                to="/timetable"
                className="text-xs font-bold text-[#17365D] dark:text-[#F4C76B] hover:underline"
              >
                View Weekly Timetable →
              </Link>
              <Link
                to="/contact"
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                Contact Desk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
