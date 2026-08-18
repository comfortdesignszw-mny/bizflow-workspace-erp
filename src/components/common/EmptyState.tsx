import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionText,
  onAction,
  secondaryActionLabel,
  secondaryActionText,
  onSecondaryAction,
  compact = false
}) => {
  const primaryLabel = actionLabel || actionText;
  const secondaryLabel = secondaryActionLabel || secondaryActionText;

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2">
        <Icon className="w-5 h-5 text-neutral-500" />
        <h4 className="text-xs font-semibold text-neutral-300">{title}</h4>
        <p className="text-[11px] text-neutral-500 max-w-xs">{description}</p>
        {primaryLabel && onAction && (
          <button
            onClick={onAction}
            className="px-3 py-1 bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-medium rounded-lg transition-colors cursor-pointer mt-1"
          >
            {primaryLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 md:p-14 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xs max-w-2xl mx-auto my-6 space-y-4">
      <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700 text-neutral-300 shadow-inner">
        <Icon className="w-8 h-8 text-neutral-400" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-neutral-400 leading-relaxed">{description}</p>
      </div>
      {(primaryLabel || secondaryLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {primaryLabel && onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              {primaryLabel}
            </button>
          )}
          {secondaryLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-xl border border-neutral-700 transition-all cursor-pointer"
            >
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
