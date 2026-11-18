import React, { useState } from 'react';
import { BookOpen, ShieldAlert, AlertTriangle, AlertCircle } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { parseRupeesToPaise } from '../../utils/formatters';

const ACCOUNT_TYPES = [
  { value: 'PLATFORM', label: 'Platform Account' },
  { value: 'CAPTAIN', label: 'Captain Account' },
  { value: 'CUSTOMER', label: 'Customer Account' },
];

export function CreateAdjustmentDialog({ open, onOpenChange, onAdjustmentCreated }) {
  const [accountType, setAccountType] = useState('PLATFORM');
  const [accountUserId, setAccountUserId] = useState('');
  const [direction, setDirection] = useState('CREDIT');
  const [amountRupees, setAmountRupees] = useState('50');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    setAccountType('PLATFORM');
    setAccountUserId('');
    setDirection('CREDIT');
    setAmountRupees('50');
    setDescription('');
    setReason('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!reason.trim() || reason.trim().length < 5) {
      setError('A written justification of at least 5 characters is required for audit logging.');
      return;
    }
    if (!description.trim() || description.trim().length < 3) {
      setError('Description must be at least 3 characters.');
      return;
    }
    const numericAmount = parseFloat(amountRupees);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Adjustment amount must be greater than zero.');
      return;
    }

    const payload = {
      accountType,
      accountUserId: accountUserId.trim() || '65f0plat0000000000000000',
      direction,
      amountPaise: parseRupeesToPaise(numericAmount),
      description: description.trim(),
      reason: reason.trim(),
    };

    setIsSubmitting(true);
    setError(null);

    try {
      await onAdjustmentCreated(payload);
      handleReset();
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Failed to post ledger adjustment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[85vh] overflow-y-auto pr-1">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#E6F9F0] dark:bg-[#082015] text-[#0A7B44] dark:text-[#1FD88A]">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9AA6A0]">
              Double-Entry Bookkeeping
            </span>
          </div>
          <DialogTitle>Append Ledger Adjustment</DialogTitle>
          <DialogDescription>
            Record manual financial adjustment directly into the immutable append-only ledger.
          </DialogDescription>
        </DialogHeader>

        {/* Immutability Notice */}
        <div className="p-3.5 rounded-xl border border-[#F59E0B]/30 bg-[#FEF3C7]/40 dark:bg-[#271E0B]/50 flex items-start gap-3 text-xs text-[#92400E] dark:text-[#FCD34D] leading-relaxed">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#F59E0B] mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">IMMUTABLE FINANCIAL RECORD NOTICE</strong>
            Ledger records are strictly append-only. Once submitted, this entry cannot be modified or deleted. To rectify a posting error, an offsetting transaction must be generated.
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-[#F87171]/40 bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[#DC2626] dark:text-[#FF8A84]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Account Entity *
            </label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8E4] dark:border-[#2A322D] bg-[#FFFFFF] dark:bg-[#0B1510] text-[#171717] dark:text-[#F5F7F6] focus:outline-none focus:ring-2 focus:ring-[#A31C18]"
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Entry Direction *
            </label>
            <div className="grid grid-cols-2 gap-2 h-10">
              <button
                type="button"
                onClick={() => setDirection('CREDIT')}
                className={`rounded-lg text-xs font-bold border transition-all ${
                  direction === 'CREDIT'
                    ? 'bg-[#0A7B44] text-white border-[#0A7B44]'
                    : 'bg-transparent text-[#667085] dark:text-[#9AA6A0] border-[#E2E8E4] dark:border-[#2A322D]'
                }`}
              >
                + CREDIT
              </button>
              <button
                type="button"
                onClick={() => setDirection('DEBIT')}
                className={`rounded-lg text-xs font-bold border transition-all ${
                  direction === 'DEBIT'
                    ? 'bg-[#DC2626] text-white border-[#DC2626]'
                    : 'bg-transparent text-[#667085] dark:text-[#9AA6A0] border-[#E2E8E4] dark:border-[#2A322D]'
                }`}
              >
                - DEBIT
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Adjustment Amount (₹) *
            </label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={amountRupees}
              onChange={(e) => setAmountRupees(e.target.value)}
              placeholder="e.g. 50.00"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Target Account ID (Optional)
            </label>
            <Input
              value={accountUserId}
              onChange={(e) => setAccountUserId(e.target.value)}
              placeholder="Defaults to Platform Treasury"
              className="font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
            Ledger Description *
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Gateway fee rounding difference offset"
            required
          />
        </div>

        {/* Audit Justification */}
        <div className="p-3 rounded-lg border border-[#E2E8E4] dark:border-[#2A322D] bg-[#F5F7F6] dark:bg-[#0B1510] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" />
              Mandatory Written Justification *
            </span>
            <span className={`text-[11px] font-mono ${reason.trim().length >= 5 ? 'text-[#0A7B44] dark:text-[#1FD88A]' : 'text-[#DC2626]'}`}>
              {reason.trim().length}/5 chars min
            </span>
          </div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Document reconciliation justification (recorded in immutable audit log)..."
            className="w-full text-xs p-2 rounded border border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#06110C] text-[#171717] dark:text-[#F5F7F6] focus:outline-none focus:ring-1 focus:ring-[#A31C18]"
            required
          />
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || reason.trim().length < 5 || !description.trim()}
            className="bg-[#A31C18] hover:bg-[#851613] text-white"
          >
            {isSubmitting ? 'Posting...' : 'Commit Immutable Entry'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
