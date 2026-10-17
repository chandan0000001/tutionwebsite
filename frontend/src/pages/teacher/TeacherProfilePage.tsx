import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Layers,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TeacherHeader } from '../../components/teacher/TeacherHeader';

export const TeacherProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#0B1120] pb-12 transition-colors duration-200">
      <TeacherHeader />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#17365D] to-[#244b7d] text-[#F4C76B] flex items-center justify-center font-black text-2xl shadow-lg border-2 border-[#F4C76B]/40 shrink-0">
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'FC'}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F4C76B] text-[#0B1120]">
                    Faculty Member
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Active Staff Account
                  </span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-[#17365D] dark:text-white">
                  {user?.name}
                </h1>
                <p className="font-mono text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  @{user?.username}
                </p>
              </div>
            </div>

            <Link
              to="/teacher/change-password"
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-[#17365D] dark:text-[#F4C76B] hover:bg-slate-100 dark:hover:bg-[#1E293B] border border-slate-300 dark:border-slate-700 flex items-center gap-2 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </Link>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  Academic Qualification
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {user?.qualification || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  Date of Birth
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {user?.dateOfBirth || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  Contact Mobile Phone
                </p>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {user?.phone || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  Email Address
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate max-w-[220px]">
                  {user?.email || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Batches */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-display font-black text-base text-[#17365D] dark:text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C6922E]" />
              <span>Assigned Batches & Permissions</span>
            </h3>

            {user?.assignedBatches && user.assignedBatches.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.assignedBatches.map((batchCode) => (
                  <span
                    key={batchCode}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] border border-amber-500/20"
                  >
                    {batchCode} Cohort
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active batches assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
