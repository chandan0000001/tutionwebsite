import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentProfilePage: React.FC = () => {
  const { student } = useAuth();

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#0B1120] py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#17365D] dark:text-slate-400 dark:hover:text-[#F4C76B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <Link
            to="/student/change-password"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#17365D] bg-white hover:bg-slate-50 dark:text-slate-200 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Update Password</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#17365D] via-[#1E4273] to-[#17365D] dark:from-[#0E1626] dark:via-[#141F33] dark:to-[#0E1626] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 dark:bg-slate-900/60 p-2 flex items-center justify-center border-2 border-[#F4C76B] shadow-lg shrink-0">
                <img
                  src="/logo_transparent.png"
                  alt="Antariksh Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F4C76B] text-[#0B1120]">
                    Batch {student?.batch}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Active Enrolled
                  </span>
                </div>
                <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
                  {student?.name}
                </h1>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Portal Username: {student?.username}
                </p>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-[#C6922E] dark:text-[#F4C76B] mb-4">
                Academic & Batch Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" /> Academic Batch
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Class 12 / +2 Batch {student?.batch}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Building className="w-3.5 h-3.5 text-blue-500" /> College / Institution
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {student?.college || 'Registered Junior College'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Academy Study Center
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Bijipur Center, Brahmapur (760001)
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#C6922E] dark:text-[#F4C76B] mb-4">
                Contact & Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5 text-sky-500" /> Registered Mobile Phone
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                    {student?.phone}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5 text-purple-500" /> Email Address
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {student?.email || 'Not provided'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Date of Birth
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {student?.dateOfBirth}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Users className="w-3.5 h-3.5 text-rose-500" /> Parents / Guardians
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {student?.fatherName ? `Father: ${student.fatherName}` : ''}
                    {student?.fatherName && student?.motherName ? ' • ' : ''}
                    {student?.motherName ? `Mother: ${student.motherName}` : ''}
                  </p>
                </div>
              </div>
            </div>

            {student?.address && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#C6922E] dark:text-[#F4C76B] mb-2">
                  Permanent Address
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {student.address.street ? `${student.address.street}, ` : ''}
                  {student.address.city || 'Brahmapur'}, {student.address.state || 'Odisha'} (PIN: {student.address.postalCode || '760001'}), {student.address.country || 'India'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
