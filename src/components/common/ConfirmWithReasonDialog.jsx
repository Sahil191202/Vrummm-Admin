import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/authStore';

/**
 * ConfirmWithReasonDialog enforces mandatory written reasons for sensitive actions.
 * All reasons are sent to the API to be recorded in the immutable audit log
 * (actor, action, target, timestamp, requestId, reason).
 */
export function ConfirmWithReasonDialog({
  open = false,
  onOpenChange,
  title = 'Confirm Sensitive Action',
  description = 'This operation requires a written justification for compliance and audit logging.',
  actionName = 'operations.action',
  targetId,
  targetType = 'Booking',
  confirmLabel = 'Confirm Action',
  confirmVariant = 'default',
  onConfirm,
  minReasonLength = 5,
}) {
  const user = useAuthStore((s) => s.user);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    if (isSubmitting) return; // double-submit guard
    setReason('');
    setError(null);
    onOpenChange?.(false);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // double-submit guard

    const trimmed = reason.trim();
    if (!trimmed || trimmed.length < minReasonLength) {
      setError(`Please provide a written reason with at least ${minReasonLength} characters.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onConfirm({
        reason: trimmed,
        actorId: user?.id || user?._id,
        actorRole: user?.role,
        targetId,
        targetType,
        action: actionName,
      });
      handleClose();
    } catch (err) {
      setError(err?.message || 'Action failed on server. Please check permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <form onSubmit={handleConfirm} className="space-y-4">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[#DC2626] dark:text-[#FF5A52]">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9AA6A0]">
              Audit Log Required
            </span>
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Audit Context Box */}
        <div className="p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] text-xs space-y-1 font-mono text-[#5E6A64] dark:text-[#9AA6A0]">
          <div>
            <span className="text-[#9AA6A0]/80">Actor:</span>{' '}
            <strong className="text-[#171717] dark:text-[#F4F6F5]">
              {user?.displayName || user?.email} ({user?.role})
            </strong>
          </div>
          <div>
            <span className="text-[#9AA6A0]/80">Action:</span>{' '}
            <strong className="text-[#15803D] dark:text-[#1FD88A]">{actionName}</strong>
          </div>
          {targetId && (
            <div>
              <span className="text-[#9AA6A0]/80">Target ({targetType}):</span>{' '}
              <strong className="text-[#171717] dark:text-[#F4F6F5]">{targetId}</strong>
            </div>
          )}
        </div>

        {/* Reason Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="audit-reason"
            className="block text-xs font-semibold text-[#171717] dark:text-[#F4F6F5]"
          >
            Written Justification <span className="text-[#DC2626] dark:text-[#FF5A52]">*</span>
          </label>
          <textarea
            id="audit-reason"
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError(null);
            }}
            placeholder="State the operational reason for this change (e.g. customer stranded, dispatch deadlock, manual override)..."
            className="w-full bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl p-3 text-xs text-[#171717] dark:text-[#F4F6F5] placeholder:text-[#5E6A64]/70 dark:placeholder:text-[#9AA6A0]/70 focus:outline-none focus:ring-2 focus:ring-[#A31C18] focus:border-transparent transition-all"
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
            <span>Minimum {minReasonLength} characters</span>
            <span className={reason.trim().length >= minReasonLength ? 'text-[#15803D] dark:text-[#1FD88A]' : ''}>
              {reason.trim().length} chars
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/30 dark:border-[#FF5A52]/30 text-xs text-[#DC2626] dark:text-[#FF5A52] flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={confirmVariant}
            size="sm"
            isLoading={isSubmitting}
            disabled={isSubmitting || reason.trim().length < minReasonLength}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
