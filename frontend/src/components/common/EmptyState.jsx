import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items to display at this time.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-[#E5E8E5] dark:border-[#354651] bg-white/50 dark:bg-[#243541]/40 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#D7E2DF]/50 dark:bg-[#426B72]/20 flex items-center justify-center text-[#426B72] dark:text-[#8DAEAA] mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-[#263238] dark:text-[#E7ECEB]">
        {title}
      </h4>
      <p className="text-sm text-[#77818A] dark:text-[#A2AFB5] mt-1 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
