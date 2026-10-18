import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TeacherHeader } from '../../components/teacher/TeacherHeader';
import { LoadingButton } from '../../components/common/LoadingButton';
import { NotificationBanner } from '../../components/common/NotificationBanner';

export const TeacherChangePasswordPage: React.FC = () => {
  const { user, changePassword } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await changePassword(currentPassword, newPassword, confirmPassword);
      if (result.success) {
        setSuccessMessage(result.message || 'Password updated successfully!');
        setTimeout(() => {
          navigate('/teacher/dashboard', { replace: true });
        }, 1500);
      } else {
        setErrorMessage(result.message || 'Failed to update password.');
      }
    } catch {
      setErrorMessage('A network error occurred while updating your password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#F8FAFC] dark:bg-[#0B1120] pb-12 transition-colors duration-200">
      <TeacherHeader />

      <div className="max-w-md mx-auto px-4 pt-10">
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] flex items-center justify-center border border-amber-500/30">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="font-display font-black text-2xl text-[#17365D] dark:text-white">
              Change Account Password
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Update password for teacher account <strong>@{user?.username}</strong>
            </p>
          </div>

          {user?.mustChangePassword && (
            <div className="mb-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Password Change Required</p>
                <p className="mt-0.5">
                  You are currently signed in with a temporary password. Please set your new private password before proceeding.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-5">
              <NotificationBanner
                type="error"
                message={errorMessage}
                onClose={() => setErrorMessage(null)}
              />
            </div>
          )}

          {successMessage && (
            <div className="mb-5">
              <NotificationBanner
                type="success"
                message={successMessage}
                onClose={() => setSuccessMessage(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Current / Temporary Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  disabled={isSubmitting}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-slate-400 disabled:opacity-50"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                New Password (minimum 6 characters) *
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  disabled={isSubmitting}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-slate-400 disabled:opacity-50"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                disabled={isSubmitting}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1E293B] text-xs focus:ring-2 focus:ring-[#C6922E] disabled:opacity-60"
              />
            </div>

            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Updating Password..."
              className="w-full mt-4 py-3 px-4 rounded-xl text-xs font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Update Password
            </LoadingButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherChangePasswordPage;
