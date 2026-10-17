import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  KeyRound,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SuperadminHeader } from '../../components/superadmin/SuperadminHeader';

export const SuperadminProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#070B14] pb-12 transition-colors duration-200">
      <SuperadminHeader />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white dark:bg-[#0E1524] rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-900 to-[#17365D] text-[#F4C76B] flex items-center justify-center font-black text-2xl shadow-lg border-2 border-[#F4C76B]/40 shrink-0">
                <ShieldCheck className="w-10 h-10 text-[#F4C76B]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Institute Root Superadmin
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Full System Access
                  </span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
                  {user?.name}
                </h1>
                <p className="font-mono text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  @{user?.username}
                </p>
              </div>
            </div>

            <Link
              to="/superadmin/change-password"
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-2 transition-colors"
            >
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>Change Password</span>
            </Link>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151F33] border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  Institute Center
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  Antariksh Academy, Bijipur, Brahmapur
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151F33] border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  Admin Mobile Phone
                </p>
                <p className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {user?.phone || '+91 90901 60793'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151F33] border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  Administrative Email
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {user?.email || 'admin@antariksh.edu.in'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151F33] border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                  Account Status
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  Permanent Superadmin Root
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminProfilePage;
