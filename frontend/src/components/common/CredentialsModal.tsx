import React, { useState } from 'react';
import { Check, Copy, KeyRound, ShieldAlert, X } from 'lucide-react';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  roleName?: string;
  username: string;
  temporaryPassword: string;
  note?: string;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  isOpen,
  onClose,
  title,
  roleName = 'User',
  username,
  temporaryPassword,
  note,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = `Antariksh Academy Login Credentials\nRole: ${roleName}\nUsername: ${username}\nTemporary Password: ${temporaryPassword}\nLogin Portal: ${window.location.origin}/student/login\nNote: Please sign in and update your password immediately upon first login.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-[#C6922E] dark:text-[#F4C76B] flex items-center justify-center mb-5 border border-amber-500/30">
          <KeyRound className="w-7 h-7" />
        </div>

        <h3 className="font-display font-black text-xl sm:text-2xl text-[#17365D] dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Save or forward these one-time temporary credentials. The password hash is cryptographically stored and this password cannot be retrieved again.
        </p>

        {/* Credentials Display Box */}
        <div className="mt-5 p-5 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Username
            </span>
            <span className="font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white select-all">
              {username}
            </span>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-700/60" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Temporary Password
            </span>
            <span className="font-mono text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 tracking-wider select-all">
              {temporaryPassword}
            </span>
          </div>
        </div>

        {/* Important Warning Alert */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>
            {note ||
              'Upon their first sign-in, the user will be automatically prompted to configure their private personal password before access is granted.'}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopy}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-[#0B1120] bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] hover:brightness-105 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-900" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full Credentials</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-6 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#2A374D] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CredentialsModal;
