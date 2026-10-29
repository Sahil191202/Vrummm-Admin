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
        className="relative z-50 w-full max-w-lg rounded-2xl bg-[#06110C] border border-[#2A3630] text-[#F5F5F5] p-6 shadow-2xl transition-all light:bg-white light:border-[#E5E7EB] light:text-[#171717]"
      >
        <button
          onClick={() => onOpenChange?.(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#171717] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A31C18]"
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
      className={cn('text-lg font-bold text-[#F5F5F5] dark:text-[#F5F5F5] light:text-[#171717]', className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <p
      className={cn('text-xs text-[#A3A3A3] dark:text-[#A3A3A3] light:text-[#525252]', className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-[#2A3630]/60 light:border-[#E5E7EB]', className)}
      {...props}
    />
  );
}
