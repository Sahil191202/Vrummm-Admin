import React, { useState, useEffect, useCallback } from 'react';
import {
  Award,
  Zap,
  Clock,
  Calendar,
  Users,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { incentiveService } from '../services/incentiveService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/ui/error-state';
import { EmptyState } from '../components/ui/empty-state';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PERMISSIONS } from '../contracts/rbac';
import { formatPaise, formatKolkata } from '../utils/formatters';
import { useToast } from '../components/ui/toast';
import { CreateIncentiveDialog } from '../components/incentives/CreateIncentiveDialog';

const TARGET_TYPE_TABS = [
  { id: 'ALL', label: 'All Campaigns' },
  { id: 'PEAK_HOUR', label: 'Peak Hour Boost' },
  { id: 'DAILY_RIDES', label: 'Daily Targets' },
  { id: 'WEEKLY_RIDES', label: 'Weekly Marathon' },
  { id: 'REFERRAL', label: 'Referrals' },
];

export function IncentivesPage() {
  const { addToast } = useToast();

  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [targetTypeFilter, setTargetTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await incentiveService.listCampaigns({
        targetType: targetTypeFilter === 'ALL' ? undefined : targetTypeFilter,
        isActive: statusFilter === 'ALL' ? undefined : statusFilter === 'ACTIVE',
      });
      setCampaigns(res.campaigns || []);
    } catch (err) {
      setError(err);
      addToast({
        title: 'Failed to load incentive campaigns',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [targetTypeFilter, statusFilter, addToast]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const handleCreated = async (payload) => {
    await incentiveService.createCampaign(payload);
    addToast({
      title: 'Incentive Campaign Deployed',
      description: `Incentive campaign '${payload.name}' deployed to driver network.`,
      variant: 'default',
    });
    loadCampaigns();
  };

  const activeCount = campaigns.filter((c) => c.isActive).length;
  const totalCompleted = campaigns.reduce((sum, c) => sum + (c.completedCount || 0), 0);
  const totalRewardOutflowPaise = campaigns.reduce(
    (sum, c) => sum + (c.completedCount || 0) * (c.rewardAmountPaise || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717] dark:text-[#F5F7F6] flex items-center gap-2">
            <Award className="w-6 h-6 text-[#A31C18]" />
            Captain Incentives & Rewards
          </h1>
          <p className="text-sm text-[#667085] dark:text-[#9AA6A0] mt-1">
            Design performance milestones, peak-hour multipliers, and supply retention programs for Mumbai captains.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCampaigns}
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <PermissionGuard requiredPermission={PERMISSIONS.PROMOTIONS_WRITE}>
            <Button
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              className="bg-[#A31C18] hover:bg-[#851613] text-white flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create Incentive Campaign
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-[#667085] dark:text-[#9AA6A0]">
                Active Campaigns
              </p>
              <h3 className="text-2xl font-bold text-[#171717] dark:text-[#F5F7F6] mt-1">
                {isLoading ? <Skeleton className="h-8 w-16" /> : activeCount}
              </h3>
              <p className="text-[11px] text-[#0A7B44] dark:text-[#1FD88A] mt-0.5">
                Live performance tracks
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#E6F9F0] dark:bg-[#082015] text-[#0A7B44] dark:text-[#1FD88A]">
              <Zap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-[#667085] dark:text-[#9AA6A0]">
                Driver Milestones Hit
              </p>
              <h3 className="text-2xl font-bold text-[#171717] dark:text-[#F5F7F6] mt-1">
                {isLoading ? <Skeleton className="h-8 w-20" /> : totalCompleted.toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5">
                Eligible reward claims
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1510] text-[#171717] dark:text-[#F5F7F6]">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-[#667085] dark:text-[#9AA6A0]">
                Total Rewards Disbursed
              </p>
              <h3 className="text-2xl font-bold text-[#0A7B44] dark:text-[#1FD88A] mt-1">
                {isLoading ? <Skeleton className="h-8 w-28" /> : formatPaise(totalRewardOutflowPaise)}
              </h3>
              <p className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5">
                Paid to captain earnings ledger
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#E6F9F0] dark:bg-[#082015] text-[#0A7B44] dark:text-[#1FD88A]">
              <Award className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#E2E8E4] dark:border-[#2A322D] pb-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {TARGET_TYPE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTargetTypeFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                targetTypeFilter === tab.id
                  ? 'bg-[#171717] text-white dark:bg-[#1FD88A] dark:text-[#06110C]'
                  : 'text-[#667085] dark:text-[#9AA6A0] hover:bg-[#F5F7F6] dark:hover:bg-[#0B1510]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex rounded-lg border border-[#E2E8E4] dark:border-[#2A322D] p-0.5 bg-[#F5F7F6] dark:bg-[#0B1510] text-xs">
            {['ALL', 'ACTIVE', 'INACTIVE'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-white dark:bg-[#171717] text-[#171717] dark:text-white shadow-sm'
                    : 'text-[#667085] dark:text-[#9AA6A0]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={loadCampaigns} />
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="No incentive campaigns found"
          description="No driver incentive programs match the selected filters."
          actionLabel="Create Incentive"
          onAction={() => setCreateDialogOpen(true)}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#06110C]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8E4] dark:border-[#2A322D] bg-[#F5F7F6] dark:bg-[#0B1510] text-[#667085] dark:text-[#9AA6A0] uppercase font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Campaign Name</th>
                <th className="py-3 px-4 font-semibold">Target Category</th>
                <th className="py-3 px-4 font-semibold">Milestone Target</th>
                <th className="py-3 px-4 font-semibold">Reward Payout</th>
                <th className="py-3 px-4 font-semibold">Drivers Reached</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Valid Until (IST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E4] dark:divide-[#2A322D]">
              {campaigns.map((camp) => (
                <tr
                  key={camp._id}
                  className="hover:bg-[#F5F7F6]/50 dark:hover:bg-[#0B1510]/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-sm text-[#171717] dark:text-white">
                      {camp.name}
                    </div>
                    <div className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5 max-w-sm">
                      {camp.description || camp.reason}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {camp.targetType}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-[#171717] dark:text-white">
                    {camp.targetCount} {camp.targetType === 'REFERRAL' ? 'referrals' : 'rides'}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-sm text-[#0A7B44] dark:text-[#1FD88A]">
                    {formatPaise(camp.rewardAmountPaise)}
                  </td>

                  <td className="py-3 px-4 font-mono text-[#171717] dark:text-white">
                    {camp.completedCount || 0} claims
                  </td>

                  <td className="py-3 px-4">
                    <Badge variant={camp.isActive ? 'success' : 'secondary'}>
                      {camp.isActive ? 'ACTIVE' : 'ARCHIVED'}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-[#667085] dark:text-[#9AA6A0]">
                    {formatKolkata(camp.expiresAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog */}
      <CreateIncentiveDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={handleCreated}
      />
    </div>
  );
}
