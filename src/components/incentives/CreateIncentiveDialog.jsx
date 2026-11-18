import React, { useState } from 'react';
import { Award, ShieldAlert, AlertCircle } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { parseRupeesToPaise } from '../../utils/formatters';

const TARGET_TYPES = [
  { value: 'PEAK_HOUR', label: 'Peak Hour Target' },
  { value: 'DAILY_RIDES', label: 'Daily Ride Target' },
  { value: 'WEEKLY_RIDES', label: 'Weekly Marathon' },
  { value: 'REFERRAL', label: 'Driver Referral' },
];

export function CreateIncentiveDialog({ open, onOpenChange, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetType, setTargetType] = useState('PEAK_HOUR');
  const [targetCount, setTargetCount] = useState('5');
  const [rewardRupees, setRewardRupees] = useState('250');
  const [expiresAt, setExpiresAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 16);
  });
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    setName('');
    setDescription('');
    setTargetType('PEAK_HOUR');
    setTargetCount('5');
    setRewardRupees('250');
    setReason('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim() || name.trim().length < 3) {
      setError('Campaign name must be at least 3 characters.');
      return;
    }
    if (!reason.trim() || reason.trim().length < 5) {
      setError('A written justification of at least 5 characters is required for audit logging.');
      return;
    }
    const count = parseInt(targetCount, 10);
    if (isNaN(count) || count <= 0) {
      setError('Target count must be a positive integer.');
      return;
    }
    const reward = parseFloat(rewardRupees);
    if (isNaN(reward) || reward <= 0) {
      setError('Reward amount must be greater than zero.');
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      targetType,
      targetCount: count,
      rewardAmountPaise: parseRupeesToPaise(reward),
      expiresAt: new Date(expiresAt).toISOString(),
      reason: reason.trim(),
    };

    setIsSubmitting(true);
    setError(null);

    try {
      await onCreated(payload);
      handleReset();
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Failed to create incentive campaign.');
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
              <Award className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9AA6A0]">
              Supply Incentives
            </span>
          </div>
          <DialogTitle>Create Captain Incentive Campaign</DialogTitle>
          <DialogDescription>
            Deploy performance-based earnings boosts to incentivize driver coverage during critical hours.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-[#F87171]/40 bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[#DC2626] dark:text-[#FF8A84]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
            Campaign Name *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Bandra Morning Peak 5-Ride Boost"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Target Category *
            </label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8E4] dark:border-[#2A322D] bg-[#FFFFFF] dark:bg-[#0B1510] text-[#171717] dark:text-[#F5F7F6] focus:outline-none focus:ring-2 focus:ring-[#A31C18]"
            >
              {TARGET_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Target Count (Rides) *
            </label>
            <Input
              type="number"
              min="1"
              value={targetCount}
              onChange={(e) => setTargetCount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Reward Payout (₹) *
            </label>
            <Input
              type="number"
              min="1"
              value={rewardRupees}
              onChange={(e) => setRewardRupees(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
            Description & Criteria
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Complete 5 rides between 8 AM - 12 PM in BKC cluster"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
            Valid Until (Kolkata IST) *
          </label>
          <Input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
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
            placeholder="Operational supply justification for this incentive (recorded in immutable audit log)..."
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
            disabled={isSubmitting || reason.trim().length < 5 || !name.trim()}
            className="bg-[#A31C18] hover:bg-[#851613] text-white"
          >
            {isSubmitting ? 'Creating...' : 'Deploy Incentive'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
