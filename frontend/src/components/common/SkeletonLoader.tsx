import React from 'react';

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  cols?: number;
  colSpan?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 5,
  cols,
  colSpan,
  className = '',
}) => {
  const actualCols = cols ?? columns;
  const span = colSpan ?? actualCols;

  return (
    <tr>
      <td colSpan={span} className={`p-4 ${className}`}>
        <div
          role="status"
          aria-label="Loading table data..."
          className="w-full overflow-hidden"
        >
          <div className="animate-pulse space-y-3">
            {Array.from({ length: rows }).map((_, rIdx) => (
              <div
                key={rIdx}
                className="flex items-center gap-4 py-3.5 px-4 rounded-xl bg-slate-50 dark:bg-[#111827]/70 border border-slate-100 dark:border-slate-800/80"
              >
                {Array.from({ length: actualCols }).map((_, cIdx) => {
                  // Vary widths naturally
                  const widthClasses = ['w-1/4', 'w-1/6', 'w-1/3', 'w-1/5', 'w-16'];
                  const width = widthClasses[cIdx % widthClasses.length];
                  return (
                    <div
                      key={cIdx}
                      className={`h-4 bg-slate-200 dark:bg-slate-800 rounded-md ${width}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <span className="sr-only">Loading records...</span>
        </div>
      </td>
    </tr>
  );
};

export interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 3, className = '' }) => {
  return (
    <div
      role="status"
      aria-label="Loading cards..."
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
          <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
            <div className="h-3.5 w-2/3 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  );
};

export const InlineSkeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-24' }) => {
  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
