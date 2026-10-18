import React, { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, LogOut } from 'lucide-react';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  allowPasswordChangeOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  allowPasswordChangeOnly = false,
}) => {
  const { isAuthenticated, isLoading, user, role, logout } = useAuth();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#F8FAFC] dark:bg-[#111827]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-[#C6922E] dark:border-t-[#F4C76B] animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">
          Verifying Session & Permissions...
        </p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/student/login" state={{ from: location }} replace />;
  }

  // Determine correct change password path by role
  const changePasswordPath =
    user.role === 'superadmin'
      ? '/superadmin/change-password'
      : user.role === 'teacher'
      ? '/teacher/change-password'
      : '/student/change-password';

  // Determine default dashboard path by role
  const dashboardPath =
    user.role === 'superadmin'
      ? '/superadmin/dashboard'
      : user.role === 'teacher'
      ? '/teacher/dashboard'
      : '/student/dashboard';

  // If user must change initial temporary password and is not already on the change password page
  if (user.mustChangePassword && !allowPasswordChangeOnly) {
    return <Navigate to={changePasswordPath} replace />;
  }

  // Role validation
  if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC] dark:bg-[#0B1120]">
        <div className="max-w-md w-full bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white">
            Access Unauthorized
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Your current account role is <span className="font-bold uppercase text-amber-600 dark:text-amber-400">{role}</span>, which does not have permission to view this section.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              to={dashboardPath}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#17365D] hover:bg-[#1E4273] dark:bg-[#C6922E] dark:hover:bg-[#D4A33B] transition-colors flex items-center justify-center gap-2"
            >
              <span>Go to My {role === 'superadmin' ? 'Superadmin Console' : role === 'teacher' ? 'Teacher Desk' : 'Student Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <LoadingSpinner size="xs" color="current" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Log Out & Sign In with Different Account</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

