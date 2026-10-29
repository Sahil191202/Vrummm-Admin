import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from './button';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2">
        {toasts.map((toast) => {
          const isError = toast.variant === 'destructive' || toast.variant === 'error';
          const isSuccess = toast.variant === 'success';

          return (
            <div
              key={toast.id}
              role="alert"
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all',
                'bg-[#06110C] text-[#F5F5F5] border-[#2A3630] light:bg-white light:border-[#E5E7EB] light:text-[#171717]',
                isError && 'border-[#F87171]/40 bg-[#171717]',
                isSuccess && 'border-[#22C55E]/40 bg-[#06110C]',
              )}
            >
              {isError && <AlertCircle className="w-5 h-5 text-[#F87171] flex-shrink-0 mt-0.5" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />}
              {!isError && !isSuccess && <Info className="w-5 h-5 text-[#34D399] flex-shrink-0 mt-0.5" />}

              <div className="flex-1 space-y-0.5">
                {toast.title && <p className="text-xs font-bold leading-tight">{toast.title}</p>}
                {toast.description && (
                  <p className="text-xs text-[#A3A3A3] light:text-[#525252] leading-snug">
                    {toast.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#A3A3A3] hover:text-[#F5F5F5] p-1 rounded-md transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: () => {},
      removeToast: () => {},
    };
  }
  return context;
}
