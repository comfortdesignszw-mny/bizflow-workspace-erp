import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  compact = false
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'py-6' : 'py-12'}`}>
      <div className={`${compact ? 'p-2 mb-2' : 'p-3 mb-4'} rounded-xl bg-neutral-800/50 text-neutral-400`}>
        <Icon className={compact ? 'w-5 h-5' : 'w-8 h-8'} />
      </div>
      <h3 className={`${compact ? 'text-xs' : 'text-sm'} font-bold text-neutral-300 mb-1`}>
        {title}
      </h3>
      <p className={`${compact ? 'text-[11px]' : 'text-xs'} text-neutral-500 mb-3 max-w-xs`}>
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className={`${compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 font-medium transition-colors cursor-pointer`}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
