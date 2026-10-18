import React from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'current' | 'gold' | 'white' | 'navy';

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-7 h-7 border-[2.5px]',
  xl: 'w-10 h-10 border-3',
};

const colorClasses: Record<SpinnerColor, string> = {
  current: 'border-current border-t-transparent',
  gold: 'border-amber-200 dark:border-amber-900 border-t-[#C6922E] dark:border-t-[#F4C76B]',
  white: 'border-white/30 border-t-white',
  navy: 'border-slate-200 dark:border-slate-700 border-t-[#17365D] dark:border-t-[#F4C76B]',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'sm',
  color = 'current',
  className = '',
  label = 'Loading...',
}) => {
  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <div
        className={`rounded-full animate-spin motion-reduce:animate-none ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
