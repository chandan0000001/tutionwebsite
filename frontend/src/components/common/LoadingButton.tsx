import React from 'react';
import { LoadingSpinner, type SpinnerSize } from './LoadingSpinner';

export type ButtonVariant = 'gold' | 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  gold: 'bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] text-[#0B1120] font-extrabold shadow-sm hover:brightness-105 active:scale-[0.99] border-transparent',
  primary: 'bg-[#17365D] hover:bg-[#102A43] dark:bg-gradient-to-r dark:from-[#F4C76B] dark:via-[#E5B555] dark:to-[#D4A33B] text-white dark:text-[#0B1120] font-bold shadow-sm',
  secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700',
  danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold shadow-rose-600/20 shadow-sm',
  outline: 'border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold',
  ghost: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 font-bold',
};

const sizeStyles: Record<ButtonSize, { padding: string; text: string; spinnerSize: SpinnerSize }> = {
  sm: { padding: 'py-2 px-3.5 rounded-xl', text: 'text-xs', spinnerSize: 'xs' },
  md: { padding: 'py-2.5 px-6 rounded-xl', text: 'text-xs sm:text-sm', spinnerSize: 'sm' },
  lg: { padding: 'py-3.5 px-7 rounded-2xl', text: 'text-sm sm:text-base', spinnerSize: 'md' },
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText,
  variant = 'gold',
  size = 'md',
  icon,
  children,
  disabled,
  className = '',
  type = 'button',
  ...rest
}) => {
  const currentSize = sizeStyles[size];
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={`relative inline-flex items-center justify-center gap-2 transition-all cursor-pointer select-none disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none ${
        currentSize.padding
      } ${currentSize.text} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size={currentSize.spinnerSize} color="current" />
          <span>{loadingText || 'Processing...'}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default LoadingButton;
