import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { cn } from './button';

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching data.',
  code,
  requestId,
  onRetry,
  secondaryAction,
  className,
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-10 text-center rounded-2xl border',
        'bg-white dark:bg-[#171717] border-[#DC2626]/20 dark:border-[#FF5A52]/30 text-[#171717] dark:text-[#F4F6F5] shadow-sm',
        className,
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[#DC2626] dark:text-[#FF5A52] border border-[#DC2626]/30 dark:border-[#FF5A52]/30 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5] mb-1">
        {title}
      </h3>

      <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] max-w-md mb-4 leading-relaxed">
        {message}
      </p>

      {(code || requestId) && (
        <div className="bg-[#F5F7F6] dark:bg-[#06110C] border border-[#E2E8E4] dark:border-[#2A3630] rounded-lg px-3 py-2 text-[11px] font-mono text-[#5E6A64] dark:text-[#9AA6A0] mb-5 space-y-0.5 text-left max-w-sm">
          {code && <div><span className="text-[#9AA6A0] dark:text-[#737373]">Error Code:</span> <span className="font-semibold text-[#171717] dark:text-[#F4F6F5]">{code}</span></div>}
          {requestId && <div><span className="text-[#9AA6A0] dark:text-[#737373]">Request ID:</span> <span className="font-semibold text-[#171717] dark:text-[#F4F6F5]">{requestId}</span></div>}
        </div>
      )}

      <div className="flex items-center gap-3">
        {secondaryAction}
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="secondary"
            size="sm"
            className="gap-2 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Operation
          </Button>
        )}
      </div>
    </div>
  );
}
