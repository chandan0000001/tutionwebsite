import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  User,
  BookOpen,
  Calendar,
  LogOut,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const StudentDashboardPage: React.FC = () => {
  const { student, logout, token } = useAuth();
  const [totalLectures, setTotalLectures] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

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
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#070B14] py-6 sm:py-10 transition-colors duration-200">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-white dark:bg-gradient-to-r dark:from-[#0E1626] dark:via-[#131E33] dark:to-[#0E1626] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 mb-6 sm:mb-8 relative overflow-hidden transition-colors duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5 sm:gap-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 dark:bg-slate-900/60 p-2 flex items-center justify-center border border-amber-500/30 shrink-0">
                <img
                  src="/logo_transparent.png"
                  alt="Antariksh Logo"
                  width="64"
                  height="64"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-500/10 dark:bg-[#F4C76B] text-amber-900 dark:text-[#0B1120] border border-amber-500/20">
                    Batch {student?.batch || '2026'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Enrolled
                  </span>
                </div>
                <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl tracking-tight text-slate-900 dark:text-white">
                  Welcome, {student?.name || 'Student'}!
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>Username: <strong className="text-amber-700 dark:text-amber-300 font-mono">@{student?.username}</strong></span>
                  {student?.college && (
                    <>
                      <span>•</span>
                      <span className="truncate max-w-[150px] sm:max-w-none">{student.college}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Profile & Logout Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Link
                to="/student/profile"
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-slate-200 dark:border-white/20 transition-all flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-600/20 dark:hover:bg-rose-600/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <LoadingSpinner size="xs" color="current" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid (2x2 on Mobile, 4-Cols on Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link
            to="/student/lectures"
            className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/40 transition-all flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 dark:text-[#F4C76B] flex items-center justify-center mb-2">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Lectures
              </p>
              <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {isLoadingStats ? '...' : totalLectures !== null ? `${totalLectures} Classes` : 'Available'}
              </p>
            </div>
          </Link>

          <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Subjects
              </p>
              <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {isLoadingStats ? '...' : subjects.length > 0 ? `${subjects.length} Streams` : 'All Core'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Batch
              </p>
              <p className="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-0.5 truncate">
                {student?.batch || '2026'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Support Desk
              </p>
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-0.5">
                7 AM – 7:30 PM
              </p>
            </div>
          </div>
        </div>

        {/* Action Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {/* Main Action: Go to Recorded Lectures */}
          <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-900 dark:text-[#F4C76B] text-[10px] font-extrabold uppercase tracking-widest mb-2 border border-amber-500/20">
                <Sparkles className="w-3 h-3 text-[#C6922E] dark:text-[#F4C76B]" />
                <span>Classroom Portal</span>
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                Recorded Class Sessions & Problem Solving
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                Stream published video lectures for your batch across Physics, Chemistry, Mathematics, and Biology with high-definition YouTube playback.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Restricted to Batch {student?.batch} Students</span>
              </div>
              <Link
                to="/student/lectures"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse All Lectures</span>
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
