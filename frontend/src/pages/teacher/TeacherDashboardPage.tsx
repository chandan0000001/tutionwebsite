import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Video,
  Layers,
  PlusCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { TeacherHeader } from '../../components/teacher/TeacherHeader';

interface BatchInfo {
  _id: string;
  name: string;
  code: string;
  academicYear: string;
  description?: string;
  studentCount: number;
  lectureCount: number;
}

export const TeacherDashboardPage: React.FC = () => {
  const { user, token } = useAuth();
  const [batches, setBatches] = useState<BatchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadBatches() {
      if (!token) return;
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(`${API_BASE_URL}/teacher/batches`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setBatches(data.data || []);
        } else {
          setErrorMessage(data.message || 'Failed to load assigned batches.');
        }
      } catch {
        setErrorMessage('Unable to connect to the institute server. Please check your network.');
      } finally {
        setIsLoading(false);
      }
    }

    loadBatches();
  }, [token]);

  const totalStudents = batches.reduce((acc, b) => acc + (b.studentCount || 0), 0);
  const totalLectures = batches.reduce((acc, b) => acc + (b.lectureCount || 0), 0);

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#070B14] pb-12 transition-colors duration-200">
      <TeacherHeader />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Welcome Banner */}
        <div className="bg-white dark:bg-gradient-to-r dark:from-[#0E1626] dark:via-[#142036] dark:to-[#0E1626] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm dark:shadow-xl border border-slate-200 dark:border-slate-800 mb-6 sm:mb-8 transition-colors duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-[#F4C76B] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B]" />
                <span>Faculty Administration</span>
              </div>
              <h1 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-slate-900 dark:text-white">
                Welcome back, {user?.name}!
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Manage assigned batches, student rosters, bulk imports, and recorded YouTube class lectures.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Link
                to="/teacher/students"
                className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Students</span>
              </Link>
              <Link
                to="/teacher/lectures"
                className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5 text-amber-600 dark:text-[#F4C76B]" />
                <span>Lectures</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <div>
              <p className="font-bold">Error loading dashboard</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Assigned Batches
              </p>
              <p className="text-2xl font-black text-[#17365D] dark:text-white mt-1">
                {isLoading ? '...' : batches.length}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Enrolled Students
              </p>
              <p className="text-2xl font-black text-[#17365D] dark:text-white mt-1">
                {isLoading ? '...' : totalStudents}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Class Lectures
              </p>
              <p className="text-2xl font-black text-[#17365D] dark:text-white mt-1">
                {isLoading ? '...' : totalLectures}
              </p>
            </div>
          </div>
        </div>

        {/* Assigned Batches Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-black text-xl text-[#17365D] dark:text-white">
              My Assigned Batches
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {batches.length} {batches.length === 1 ? 'batch' : 'batches'} allocated
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 mx-auto border-3 border-slate-200 border-t-[#C6922E] rounded-full animate-spin"></div>
              <p className="mt-3 text-xs text-slate-500">Loading batch allocations...</p>
            </div>
          ) : batches.length === 0 ? (
            <div className="p-10 text-center bg-white dark:bg-[#111827] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <Layers className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                No Batches Assigned Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Your teacher profile has not been linked to an active batch cohort. Please contact the Antariksh Academy Superadmin to assign batches to your account.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map((batch) => (
                <div
                  key={batch._id}
                  className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] border border-amber-500/20">
                        {batch.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Year {batch.academicYear}
                      </span>
                    </div>

                    <h3 className="font-display font-black text-lg text-[#17365D] dark:text-white">
                      {batch.name}
                    </h3>

                    {batch.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                        {batch.description}
                      </p>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1E293B]">
                        <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                          Students
                        </p>
                        <p className="font-mono text-base font-black text-[#17365D] dark:text-white">
                          {batch.studentCount}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1E293B]">
                        <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                          Lectures
                        </p>
                        <p className="font-mono text-base font-black text-[#17365D] dark:text-white">
                          {batch.lectureCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <Link
                      to={`/teacher/students?batch=${batch.code}`}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-[#17365D] dark:text-[#F4C76B] hover:bg-slate-100 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Students</span>
                    </Link>
                    <Link
                      to={`/teacher/lectures?batch=${batch.code}`}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#17365D] hover:bg-[#1E4273] dark:bg-[#C6922E] dark:hover:bg-[#D4A33B] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Lectures</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Capabilities Callout */}
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-[#C6922E] dark:text-[#F4C76B] shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">
                Teacher Access & Security Guidelines:
              </p>
              <p>
                • As a faculty member, you have administrative control strictly over students and recorded lectures belonging to your assigned batches.
              </p>
              <p>
                • Bulk enrollments can be initiated via Excel spreadsheets. Use the official downloadable template on the Students page.
              </p>
              <p>
                • Generated temporary passwords for new accounts must be shared securely with students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
