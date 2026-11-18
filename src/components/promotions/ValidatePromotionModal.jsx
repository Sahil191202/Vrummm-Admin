import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { promotionService } from '../../services/promotionService';
import { formatPaise, parseRupeesToPaise } from '../../utils/formatters';

export function ValidatePromotionModal({ open, onOpenChange, initialCode = 'VRUMM50' }) {
  const [testCode, setTestCode] = useState(initialCode);
  const [testFareRupees, setTestFareRupees] = useState('150');
  const [testVehicleType, setTestVehicleType] = useState('AUTO');
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!testCode.trim()) return;

    setIsValidating(true);
    setResult(null);
    setError(null);

    try {
      const farePaise = parseRupeesToPaise(testFareRupees || '100');
      const res = await promotionService.validatePromotion({
        code: testCode.trim().toUpperCase(),
        rideFarePaise: farePaise,
        vehicleType: testVehicleType,
      });
      setResult(res.validation);
    } catch (err) {
      setError(err?.message || 'Failed to validate promo code.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleValidate} className="space-y-4">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#E6F9F0] dark:bg-[#082015] text-[#0A7B44] dark:text-[#1FD88A]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9AA6A0]">
              Eligibility Simulator
            </span>
          </div>
          <DialogTitle>Test Promo Code Eligibility</DialogTitle>
          <DialogDescription>
            Simulate ride conditions to test discounting rules, caps, and vehicle restrictions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Promo Code
            </label>
            <Input
              value={testCode}
              onChange={(e) => setTestCode(e.target.value.toUpperCase())}
              placeholder="e.g. VRUMM50"
              className="font-mono font-bold uppercase"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Simulated Fare (₹)
            </label>
            <Input
              type="number"
              min="1"
              value={testFareRupees}
              onChange={(e) => setTestFareRupees(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#171717] dark:text-[#E2E8E4]">
              Vehicle Type
            </label>
            <select
              value={testVehicleType}
              onChange={(e) => setTestVehicleType(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[#E2E8E4] dark:border-[#2A322D] bg-[#FFFFFF] dark:bg-[#0B1510] text-[#171717] dark:text-[#F5F7F6] focus:outline-none focus:ring-2 focus:ring-[#A31C18]"
            >
              <option value="BIKE">BIKE (Two Wheeler)</option>
              <option value="AUTO">AUTO (Rickshaw)</option>
              <option value="CAB">CAB (Prime Sedan)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isValidating || !testCode.trim()}
            className="bg-[#171717] hover:bg-[#2A322D] text-white dark:bg-[#1FD88A] dark:text-[#06110C] dark:hover:bg-[#18B775]"
          >
            {isValidating ? 'Calculating...' : 'Run Simulation'}
          </Button>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-[#F87171]/40 bg-[#FBE9E8] dark:bg-[#2A0F0E] text-xs text-[#DC2626] dark:text-[#FF8A84]">
            {error}
          </div>
        )}

        {result && (
          <div
            className={`p-4 rounded-xl border ${
              result.valid
                ? 'bg-[#E6F9F0] border-[#0A7B44]/20 dark:bg-[#082015] dark:border-[#1FD88A]/30'
                : 'bg-[#FBE9E8] border-[#DC2626]/20 dark:bg-[#2A0F0E] dark:border-[#FF5A52]/30'
            } space-y-3 transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.valid ? (
                  <CheckCircle2 className="w-5 h-5 text-[#0A7B44] dark:text-[#1FD88A]" />
                ) : (
                  <XCircle className="w-5 h-5 text-[#DC2626] dark:text-[#FF5A52]" />
                )}
                <span className="font-bold text-sm text-[#171717] dark:text-white">
                  {result.valid ? 'Promo Code Eligible' : 'Ineligible Code'}
                </span>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/70 dark:bg-black/40">
                {result.code || testCode}
              </span>
            </div>

            {result.valid ? (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/5 dark:border-white/10 text-center">
                <div className="p-2 rounded bg-white/60 dark:bg-black/30">
                  <span className="text-[10px] uppercase font-mono text-[#667085] dark:text-[#9AA6A0] block">
                    Gross Fare
                  </span>
                  <span className="text-xs font-bold text-[#171717] dark:text-white">
                    ₹{testFareRupees}.00
                  </span>
                </div>
                <div className="p-2 rounded bg-white/60 dark:bg-black/30">
                  <span className="text-[10px] uppercase font-mono text-[#0A7B44] dark:text-[#1FD88A] block">
                    Discount
                  </span>
                  <span className="text-xs font-bold text-[#0A7B44] dark:text-[#1FD88A]">
                    - {formatPaise(result.discountAmountPaise)}
                  </span>
                </div>
                <div className="p-2 rounded bg-white/60 dark:bg-black/30">
                  <span className="text-[10px] uppercase font-mono text-[#667085] dark:text-[#9AA6A0] block">
                    Net Payable
                  </span>
                  <span className="text-xs font-bold text-[#171717] dark:text-white">
                    {formatPaise(result.finalFarePaise)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#DC2626] dark:text-[#FF8A84] leading-relaxed">
                {result.reason || 'Not applicable under current conditions.'}
              </p>
            )}
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
