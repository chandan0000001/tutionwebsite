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
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'Students', path: '/teacher/students', icon: Users },
    { label: 'Recorded Lectures', path: '/teacher/lectures', icon: Video },
    { label: 'My Profile', path: '/teacher/profile', icon: User },
    { label: 'Change Password', path: '/teacher/change-password', icon: KeyRound },
  ];

  return (
    <div className="bg-white dark:bg-[#070B14] border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Bar */}
        <div className="py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 p-1.5 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[#C6922E] dark:text-[#F4C76B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  Teacher Administration Desk
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                  Faculty
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span>
                  <strong className="text-slate-700 dark:text-slate-200">{user?.name || 'Faculty Member'}</strong>{' '}
                  <span className="font-mono text-amber-700 dark:text-amber-300">(@{user?.username})</span>
                </span>
                {user?.assignedBatches && user.assignedBatches.length > 0 && (
                  <span className="px-2 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {user.assignedBatches.length} Batches
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              to="/"
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Public Website
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/30 border border-rose-200 dark:border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-[#F4C76B] font-extrabold border border-amber-500/30 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
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
