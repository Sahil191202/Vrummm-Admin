import React, { useState, useEffect, useCallback } from 'react';
import {
  Tag,
  Percent,
  Sparkles,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { promotionService } from '../services/promotionService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/ui/error-state';
import { EmptyState } from '../components/ui/empty-state';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PERMISSIONS } from '../contracts/rbac';
import { formatPaise, formatKolkata } from '../utils/formatters';
import { useToast } from '../components/ui/toast';
import { CreatePromotionDialog } from '../components/promotions/CreatePromotionDialog';
import { ValidatePromotionModal } from '../components/promotions/ValidatePromotionModal';

export function PromotionsPage() {
  const { addToast } = useToast();

  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [validatorOpen, setValidatorOpen] = useState(false);
  const [activeTestCode, setActiveTestCode] = useState('VRUMM50');

  const loadPromotions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await promotionService.listPromotions({
        isActive: statusFilter === 'ALL' ? undefined : statusFilter === 'ACTIVE',
        search: search.trim() || undefined,
      });
      setPromotions(res.promotions || []);
    } catch (err) {
      setError(err);
      addToast({
        title: 'Failed to load promotions',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search, addToast]);

  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  const handleCreated = async (payload) => {
    await promotionService.createPromotion(payload);
    addToast({
      title: 'Promotion Code Deployed',
      description: `Promo code '${payload.code}' has been deployed to the Mumbai cluster.`,
      variant: 'default',
    });
    loadPromotions();
  };

  const handleOpenValidator = (code = 'VRUMM50') => {
    setActiveTestCode(code);
    setValidatorOpen(true);
  };

  // Stats calculation
  const activeCount = promotions.filter((p) => p.isActive).length;
  const totalRedemptions = promotions.reduce((sum, p) => sum + (p.currentRedemptions || 0), 0);
  const totalDisbursedPaise = promotions.reduce((sum, p) => {
    const avgDiscount = p.discountType === 'FLAT' ? p.discountValue : (p.maxDiscountPaise || 4000);
    return sum + (p.currentRedemptions || 0) * avgDiscount;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717] dark:text-[#F5F7F6] flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#A31C18]" />
            Customer Promotions & Promo Codes
          </h1>
          <p className="text-sm text-[#667085] dark:text-[#9AA6A0] mt-1">
            Author and manage rider discount codes, caps in paise, vehicle restrictions, and validity windows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenValidator()}
            className="flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#0A7B44] dark:text-[#1FD88A]" />
            Test Promo Code
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={loadPromotions}
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
              Deploy New Code
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
                Eligible for instant checkout apply
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#E6F9F0] dark:bg-[#082015] text-[#0A7B44] dark:text-[#1FD88A]">
              <Tag className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-[#667085] dark:text-[#9AA6A0]">
                Total Redemptions
              </p>
              <h3 className="text-2xl font-bold text-[#171717] dark:text-[#F5F7F6] mt-1">
                {isLoading ? <Skeleton className="h-8 w-24" /> : totalRedemptions.toLocaleString('en-IN')}
              </h3>
              <p className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5">
                Completed discount trips
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1510] text-[#171717] dark:text-[#F5F7F6]">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-[#667085] dark:text-[#9AA6A0]">
                Estimated Discount Disbursed
              </p>
              <h3 className="text-2xl font-bold text-[#A31C18] mt-1">
                {isLoading ? <Skeleton className="h-8 w-28" /> : formatPaise(totalDisbursedPaise)}
              </h3>
              <p className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5">
                Subsidized marketing budget
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[#A31C18]">
              <Percent className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#06110C]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA6A0]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search promo code or description..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
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

      {/* Main Content / Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState error={error} onRetry={loadPromotions} />
      ) : promotions.length === 0 ? (
        <EmptyState
          title="No promotions found"
          description={search ? `No promo codes match '${search}'.` : 'No promotional campaigns deployed yet.'}
          actionLabel="Deploy First Code"
          onAction={() => setCreateDialogOpen(true)}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#06110C]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8E4] dark:border-[#2A322D] bg-[#F5F7F6] dark:bg-[#0B1510] text-[#667085] dark:text-[#9AA6A0] uppercase font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Promo Code</th>
                <th className="py-3 px-4 font-semibold">Discount Rule</th>
                <th className="py-3 px-4 font-semibold">Min Fare / Cap</th>
                <th className="py-3 px-4 font-semibold">Vehicle Types</th>
                <th className="py-3 px-4 font-semibold">Redemptions</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Expiry (IST)</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E4] dark:divide-[#2A322D]">
              {promotions.map((promo) => (
                <tr
                  key={promo._id}
                  className="hover:bg-[#F5F7F6]/50 dark:hover:bg-[#0B1510]/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-sm text-[#171717] dark:text-white">
                      {promo.code}
                    </div>
                    {promo.firstRideOnly && (
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#A31C18] dark:text-[#FF8A84] bg-[#FBE9E8] dark:bg-[#2A0F0E] px-1.5 py-0.2 rounded">
                        First Ride Only
                      </span>
                    )}
                    <div className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5 max-w-xs truncate">
                      {promo.description || promo.reason}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#171717] dark:text-white">
                      {promo.discountType === 'PERCENTAGE'
                        ? `${promo.discountValue}% OFF`
                        : `${formatPaise(promo.discountValue)} FLAT`}
                    </span>
                    <span className="block text-[11px] text-[#667085] dark:text-[#9AA6A0]">
                      {promo.discountType}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <div className="text-[#171717] dark:text-white">
                      Min: {formatPaise(promo.minRideFarePaise || 0)}
                    </div>
                    <div className="text-[11px] text-[#667085] dark:text-[#9AA6A0]">
                      Cap: {promo.maxDiscountPaise ? formatPaise(promo.maxDiscountPaise) : 'No cap'}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {(promo.allowedVehicleTypes || ['BIKE', 'AUTO', 'CAB']).map((v) => (
                        <span
                          key={v}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#F5F7F6] dark:bg-[#0B1510] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#E2E8E4]"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#171717] dark:text-white font-mono">
                      {promo.currentRedemptions || 0}
                    </span>
                    <span className="text-[11px] text-[#667085] dark:text-[#9AA6A0]">
                      {promo.maxTotalRedemptions ? ` / ${promo.maxTotalRedemptions}` : ' (unlimited)'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <Badge variant={promo.isActive ? 'success' : 'secondary'}>
                      {promo.isActive ? 'ACTIVE' : 'EXPIRED'}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-[#667085] dark:text-[#9AA6A0]">
                    {formatKolkata(promo.expiresAt)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenValidator(promo.code)}
                      className="text-xs h-8 px-2 text-[#0A7B44] dark:text-[#1FD88A] hover:bg-[#E6F9F0] dark:hover:bg-[#082015]"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Test
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreatePromotionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreated={handleCreated}
      />

      <ValidatePromotionModal
        open={validatorOpen}
        onOpenChange={setValidatorOpen}
        initialCode={activeTestCode}
      />
    </div>
  );
}
