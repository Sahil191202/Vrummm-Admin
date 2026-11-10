import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { fareService } from '../services/fareService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/ui/error-state';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PERMISSIONS } from '../contracts/rbac';
import {
  formatPaise,
  parseRupeesToPaise,
  formatBasisPoints,
  parsePercentageToBasisPoints,
  formatKolkata,
} from '../utils/formatters';
import { useToast } from '../components/ui/toast';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';

export function RevenuePlansPage() {
  const { addToast } = useToast();

  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create Plan Dialog State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanType, setNewPlanType] = useState('COMMISSION');
  const [newCommissionPercent, setNewCommissionPercent] = useState('15.00');
  const [newFixedFeeRupees, setNewFixedFeeRupees] = useState('0');
  const [newBillingCycle, setNewBillingCycle] = useState('PER_RIDE');
  const [newDescription, setNewDescription] = useState('');
  const [newReason, setNewReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fareService.listRevenuePlans();
      setPlans(res.plans || []);
    } catch (err) {
      setError(err);
      addToast({
        title: 'Failed to load revenue plans',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!newReason.trim() || newReason.trim().length < 5) {
      addToast({
        title: 'Validation Error',
        description: 'A written justification of at least 5 characters is required for audit logging.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await fareService.createRevenuePlan({
        name: newPlanName.trim(),
        type: newPlanType,
        commissionBasisPoints:
          newPlanType === 'COMMISSION'
            ? parsePercentageToBasisPoints(newCommissionPercent)
            : 0,
        fixedFeePaise:
          newPlanType === 'SUBSCRIPTION'
            ? parseRupeesToPaise(newFixedFeeRupees)
            : 0,
        billingCycle: newBillingCycle,
        description: newDescription.trim(),
        reason: newReason.trim(),
      });

      addToast({
        title: 'Revenue Plan Deployed',
        description: 'New monetization tier registered and logged for compliance audit.',
        variant: 'success',
      });

      setCreateDialogOpen(false);
      setNewPlanName('');
      setNewDescription('');
      setNewReason('');
      loadPlans();
    } catch (err) {
      addToast({
        title: 'Deployment Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8E4] dark:border-[#2A322D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#1FD88A]">
              Platform Monetization & Economics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F6F5]">
            Revenue & Commission Plans
          </h1>
          <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
            Manage versioned driver take-rates, zero-commission daily passes, and subscription billing tiers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadPlans}
            disabled={isLoading}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <PermissionGuard permission={PERMISSIONS.REVENUE_PLANS_WRITE}>
            <Button
              variant="default"
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-4 h-4" />
              New Plan Version
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Model Philosophy Banner */}
      <div className="p-4 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] flex items-start gap-3">
        <Layers className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A] flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-[#171717] dark:text-[#F4F6F5]">
            Basis Points & Dual Monetization Economics
          </span>
          <p className="text-[#5E6A64] dark:text-[#9AA6A0] leading-relaxed">
            All percentages are represented in integer basis points (<code className="font-mono">100 bps = 1.00%</code>, <code className="font-mono">1500 bps = 15.00%</code>). Vrumm supports both transactional take-rates and flat-rate subscription passes (e.g. ₹49 daily pass for auto captains).
          </p>
        </div>
      </div>

      {/* Plans List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to load revenue plans"
          message={error.message}
          code={error.code}
          onRetry={loadPlans}
        />
      ) : plans.length === 0 ? (
        <div className="text-center py-12 text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
          No revenue plans found. Click "New Plan Version" to deploy a plan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan._id}
              className={`p-5 flex flex-col justify-between space-y-4 transition-all ${
                plan.isActive
                  ? 'border-[#15803D]/40 bg-white dark:bg-[#171717] shadow-sm'
                  : 'border-[#E2E8E4] dark:border-[#2A322D] opacity-75 bg-[#F5F7F6]/50 dark:bg-[#06110C]/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
                      {plan.billingCycle} • {plan.type}
                    </span>
                    <h3 className="text-base font-bold text-[#171717] dark:text-[#F4F6F5] mt-0.5">
                      {plan.name}
                    </h3>
                  </div>
                  {plan.isActive ? (
                    <Badge variant="success">ACTIVE TIER</Badge>
                  ) : (
                    <Badge variant="secondary">HISTORICAL (RETIRED)</Badge>
                  )}
                </div>

                <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] mt-2 leading-relaxed">
                  {plan.description}
                </p>

                {/* Economics Box */}
                <div className="mt-4 p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5E6A64] dark:text-[#9AA6A0] block">
                      Platform Take-Rate
                    </span>
                    <span className="text-xl font-mono font-black text-[#171717] dark:text-[#F4F6F5]">
                      {formatBasisPoints(plan.commissionBasisPoints)}
                    </span>
                  </div>

                  {plan.fixedFeePaise > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#5E6A64] dark:text-[#9AA6A0] block">
                        Subscription Fee
                      </span>
                      <span className="text-xl font-mono font-black text-[#15803D] dark:text-[#1FD88A]">
                        {formatPaise(plan.fixedFeePaise)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Details */}
              <div className="pt-3 border-t border-[#E2E8E4] dark:border-[#2A322D] text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span>Effective From: {formatKolkata(plan.effectiveFrom, 'dateOnly')}</span>
                  {plan.effectiveTo && <span>To: {formatKolkata(plan.effectiveTo, 'dateOnly')}</span>}
                </div>
                {plan.reason && (
                  <div>
                    <strong>Justification:</strong> {plan.reason}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Plan Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A]">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
                Deploy Monetization Tier
              </span>
            </div>
            <DialogTitle>Create Revenue Plan Version</DialogTitle>
            <DialogDescription>
              All commission rates are expressed in basis points. Plan modifications are versioned and logged.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#171717] dark:text-[#F4F6F5] mb-1">
                Plan Name
              </label>
              <input
                type="text"
                required
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="e.g. Peak Surge Monsoon Pass"
                className="w-full bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-[#171717] dark:text-[#F4F6F5] focus:outline-none focus:ring-2 focus:ring-[#A31C18]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#171717] dark:text-[#F4F6F5] mb-1">
                  Model Type
                </label>
                <select
                  value={newPlanType}
                  onChange={(e) => setNewPlanType(e.target.value)}
                  className="w-full bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-[#171717] dark:text-[#F4F6F5]"
                >
                  <option value="COMMISSION">COMMISSION (Per-Ride %)</option>
                  <option value="SUBSCRIPTION">SUBSCRIPTION (Flat Pass)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#171717] dark:text-[#F4F6F5] mb-1">
                  Billing Cycle
                </label>
                <select
                  value={newBillingCycle}
                  onChange={(e) => setNewBillingCycle(e.target.value)}
                  className="w-full bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-[#171717] dark:text-[#F4F6F5]"
                >
                  <option value="PER_RIDE">PER_RIDE</option>
                  <option value="DAILY">DAILY (24hr)</option>
                  <option value="WEEKLY">WEEKLY (7 days)</option>
                  <option value="MONTHLY">MONTHLY (30 days)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {newPlanType === 'COMMISSION' ? (
                <div>
                  <label className="block font-semibold text-[#171717] dark:text-[#F4F6F5] mb-1">
                    Take-Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={newCommissionPercent}
                    onChange={(e) => setNewCommissionPercent(e.target.value)}
                    className="w-full font-mono bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-[#171717] dark:text-[#F4F6F5]"
                  />
                  <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5 block">
                    = {parsePercentageToBasisPoints(newCommissionPercent)} basis points
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-[#171717] dark:text-[#F4F6F5] mb-1">
                    Pass Fee (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={newFixedFeeRupees}
                    onChange={(e) => setNewFixedFeeRupees(e.target.value)}
                    className="w-full font-mono bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-[#171717] dark:text-[#F4F6F5]"
                  />
                  <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5 block">
                    = {parseRupeesToPaise(newFixedFeeRupees)} integer paise
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#171717] dark:text-[#F4F6F5] mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Operational purpose of this monetization tier..."
                className="w-full bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl p-2 text-[#171717] dark:text-[#F4F6F5]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#171717] dark:text-[#F4F6F5] mb-1">
                Written Justification (Audit Log) <span className="text-[#DC2626] dark:text-[#FF5A52]">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="State the business rationale for introducing this revenue tier..."
                className="w-full bg-white dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl p-2 text-[#171717] dark:text-[#F4F6F5]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              isLoading={isSubmitting}
              disabled={isSubmitting || newReason.trim().length < 5 || !newPlanName.trim()}
            >
              Deploy Plan
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
