import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, User, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoadingButton } from '../../components/common/LoadingButton';
import { NotificationBanner } from '../../components/common/NotificationBanner';

export const StudentLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect appropriately based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.mustChangePassword) {
        const changePasswordPath =
          user.role === 'superadmin'
            ? '/superadmin/change-password'
            : user.role === 'teacher'
            ? '/teacher/change-password'
            : '/student/change-password';
        navigate(changePasswordPath, { replace: true });
      } else {
        const defaultDestination =
          user.role === 'superadmin'
            ? '/superadmin/dashboard'
            : user.role === 'teacher'
            ? '/teacher/dashboard'
            : '/student/dashboard';
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
        navigate(from || defaultDestination, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both your username and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await login(username.trim(), password);
      if (!result.success) {
        setErrorMessage(result.message || 'Login failed. Please verify your credentials.');
      }
    } catch {
      setErrorMessage('A network error occurred during authentication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors duration-200">
      <div className="w-full max-w-md">
        {/* Header / Brand Badge */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 text-xs font-bold text-slate-500 hover:text-[#17365D] dark:text-slate-400 dark:hover:text-[#F4C76B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Antariksh Academy Home</span>
          </Link>

          <div className="w-16 h-16 mx-auto rounded-full bg-white dark:bg-[#1E293B] p-2 flex items-center justify-center border-2 border-[#C6922E] dark:border-[#F4C76B] shadow-xl shadow-amber-500/10 mb-4">
            <img
              src="/logo_transparent.png"
              alt="Antariksh Academy"
              width="64"
              height="64"
              decoding="async"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#17365D] dark:text-white tracking-tight">
            Antariksh Academy <span className="gold-gradient-text">Portal Login</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Enter your credentials to access your portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-6">
              <NotificationBanner
                type="error"
                message={errorMessage}
                onClose={() => setErrorMessage(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  disabled={isSubmitting}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B] transition-colors disabled:opacity-60"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Authorized credentials issued by Antariksh Academy.
              </p>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B] transition-colors disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Authenticating..."
              icon={<LogIn className="w-4 h-4" />}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Portal Login
            </LoadingButton>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-slate-500 dark:text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#C6922E] dark:text-[#F4C76B] shrink-0 mt-0.5" />
            <p>
              Authorized access only. Logging in automatically directs you to your respective portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;
