import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldAlert, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { changePassword, student } = useAuth();
  const navigate = useNavigate();

  // Validate rules
  const hasMinLength = newPassword.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!hasMinLength || !hasLetter || !hasNumber) {
      setErrorMessage('New password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage('Your new password must be different from your current temporary password.');
      return;
    }

    setIsSubmitting(true);
    const result = await changePassword(currentPassword, newPassword, confirmPassword);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage('Password changed successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/student/dashboard', { replace: true });
      }, 1500);
    } else {
      setErrorMessage(result.message || 'Failed to update password. Please check your current password.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC] dark:bg-[#0B1120] transition-colors duration-200">
      <div className="w-full max-w-lg">
        {/* Banner Alert for First Time Login */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-extrabold uppercase tracking-wider text-[11px] text-amber-800 dark:text-amber-300">
              Security Action Required
            </p>
            <p className="mt-1">
              Welcome, <span className="font-bold">{student?.name || 'Student'}</span>! You are logged in with an initial temporary password. To protect your student account and access batch lectures, please choose a private password.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-[#C6922E] dark:text-[#F4C76B] flex items-center justify-center border border-amber-200 dark:border-amber-900">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-black text-xl text-[#17365D] dark:text-white">
                Set Personal Password
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Batch {student?.batch || '2026'} • Username: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{student?.username}</span>
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1"
              >
                Current Temporary Password
              </label>
              <input
                id="currentPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter the initial temporary password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B]"
              />
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1"
              >
                New Personal Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create new password"
                  className="w-full px-3.5 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C6922E] dark:focus:ring-[#F4C76B]"
              />
            </div>

            {/* Password Policy Checklist */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1E293B]/70 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5">
              <p className="font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Password Rules:
              </p>
              <div className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                <span>At least 8 characters long</span>
              </div>
              <div className={`flex items-center gap-2 ${hasLetter && hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${hasLetter && hasNumber ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                <span>Contains both letters and numbers</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordsMatch ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${passwordsMatch ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                <span>Both passwords match</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Saving New Password...' : 'Save Password & Enter Portal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
