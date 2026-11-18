import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, ShieldAlert, AlertCircle } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { formatPaise, maskPhone } from '../../utils/formatters';

export function SimulateRefundDialog({ open, onOpenChange, payment, onRefundSimulated }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    setReason('');
    setError(null);
    onOpenChange(false);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (isSubmitting || !payment) return;

    if (!reason.trim() || reason.trim().length < 5) {
      setError('A written justification of at least 5 characters is required for audit logging.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onRefundSimulated(payment._id, { reason: reason.trim() });
      handleClose();
    } catch (err) {
      setError(err?.message || 'Failed to trigger simulated refund.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <form onSubmit={handleConfirm} className="space-y-4">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[#DC2626] dark:text-[#FF8A84]">
              <RotateCcw className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#DC2626] dark:text-[#FF8A84] font-semibold">
              Simulated Financial Reversal
            </span>
          </div>
          <DialogTitle>Simulate Payment Refund</DialogTitle>
          <DialogDescription>
            Audit and simulate refund execution for captured rider transaction.
          </DialogDescription>
        </DialogHeader>

        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl border border-[#F59E0B]/30 bg-[#FEF3C7]/40 dark:bg-[#271E0B]/50 flex items-start gap-3 text-xs text-[#92400E] dark:text-[#FCD34D] leading-relaxed">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#F59E0B] mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">SIMULATED REFUND — LEARNING ENVIRONMENT ONLY</strong>
            This action simulates refund orchestration without contacting external banking rails. A permanent compensating debit entry will be appended to the immutable financial ledger.
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-[#F87171]/40 bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[#DC2626] dark:text-[#FF8A84]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Payment Summary */}
        <div className="p-3.5 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] bg-[#F5F7F6] dark:bg-[#0B1510] space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-black/5 dark:border-white/5">
            <span className="text-[#667085] dark:text-[#9AA6A0]">Payment ID:</span>
            <span className="font-mono font-semibold text-[#171717] dark:text-white">{payment._id}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-black/5 dark:border-white/5">
            <span className="text-[#667085] dark:text-[#9AA6A0]">Customer:</span>
            <span className="font-medium text-[#171717] dark:text-white">
              {payment.customerName || 'Customer'} {payment.customerPhone ? `(${maskPhone(payment.customerPhone)})` : ''}
            </span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-black/5 dark:border-white/5">
            <span className="text-[#667085] dark:text-[#9AA6A0]">Ride Ref:</span>
            <span className="font-mono text-[#171717] dark:text-white">{payment.rideId || '—'}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-black/5 dark:border-white/5">
            <span className="text-[#667085] dark:text-[#9AA6A0]">Provider:</span>
            <span className="font-mono uppercase font-semibold text-[#171717] dark:text-white">{payment.provider}</span>
          </div>
          <div className="flex justify-between items-center pt-1 font-bold">
            <span className="text-[#171717] dark:text-white">Refund Amount:</span>
            <span className="text-base text-[#DC2626] dark:text-[#FF8A84] font-mono">
              {formatPaise(payment.amountPaise)}
            </span>
          </div>
        </div>

        {/* Mandatory Reason */}
        <div className="p-3 rounded-lg border border-[#E2E8E4] dark:border-[#2A322D] bg-[#F5F7F6] dark:bg-[#0B1510] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" />
              Mandatory Operational Justification *
            </span>
            <span className={`text-[11px] font-mono ${reason.trim().length >= 5 ? 'text-[#0A7B44] dark:text-[#1FD88A]' : 'text-[#DC2626]'}`}>
              {reason.trim().length}/5 chars min
            </span>
          </div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Document compliance justification (e.g. customer overcharged, ride abandoned by driver, test simulation)..."
            className="w-full text-xs p-2 rounded border border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#06110C] text-[#171717] dark:text-[#F5F7F6] focus:outline-none focus:ring-1 focus:ring-[#A31C18]"
            required
          />
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || reason.trim().length < 5}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
          >
            {isSubmitting ? 'Simulating...' : 'Execute Simulated Refund'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
