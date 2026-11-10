import React, { useState, useMemo } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  formatPaise,
  parseRupeesToPaise,
  formatBasisPoints,
  parsePercentageToBasisPoints,
  formatKolkata,
} from '../../utils/formatters';
import { Calculator, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function CreateFareConfigDialog({
  open = false,
  onOpenChange,
  initialVehicleType = 'BIKE',
  currentVersion = 1,
  onConfirm,
}) {
  const user = useAuthStore((s) => s.user);

  const [vehicleType, setVehicleType] = useState(initialVehicleType);
  const [zone, setZone] = useState('mumbai');
  const [baseRupees, setBaseRupees] = useState(vehicleType === 'CAB' ? '60' : vehicleType === 'AUTO' ? '35' : '25');
  const [perKmRupees, setPerKmRupees] = useState(vehicleType === 'CAB' ? '22' : vehicleType === 'AUTO' ? '15' : '12');
  const [perMinRupees, setPerMinRupees] = useState(vehicleType === 'CAB' ? '2.5' : vehicleType === 'AUTO' ? '2.0' : '1.5');
  const [minFareRupees, setMinFareRupees] = useState(vehicleType === 'CAB' ? '80' : vehicleType === 'AUTO' ? '40' : '30');
  const [minDistanceKm, setMinDistanceKm] = useState('1.5');
  const [waitingGraceMin, setWaitingGraceMin] = useState('3');
  const [waitingChargeRupees, setWaitingChargeRupees] = useState('1.5');
  const [taxPercent, setTaxPercent] = useState('5.00'); // GST 5.00%
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().slice(0, 16));
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Live simulation of a sample 5km, 15min trip
  const sampleCalculation = useMemo(() => {
    const basePaise = parseRupeesToPaise(baseRupees || '0');
    const perKmPaise = parseRupeesToPaise(perKmRupees || '0');
    const perMinPaise = parseRupeesToPaise(perMinRupees || '0');
    const minFarePaise = parseRupeesToPaise(minFareRupees || '0');
    const taxBps = parsePercentageToBasisPoints(taxPercent || '0');

    const sampleDistanceKm = 5.0;
    const sampleDurationMin = 15;

    const distanceChargePaise = Math.round(sampleDistanceKm * perKmPaise);
    const timeChargePaise = Math.round(sampleDurationMin * perMinPaise);
    const subtotalPaise = Math.max(basePaise + distanceChargePaise + timeChargePaise, minFarePaise);
    const taxPaise = Math.round((subtotalPaise * taxBps) / 10000);
    const totalPaise = subtotalPaise + taxPaise;

    return {
      basePaise,
      distanceChargePaise,
      timeChargePaise,
      subtotalPaise,
      taxPaise,
      totalPaise,
    };
  }, [baseRupees, perKmRupees, perMinRupees, minFareRupees, taxPercent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!reason.trim() || reason.trim().length < 5) {
      setError('A written justification of at least 5 characters is required for audit logging.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        vehicleType,
        zone: zone.trim() || 'mumbai',
        effectiveFrom: new Date(effectiveFrom).toISOString(),
        baseFarePaise: parseRupeesToPaise(baseRupees),
        perKmPaise: parseRupeesToPaise(perKmRupees),
        perMinutePaise: parseRupeesToPaise(perMinRupees),
        minimumFarePaise: parseRupeesToPaise(minFareRupees),
        minimumBillableDistanceMetres: Math.round(parseFloat(minDistanceKm || '1.5') * 1000),
        waitingGracePeriodMinutes: parseInt(waitingGraceMin || '3', 10),
        waitingChargePerMinutePaise: parseRupeesToPaise(waitingChargeRupees || '0'),
        surgeEnabled: false,
        surgeMultiplierMax: 1.0,
        taxes: [
          {
            label: 'GST',
            basisPoints: parsePercentageToBasisPoints(taxPercent || '5.00'),
          },
        ],
        reason: reason.trim(),
      };

      await onConfirm(payload);
      onOpenChange?.(false);
    } catch (err) {
      setError(err?.message || 'Failed to create new fare config version.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[85vh] overflow-y-auto pr-1">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
              Versioned Tariff Release (v{currentVersion + 1})
            </span>
          </div>
          <DialogTitle>Deploy New Fare Version</DialogTitle>
          <DialogDescription>
            Tariff configurations are immutable and effective-dated. Active rides will maintain their pinned version.
          </DialogDescription>
        </DialogHeader>

        {/* Vehicle & Zone Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F6F5] mb-1">
              Vehicle Fleet
            </label>
            <select
              value={vehicleType}
              onChange={(e) => {
                const vt = e.target.value;
                setVehicleType(vt);
                if (vt === 'CAB') {
                  setBaseRupees('60');
                  setPerKmRupees('22');
                  setMinFareRupees('80');
                } else if (vt === 'AUTO') {
                  setBaseRupees('35');
                  setPerKmRupees('15');
                  setMinFareRupees('40');
                } else {
                  setBaseRupees('25');
                  setPerKmRupees('12');
                  setMinFareRupees('30');
                }
              }}
              className="w-full bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-xs text-[#171717] dark:text-[#F4F6F5] focus:outline-none focus:ring-2 focus:ring-[#A31C18]"
            >
              <option value="BIKE">BIKE (Two-Wheeler)</option>
              <option value="AUTO">AUTO (Three-Wheeler)</option>
              <option value="CAB">CAB (Four-Wheeler)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F6F5] mb-1">
              Cluster Zone
            </label>
            <input
              type="text"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-xs text-[#171717] dark:text-[#F4F6F5] focus:outline-none focus:ring-2 focus:ring-[#A31C18]"
              placeholder="mumbai"
            />
          </div>
        </div>

        {/* Numerical Tariff Inputs in INR ₹ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mb-1">
              Base Fare (₹)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={baseRupees}
              onChange={(e) => setBaseRupees(e.target.value)}
              className="w-full font-mono bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-[#171717] dark:text-[#F4F6F5] focus:ring-2 focus:ring-[#A31C18]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mb-1">
              Rate per Km (₹)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={perKmRupees}
              onChange={(e) => setPerKmRupees(e.target.value)}
              className="w-full font-mono bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-[#171717] dark:text-[#F4F6F5] focus:ring-2 focus:ring-[#A31C18]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mb-1">
              Rate per Min (₹)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={perMinRupees}
              onChange={(e) => setPerMinRupees(e.target.value)}
              className="w-full font-mono bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-[#171717] dark:text-[#F4F6F5] focus:ring-2 focus:ring-[#A31C18]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mb-1">
              Min Fare (₹)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={minFareRupees}
              onChange={(e) => setMinFareRupees(e.target.value)}
              className="w-full font-mono bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-[#171717] dark:text-[#F4F6F5] focus:ring-2 focus:ring-[#A31C18]"
            />
          </div>
        </div>

        {/* Secondary Parameters (Min Distance, Waiting, GST) */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mb-1">
              Base Distance (km)
            </label>
            <input
              type="number"
              step="0.1"
              value={minDistanceKm}
              onChange={(e) => setMinDistanceKm(e.target.value)}
              className="w-full font-mono bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-[#171717] dark:text-[#F4F6F5]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mb-1">
              GST / Taxes (%)
            </label>
            <input
              type="number"
              step="0.25"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              className="w-full font-mono bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-[#171717] dark:text-[#F4F6F5]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mb-1">
              Effective Date/Time
            </label>
            <input
              type="datetime-local"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              className="w-full bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-2.5 py-2 text-[11px] text-[#171717] dark:text-[#F4F6F5]"
            />
          </div>
        </div>

        {/* Live Calculation Preview Card */}
        <div className="p-3.5 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#15803D] dark:text-[#1FD88A]">
              <Calculator className="w-4 h-4" />
              Live Tariff Simulation (5.0 km • 15 min ride)
            </span>
            <span className="font-mono text-sm font-black text-[#171717] dark:text-[#F4F6F5]">
              {formatPaise(sampleCalculation.totalPaise)}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-[11px] font-mono text-[#5E6A64] dark:text-[#9AA6A0] pt-1 border-t border-[#E2E8E4] dark:border-[#2A322D]">
            <div>Base: {formatPaise(sampleCalculation.basePaise)}</div>
            <div>Distance: {formatPaise(sampleCalculation.distanceChargePaise)}</div>
            <div>Time: {formatPaise(sampleCalculation.timeChargePaise)}</div>
            <div>GST: {formatPaise(sampleCalculation.taxPaise)}</div>
          </div>
        </div>

        {/* Mandatory Reason for Audit */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#171717] dark:text-[#F4F6F5]">
            Operational Justification (Audit Log) <span className="text-[#DC2626] dark:text-[#FF5A52]">*</span>
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this tariff revision is required (e.g. state fuel index revision, MMRTA guideline alignment)..."
            className="w-full bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl p-2.5 text-xs text-[#171717] dark:text-[#F4F6F5] focus:outline-none focus:ring-2 focus:ring-[#A31C18]"
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/30 text-xs text-[#DC2626] dark:text-[#FF5A52] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange?.(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            size="sm"
            isLoading={isSubmitting}
            disabled={isSubmitting || reason.trim().length < 5}
          >
            Deploy v{currentVersion + 1}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
