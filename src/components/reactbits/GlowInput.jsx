import React, { useRef, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '../ui/button';

/**
 * React Bits - GlowInput
 * Elevated input field with subtle ambient focus glow, cursor proximity, and micro-interactions.
 * /unslop: Clean 44px touch targets, accessible ARIA, keyboard shortcut indicator.
 */
export const GlowInput = React.forwardRef(
  (
    {
      className,
      type = 'text',
      error,
      helperText,
      label,
      id,
      icon: Icon,
      shortcut,
      clearable = false,
      value,
      onChange,
      glowVariant = 'crimson', // 'crimson' | 'emerald'
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);

    const handleClear = () => {
      if (onChange) {
        const event = {
          target: { value: '' },
          currentTarget: { value: '' },
        };
        onChange(event);
      }
    };

    const glowClass =
      glowVariant === 'emerald'
        ? 'focus-within:border-[#15803D] dark:focus-within:border-[#1FD88A] focus-within:shadow-[0_0_16px_rgba(31,216,138,0.22)]'
        : 'focus-within:border-[#A31C18] dark:focus-within:border-[#C4271F] focus-within:shadow-[0_0_16px_rgba(163,28,24,0.25)]';

    return (
      <div className="w-full space-y-1.5" ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            'relative flex items-center rounded-xl border transition-all duration-200',
            'bg-white dark:bg-[#0B1A13]',
            'border-[#E2E8E4] dark:border-[#2A322D]',
            glowClass,
            error && 'border-[#DC2626] dark:border-[#FF5A52] focus-within:shadow-[0_0_16px_rgba(220,38,38,0.25)]',
            className
          )}
        >
          {Icon && (
            <div className="pl-3.5 flex items-center pointer-events-none text-[#5E6A64] dark:text-[#9AA6A0]">
              <Icon className="h-4 w-4" />
            </div>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'flex min-h-[44px] h-11 w-full bg-transparent px-3.5 py-2 text-sm outline-none transition-colors',
              'text-[#171717] dark:text-[#F4F6F5]',
              'placeholder:text-[#5E6A64]/70 dark:placeholder:text-[#9AA6A0]/70',
              'disabled:cursor-not-allowed disabled:opacity-50',
              Icon && 'pl-2.5',
              (clearable && value) || shortcut ? 'pr-12' : ''
            )}
            {...props}
          />

          {/* Action buttons (Clear / Shortcut) */}
          <div className="pr-3 flex items-center gap-1.5">
            {clearable && value && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear input"
                className="p-1 rounded-md text-[#5E6A64] hover:text-[#171717] dark:text-[#9AA6A0] dark:hover:text-[#F4F6F5] hover:bg-[#F5F7F6] dark:hover:bg-[#171717] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {shortcut && !value && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E2E8E4] dark:bg-[#2A322D] text-[#5E6A64] dark:text-[#9AA6A0] pointer-events-none">
                {shortcut}
              </span>
            )}
          </div>
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
  }
);

GlowInput.displayName = 'GlowInput';
