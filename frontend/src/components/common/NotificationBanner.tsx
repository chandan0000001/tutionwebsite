import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationBannerProps {
  type: NotificationType;
  message: React.ReactNode;
  title?: string;
  onDismiss?: () => void;
  onClose?: () => void;
  autoDismissMs?: number;
  className?: string;
}

const typeStyles: Record<
  NotificationType,
  {
    bg: string;
    border: string;
    text: string;
    icon: React.ReactNode;
  }
> = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-900/60',
    text: 'text-emerald-800 dark:text-emerald-300',
    icon: <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />,
  },
  error: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-900/60',
    text: 'text-rose-800 dark:text-rose-300',
    icon: <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />,
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-900/60',
    text: 'text-amber-800 dark:text-amber-300',
    icon: <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />,
  },
  info: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-900/60',
    text: 'text-sky-800 dark:text-sky-300',
    icon: <Info className="w-5 h-5 shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />,
  },
};

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  message,
  title,
  onDismiss,
  onClose,
  autoDismissMs,
  className = '',
}) => {
  const dismissAction = onDismiss || onClose;

  useEffect(() => {
    if (!autoDismissMs || !dismissAction) return;
    const timer = setTimeout(dismissAction, autoDismissMs);
    return () => clearTimeout(timer);
  }, [autoDismissMs, dismissAction]);

  const style = typeStyles[type];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xs animate-in fade-in duration-200 ${style.bg} ${style.border} ${style.text} ${className}`}
    >
      {style.icon}
      <div className="flex-1 min-w-0 text-xs sm:text-sm">
        {title && <p className="font-extrabold uppercase tracking-wider text-[11px] mb-0.5">{title}</p>}
        <div className="leading-relaxed">{message}</div>
      </div>
      {dismissAction && (
        <button
          type="button"
          onClick={dismissAction}
          className="p-1 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default NotificationBanner;
