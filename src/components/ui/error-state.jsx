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
  className,
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-10 text-center rounded-2xl border',
        'bg-[#171717] border-[#F87171]/30 text-[#F5F5F5]',
        'light:bg-red-50/40 light:border-red-200 light:text-[#171717]',
        className,
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-sm font-bold text-[#F5F5F5] light:text-[#171717] mb-1">
        {title}
      </h3>

      <p className="text-xs text-[#A3A3A3] light:text-[#525252] max-w-md mb-4 leading-relaxed">
        {message}
      </p>

      {(code || requestId) && (
        <div className="bg-[#06110C] border border-[#2A3630] rounded-lg px-3 py-2 text-[11px] font-mono text-[#A3A3A3] mb-5 space-y-0.5 text-left max-w-sm">
          {code && <div><span className="text-[#737373]">Error Code:</span> {code}</div>}
          {requestId && <div><span className="text-[#737373]">Request ID:</span> {requestId}</div>}
        </div>
      )}

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="gap-2 text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Operation
        </Button>
      )}
    </div>
  );
}
