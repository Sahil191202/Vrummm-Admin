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
        'bg-[#091510] border-[#2A3630] text-[#F5F5F5]',
        'light:bg-white light:border-[#E5E7EB] light:text-[#171717]',
        className,
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[#06110C] border border-[#2A3630] flex items-center justify-center text-[#A3A3A3] mb-4 light:bg-[#F3F4F6] light:border-[#E5E7EB] light:text-[#525252]">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold mb-1 text-[#F5F5F5] light:text-[#171717]">
        {title}
      </h3>
      <p className="text-xs text-[#A3A3A3] max-w-sm mb-5 light:text-[#525252]">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
