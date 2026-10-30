import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from './button';

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onOpenChange?.(false);
      }
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange?.(false)}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-50 w-full max-w-lg rounded-2xl bg-white border border-[#E2E8E4] text-[#171717] p-6 shadow-2xl transition-all dark:bg-[#06110C] dark:border-[#2A322D] dark:text-[#F4F6F5]"
      >
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#5E6A64] hover:text-[#171717] hover:bg-[#F5F7F6] dark:text-[#9AA6A0] dark:hover:text-[#F4F6F5] dark:hover:bg-[#171717] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A31C18]"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1.5 text-left mb-4', className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn('text-lg font-bold text-[#171717] dark:text-[#F4F6F5]', className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-xs text-[#5E6A64] dark:text-[#9AA6A0]', className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-[#E2E8E4] dark:border-[#2A322D]', className)}
      {...props}
    />
  );
}
