import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from './button';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items to display at this time.',
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border',
        'bg-white border-[#E2E8E4] text-[#171717] shadow-sm',
        'dark:bg-[#091510] dark:border-[#2A3630] dark:text-[#F4F6F5]',
        className,
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[#F5F7F6] border border-[#E2E8E4] text-[#5E6A64] flex items-center justify-center mb-4 dark:bg-[#06110C] dark:border-[#2A3630] dark:text-[#9AA6A0]">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold mb-1 text-[#171717] dark:text-[#F4F6F5]">
        {title}
      </h3>
      <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] max-w-sm mb-5">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
