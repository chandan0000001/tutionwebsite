import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  GraduationCap,
  Users,
  Video,
  FileText,
  ArrowRight,
  PlusCircle,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';
import { SuperadminHeader } from '../../components/superadmin/SuperadminHeader';

interface DashboardStats {
  counts: {
    students: { total: number; active: number; inactive: number };
    teachers: { total: number; active: number };
    batches: { total: number; active: number };
    lectures: { total: number; published: number };
  };
  recentActivity: Array<{
    _id: string;
    action: string;
    actorUsername: string;
    actorRole: string;
    targetType: string;
    createdAt: string;
    details?: Record<string, unknown>;
  }>;
  recentStudents: Array<{
    _id: string;
    name: string;
    username: string;
    batchCode: string;
    phone: string;
    createdAt: string;
  }>;
}

export const SuperadminDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      if (!token) return;
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/superadmin/dashboard?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setStats(data.data);
        } else {
          setErrorMessage(data.message || 'Failed to load institute statistics.');
        }
      } catch {
        setErrorMessage('Unable to connect to the backend server.');
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, [token]);

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#070B14] pb-12 transition-colors duration-200">
      <SuperadminHeader />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Banner */}
        <div className="bg-white dark:bg-gradient-to-r dark:from-[#0B1120] dark:via-[#131D33] dark:to-[#0B1120] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm dark:shadow-2xl border border-slate-200 dark:border-slate-800 mb-6 sm:mb-8 transition-colors duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-[#F4C76B] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-[#C6922E] dark:text-[#F4C76B]" />
                <span>Command Center</span>
              </div>
              <h1 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-slate-900 dark:text-white">
                Superadmin Overview
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Institute operations, active cohorts, faculty assignments, and enrollment metrics.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Link
                to="/superadmin/batches"
                className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>Batches</span>
              </Link>
              <Link
                to="/superadmin/teachers"
                className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl text-xs font-bold text-slate-700 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                <span>Teachers</span>
              </Link>
              <Link
                to="/superadmin/students"
                className="w-full sm:w-auto py-2 px-3.5 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Enroll Student</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Error loading overview</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 4 Primary KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <Link
            to="/superadmin/batches"
            className="bg-white dark:bg-[#0E1524] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Batches
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {isLoading ? '...' : stats?.counts.batches.total || 0}
            </p>
            <p className="text-[11px] text-emerald-500 font-bold mt-1">
              {stats?.counts.batches.active || 0} Active Cohorts
            </p>
          </Link>

          <Link
            to="/superadmin/teachers"
            className="bg-white dark:bg-[#0E1524] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Faculty Members
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {isLoading ? '...' : stats?.counts.teachers.total || 0}
            </p>
            <p className="text-[11px] text-emerald-500 font-bold mt-1">
              {stats?.counts.teachers.active || 0} Active Profiles
            </p>
          </Link>

          <Link
            to="/superadmin/students"
            className="bg-white dark:bg-[#0E1524] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Enrolled Students
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {isLoading ? '...' : stats?.counts.students.total || 0}
            </p>
            <p className="text-[11px] text-emerald-500 font-bold mt-1">
              {stats?.counts.students.active || 0} Active Accounts
            </p>
          </Link>

          <Link
            to="/superadmin/lectures"
            className="bg-white dark:bg-[#0E1524] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recorded Lectures
            </p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {isLoading ? '...' : stats?.counts.lectures.total || 0}
            </p>
            <p className="text-[11px] text-emerald-500 font-bold mt-1">
              {stats?.counts.lectures.published || 0} Published
            </p>
          </Link>
        </div>

        {/* Two Column Grid: Recent Audit Activity & Recent Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Administrative Audit Feed */}
          <div className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                <h2 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  Recent Audit Activity
                </h2>
              </div>
              <Link
                to="/superadmin/audit-logs"
                className="text-xs font-bold text-[#17365D] dark:text-[#F4C76B] hover:underline"
              >
                View Full Audit Trail →
              </Link>
            </div>

            {isLoading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading audit activity...</p>
            ) : !stats?.recentActivity || stats.recentActivity.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No recent activity recorded.</p>
            ) : (
              <div className="space-y-2.5">
                {stats.recentActivity.slice(0, 6).map((log) => (
                  <div
                    key={log._id}
                    className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-[#151F33] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 shrink-0">
                        {log.action}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 truncate">
                        by <strong className="font-mono text-slate-900 dark:text-white">@{log.actorUsername}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Enrolled Students */}
          <div className="bg-white dark:bg-[#0E1524] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                <h2 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  Recently Enrolled Students
                </h2>
              </div>
              <Link
                to="/superadmin/students"
                className="text-xs font-bold text-[#17365D] dark:text-[#F4C76B] hover:underline"
              >
                View All Students →
              </Link>
            </div>

            {isLoading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading students...</p>
            ) : !stats?.recentStudents || stats.recentStudents.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No students registered yet.</p>
            ) : (
              <div className="space-y-2.5">
                {stats.recentStudents.map((st) => (
                  <div
                    key={st._id}
                    className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-[#151F33] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-1">
                      <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">{st.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">@{st.username}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] border border-amber-500/20 whitespace-nowrap shrink-0">
                      {st.batchCode}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminDashboardPage;
