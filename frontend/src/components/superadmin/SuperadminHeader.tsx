import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  Users,
  Video,
  FileText,
  User,
  KeyRound,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SuperadminHeader: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/superadmin/dashboard', icon: LayoutDashboard },
    { label: 'Batches', path: '/superadmin/batches', icon: Layers },
    { label: 'Faculty / Teachers', path: '/superadmin/teachers', icon: GraduationCap },
    { label: 'Students', path: '/superadmin/students', icon: Users },
    { label: 'Lectures', path: '/superadmin/lectures', icon: Video },
    { label: 'Audit Logs', path: '/superadmin/audit-logs', icon: FileText },
    { label: 'Profile', path: '/superadmin/profile', icon: User },
    { label: 'Change Password', path: '/superadmin/change-password', icon: KeyRound },
  ];

  return (
    <div className="bg-[#0B1120] dark:bg-[#070B14] border-b border-slate-800 text-white transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Bar */}
        <div className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/40 p-1.5 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#F4C76B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg tracking-tight text-white">
                  Antariksh Academy Master Console
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Superadmin Root
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <strong className="text-slate-200">{user?.name || 'Administrator'}</strong>{' '}
                (<span className="font-mono text-amber-300">@{user?.username}</span>) • Full Institute Authority
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              Public Website
            </Link>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-[#F4C76B] font-extrabold border border-amber-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SuperadminHeader;
