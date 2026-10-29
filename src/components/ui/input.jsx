import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from './button';

export const Input = React.forwardRef(
  ({ className, type = 'text', error, helperText, label, id, icon: Icon, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E6A64] dark:text-[#9AA6A0]">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'flex min-h-[44px] h-11 w-full rounded-xl px-3.5 py-2 text-sm transition-all',
              'bg-white dark:bg-[#0B1A13]',
              'text-[#171717] dark:text-[#F4F6F5]',
              'border border-[#E2E8E4] dark:border-[#2A322D]',
              'placeholder:text-[#5E6A64]/70 dark:placeholder:text-[#9AA6A0]/70',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A31C18] focus-visible:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              Icon && 'pl-10',
              error && 'border-[#DC2626] dark:border-[#FF5A52] focus-visible:ring-[#DC2626] dark:focus-visible:ring-[#FF5A52]',
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="flex items-center gap-1.5 text-xs text-[#DC2626] dark:text-[#FF5A52] font-semibold mt-1"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] mt-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
