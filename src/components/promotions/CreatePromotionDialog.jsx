import React, { useState } from 'react';
import { Tag, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { parseRupeesToPaise } from '../../utils/formatters';

const VEHICLE_OPTIONS = [
  { id: 'BIKE', label: 'Bike Taxi' },
  { id: 'AUTO', label: 'Auto Rickshaw' },
  { id: 'CAB', label: 'Prime Cab' },
];

export function CreatePromotionDialog({ open, onOpenChange, onCreated }) {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('20');
  const [maxDiscountRupees, setMaxDiscountRupees] = useState('50');
  const [minRideFareRupees, setMinRideFareRupees] = useState('80');
  const [firstRideOnly, setFirstRideOnly] = useState(false);
  const [allowedVehicleTypes, setAllowedVehicleTypes] = useState(['BIKE', 'AUTO', 'CAB']);
  const [maxTotalRedemptions, setMaxTotalRedemptions] = useState('1000');
  const [expiresAt, setExpiresAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 16);
  });
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleVehicle = (type) => {
    if (allowedVehicleTypes.includes(type)) {
      if (allowedVehicleTypes.length > 1) {
        setAllowedVehicleTypes(allowedVehicleTypes.filter((t) => t !== type));
      }
    } else {
      setAllowedVehicleTypes([...allowedVehicleTypes, type]);
    }
  };

  const handleReset = () => {
    setCode('');
    setDescription('');
    setDiscountType('PERCENTAGE');
    setDiscountValue('20');
    setMaxDiscountRupees('50');
    setMinRideFareRupees('80');
    setFirstRideOnly(false);
    setAllowedVehicleTypes(['BIKE', 'AUTO', 'CAB']);
    setMaxTotalRedemptions('1000');
    setReason('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode || trimmedCode.length < 3) {
      setError('Promo code must be at least 3 characters.');
      return;
    }
    if (!reason.trim() || reason.trim().length < 5) {
      setError('A written justification of at least 5 characters is required for audit logging.');
      return;
    }
    if (!expiresAt) {
      setError('Please set an expiration date.');
      return;
    }

    const numericDiscount = parseFloat(discountValue);
    if (isNaN(numericDiscount) || numericDiscount <= 0) {
      setError('Discount value must be greater than zero.');
      return;
    }
    if (discountType === 'PERCENTAGE' && numericDiscount > 100) {
      setError('Percentage discount cannot exceed 100%.');
      return;
    }

    const payload = {
      code: trimmedCode,
      description: description.trim(),
      discountType,
      discountValue: discountType === 'PERCENTAGE' ? Math.round(numericDiscount) : parseRupeesToPaise(numericDiscount),
      maxDiscountPaise: discountType === 'PERCENTAGE' && maxDiscountRupees ? parseRupeesToPaise(maxDiscountRupees) : undefined,
      minRideFarePaise: minRideFareRupees ? parseRupeesToPaise(minRideFareRupees) : 0,
      firstRideOnly,
      allowedVehicleTypes,
      maxTotalRedemptions: maxTotalRedemptions ? parseInt(maxTotalRedemptions, 10) : undefined,
      maxPerUserRedemptions: 1,
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
      setError(err?.message || 'Failed to create promotion code.');
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
              <Tag className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9AA6A0]">
              Marketing & Growth
            </span>
          </div>
          <DialogTitle>Deploy Promotional Code</DialogTitle>
          <DialogDescription>
            Configure user discount caps, vehicle restrictions, and validity periods for Mumbai riders.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-[#F87171]/40 bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[#DC2626] dark:text-[#FF8A84]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Promo Code *
            </label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. MUMBAIFREE"
              className="font-mono uppercase font-bold tracking-wider"
              maxLength={20}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Discount Type *
            </label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8E4] dark:border-[#2A322D] bg-[#FFFFFF] dark:bg-[#0B1510] text-[#171717] dark:text-[#F5F7F6] focus:outline-none focus:ring-2 focus:ring-[#A31C18]"
            >
              <option value="PERCENTAGE">Percentage (%) Discount</option>
              <option value="FLAT">Flat INR (₹) Discount</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              {discountType === 'PERCENTAGE' ? 'Discount (%) *' : 'Flat Discount (₹) *'}
            </label>
            <Input
              type="number"
              min="1"
              max={discountType === 'PERCENTAGE' ? '100' : '1000'}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              required
            />
          </div>

          {discountType === 'PERCENTAGE' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
                Max Discount Cap (₹)
              </label>
              <Input
                type="number"
                min="1"
                value={maxDiscountRupees}
                onChange={(e) => setMaxDiscountRupees(e.target.value)}
                placeholder="e.g. 50"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
                Total Redemptions
              </label>
              <Input
                type="number"
                min="1"
                value={maxTotalRedemptions}
                onChange={(e) => setMaxTotalRedemptions(e.target.value)}
                placeholder="e.g. 1000"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Min Ride Fare (₹)
            </label>
            <Input
              type="number"
              min="0"
              value={minRideFareRupees}
              onChange={(e) => setMinRideFareRupees(e.target.value)}
              placeholder="e.g. 80"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
            Campaign Description
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. 50% discount up to ₹50 on suburban rides"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
            Eligible Vehicle Types
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {VEHICLE_OPTIONS.map((opt) => {
              const active = allowedVehicleTypes.includes(opt.id);
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => toggleVehicle(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    active
                      ? 'bg-[#171717] text-white border-[#171717] dark:bg-[#1FD88A] dark:text-[#06110C] dark:border-[#1FD88A]'
                      : 'bg-transparent text-[#667085] dark:text-[#9AA6A0] border-[#E2E8E4] dark:border-[#2A322D]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Expires At (Kolkata IST) *
            </label>
            <Input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={firstRideOnly}
                onChange={(e) => setFirstRideOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#A31C18] focus:ring-[#A31C18]"
              />
              <span className="text-xs font-medium text-[#171717] dark:text-[#E2E8E4]">
                First-Ride Only Customers
              </span>
            </label>
          </div>
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
            placeholder="Document marketing justification for this promotion (recorded in immutable audit log)..."
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
            disabled={isSubmitting || reason.trim().length < 5 || !code.trim()}
            className="bg-[#A31C18] hover:bg-[#851613] text-white"
          >
            {isSubmitting ? 'Deploying...' : 'Deploy Promotion Code'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
