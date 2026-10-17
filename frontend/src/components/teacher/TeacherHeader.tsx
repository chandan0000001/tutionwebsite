import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Video,
  User,
  KeyRound,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TeacherHeader: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'Students', path: '/teacher/students', icon: Users },
    { label: 'Recorded Lectures', path: '/teacher/lectures', icon: Video },
    { label: 'My Profile', path: '/teacher/profile', icon: User },
    { label: 'Change Password', path: '/teacher/change-password', icon: KeyRound },
  ];

  return (
    <div className="bg-[#17365D] dark:bg-[#0E1626] border-b border-slate-700/60 dark:border-slate-800 text-white transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Bar */}
        <div className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 dark:bg-slate-800/80 p-1.5 flex items-center justify-center border border-[#F4C76B]/40 shrink-0">
              <BookOpen className="w-6 h-6 text-[#F4C76B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg tracking-tight text-white">
                  Teacher Administration Desk
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F4C76B] text-[#0B1120]">
                  Faculty Portal
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Logged in as <strong className="text-white">{user?.name || 'Faculty Member'}</strong>{' '}
                (<span className="font-mono text-amber-300">@{user?.username}</span>)
                {user?.assignedBatches && user.assignedBatches.length > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-amber-200">
                    • Assigned:{' '}
                    <span className="font-semibold">{user.assignedBatches.join(', ')}</span>
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
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
                      ? 'bg-white/20 text-[#F4C76B] shadow-inner font-extrabold border border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
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

export default TeacherHeader;
