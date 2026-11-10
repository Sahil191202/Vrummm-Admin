import React, { useState, useEffect, useCallback } from 'react';
import {
  Banknote,
  Sliders,
  Compass,
  Plus,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  History,
  CheckCircle2,
  Calendar,
  Layers,
  Save,
  HelpCircle,
} from 'lucide-react';
import { fareService } from '../services/fareService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/ui/error-state';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PERMISSIONS } from '../contracts/rbac';
import {
  formatPaise,
  formatBasisPoints,
  formatKolkata,
} from '../utils/formatters';
import { useToast } from '../components/ui/toast';
import { CreateFareConfigDialog } from '../components/fares/CreateFareConfigDialog';
import { RelativeDistanceSimulator } from '../components/fares/RelativeDistanceSimulator';
import { ConfirmWithReasonDialog } from '../components/common/ConfirmWithReasonDialog';

export function FaresPage() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('tariffs');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');

  // Tariffs State
  const [configs, setConfigs] = useState([]);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);
  const [configsError, setConfigsError] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Dispatch Settings State
  const [dispatchSettings, setDispatchSettings] = useState(null);
  const [isLoadingDispatch, setIsLoadingDispatch] = useState(true);
  const [dispatchError, setDispatchError] = useState(null);
  const [saveDispatchDialogOpen, setSaveDispatchDialogOpen] = useState(false);

  // Fetch Tariffs
  const loadTariffs = useCallback(async () => {
    setIsLoadingConfigs(true);
    setConfigsError(null);
    try {
      const res = await fareService.listFareConfigs({ vehicleType: vehicleFilter });
      setConfigs(res.configs || []);
    } catch (err) {
      setConfigsError(err);
      addToast({
        title: 'Failed to load fare configs',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingConfigs(false);
    }
  }, [vehicleFilter, addToast]);

  // Fetch Dispatch Settings
  const loadDispatchSettings = useCallback(async () => {
    setIsLoadingDispatch(true);
    setDispatchError(null);
    try {
      const res = await fareService.getDispatchSettings();
      setDispatchSettings(res.settings);
    } catch (err) {
      setDispatchError(err);
    } finally {
      setIsLoadingDispatch(false);
    }
  }, []);

  useEffect(() => {
    loadTariffs();
  }, [loadTariffs]);

  useEffect(() => {
    loadDispatchSettings();
  }, [loadDispatchSettings]);

  // Create new fare version handler
  const handleCreateVersion = async (payload) => {
    try {
      await fareService.createFareConfig(payload);
      addToast({
        title: 'Fare Config Version Deployed',
        description: `Version deployed for ${payload.vehicleType} in zone ${payload.zone}. Historical rides remain pinned.`,
        variant: 'success',
      });
      loadTariffs();
    } catch (err) {
      addToast({
        title: 'Deployment Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Save dispatch tunables handler
  const handleSaveDispatchTunables = async ({ reason }) => {
    try {
      await fareService.updateDispatchSettings({ ...dispatchSettings, reason });
      addToast({
        title: 'Dispatch Settings Updated',
        description: 'New radius & offer thresholds applied to dispatch engine.',
        variant: 'success',
      });
      setSaveDispatchDialogOpen(false);
      loadDispatchSettings();
    } catch (err) {
      addToast({
        title: 'Update Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8E4] dark:border-[#2A322D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A]">
              <Banknote className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#1FD88A]">
              Tariff & Engine Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F6F5]">
            Fare & Dispatch Settings
          </h1>
          <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
            Manage versioned base tariffs, search radiuses, and the experimental relative-distance dispatch rule.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadTariffs();
              loadDispatchSettings();
            }}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>

          <PermissionGuard permission={PERMISSIONS.FARES_WRITE}>
            <Button
              variant="default"
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Plus className="w-4 h-4" />
              New Fare Version
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tariffs">Fare Configurations</TabsTrigger>
          <TabsTrigger value="dispatch">Dispatch & Radius Tunables</TabsTrigger>
          <TabsTrigger value="rules">Relative-Distance Rule (Rule B)</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: FARE CONFIGS (VERSIONED & EFFECTIVE-DATED) --- */}
        <TabsContent value="tariffs" className="space-y-6">
          {/* Pinned Fare Banner Notice */}
          <div className="p-3.5 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] flex items-start gap-3">
            <Layers className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A] flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-[#171717] dark:text-[#F4F6F5]">
                Version Pinned & Effective-Dated Architecture
              </span>
              <p className="text-[#5E6A64] dark:text-[#9AA6A0] leading-relaxed">
                When a ride is booked, the exact fare configuration version is pinned to the booking record. Any tariff modification creates an immutable new version, ensuring historical rides are never retroactively altered.
              </p>
            </div>
          </div>

          {/* Vehicle Type Filter Bar */}
          <div className="flex items-center gap-2">
            {['ALL', 'BIKE', 'AUTO', 'CAB'].map((vt) => (
              <button
                key={vt}
                onClick={() => setVehicleFilter(vt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  vehicleFilter === vt
                    ? 'bg-[#A31C18] text-white shadow-button-glow glow-button'
                    : 'bg-white dark:bg-[#171717] text-[#5E6A64] dark:text-[#9AA6A0] border border-[#E2E8E4] dark:border-[#2A322D] hover:bg-[#F5F7F6]'
                }`}
              >
                {vt}
              </button>
            ))}
          </div>

          {/* Configs List */}
          {isLoadingConfigs ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
          ) : configsError ? (
            <ErrorState
              title="Failed to load fare configs"
              message={configsError.message}
              code={configsError.code}
              onRetry={loadTariffs}
            />
          ) : configs.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
              No fare configurations found for the selected vehicle filter.
            </div>
          ) : (
            <div className="space-y-4">
              {configs.map((cfg) => (
                <Card
                  key={cfg._id}
                  className={`p-5 transition-all ${
                    cfg.isActive
                      ? 'border-[#15803D]/40 bg-white dark:bg-[#171717] shadow-sm'
                      : 'border-[#E2E8E4] dark:border-[#2A322D] opacity-75 bg-[#F5F7F6]/50 dark:bg-[#06110C]/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8E4] dark:border-[#2A322D]">
                    <div className="flex items-center gap-2.5">
                      <Badge variant="forest" className="font-mono">
                        {cfg.vehicleType}
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        Zone: {cfg.zone}
                      </Badge>
                      <span className="font-mono font-bold text-xs text-[#171717] dark:text-[#F4F6F5]">
                        Version {cfg.version}
                      </span>
                      {cfg.isActive ? (
                        <Badge variant="success">CURRENT ACTIVE</Badge>
                      ) : (
                        <Badge variant="secondary">HISTORICAL (PINNED)</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#5E6A64] dark:text-[#9AA6A0]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Effective: {formatKolkata(cfg.effectiveFrom, 'dateOnly')}</span>
                      {cfg.effectiveTo && (
                        <span>→ {formatKolkata(cfg.effectiveTo, 'dateOnly')}</span>
                      )}
                    </div>
                  </div>

                  {/* Tariff Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 py-4 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D]">
                      <span className="text-[10px] uppercase font-sans text-[#5E6A64] dark:text-[#9AA6A0] block">
                        Base Fare
                      </span>
                      <strong className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5]">
                        {formatPaise(cfg.baseFarePaise)}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D]">
                      <span className="text-[10px] uppercase font-sans text-[#5E6A64] dark:text-[#9AA6A0] block">
                        Rate per Km
                      </span>
                      <strong className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5]">
                        {formatPaise(cfg.perKmPaise)}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D]">
                      <span className="text-[10px] uppercase font-sans text-[#5E6A64] dark:text-[#9AA6A0] block">
                        Rate per Min
                      </span>
                      <strong className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5]">
                        {formatPaise(cfg.perMinutePaise)}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D]">
                      <span className="text-[10px] uppercase font-sans text-[#5E6A64] dark:text-[#9AA6A0] block">
                        Minimum Fare
                      </span>
                      <strong className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5]">
                        {formatPaise(cfg.minimumFarePaise)}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D]">
                      <span className="text-[10px] uppercase font-sans text-[#5E6A64] dark:text-[#9AA6A0] block">
                        Min Distance
                      </span>
                      <strong className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5]">
                        {((cfg.minimumBillableDistanceMetres || 1500) / 1000).toFixed(1)} km
                      </strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D]">
                      <span className="text-[10px] uppercase font-sans text-[#5E6A64] dark:text-[#9AA6A0] block">
                        Taxes / GST
                      </span>
                      <strong className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5]">
                        {formatBasisPoints(cfg.taxes?.[0]?.basisPoints || 500)}
                      </strong>
                    </div>
                  </div>

                  {/* Audit Justification */}
                  {cfg.reason && (
                    <div className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] pt-2 border-t border-[#E2E8E4] dark:border-[#2A322D] flex items-center justify-between">
                      <span>
                        <strong>Audit Reason:</strong> {cfg.reason}
                      </span>
                      <span className="font-mono">
                        Author: {cfg.createdBy?.displayName || 'Super Admin'}
                      </span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* --- TAB 2: DISPATCH & RADIUS SETTINGS --- */}
        <TabsContent value="dispatch" className="space-y-6">
          <Card className="p-5">
            <CardHeader className="p-0 pb-4 border-b border-[#E2E8E4] dark:border-[#2A322D]">
              <CardTitle className="text-base">Search Radius & Dispatch Tuning Parameters</CardTitle>
              <CardDescription>
                Configure candidate search radii, step expansions, and offer timeouts across vehicle categories.
              </CardDescription>
            </CardHeader>

            {isLoadingDispatch ? (
              <div className="py-8 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : dispatchSettings ? (
              <div className="space-y-6 pt-5">
                {/* Initial Search Radius per Vehicle */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
                    1. Initial Pickup Radius (Metres)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['BIKE', 'AUTO', 'CAB'].map((vt) => (
                      <div
                        key={vt}
                        className="p-3 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] bg-[#F5F7F6] dark:bg-[#0B1A13]"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[#171717] dark:text-[#F4F6F5] mb-1">
                          <span>{vt} Radius</span>
                          <span className="font-mono">{dispatchSettings.initialRadiusMetres?.[vt] || 2500}m</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="6000"
                          step="250"
                          value={dispatchSettings.initialRadiusMetres?.[vt] || 2500}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setDispatchSettings((prev) => ({
                              ...prev,
                              initialRadiusMetres: { ...prev.initialRadiusMetres, [vt]: val },
                            }));
                          }}
                          className="w-full accent-[#A31C18]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maximum Radius & Expansion Steps */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
                    2. Maximum Extended Radius & Expansion Increment
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['BIKE', 'AUTO', 'CAB'].map((vt) => (
                      <div
                        key={vt}
                        className="p-3 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] bg-[#F5F7F6] dark:bg-[#0B1A13] space-y-2 text-xs"
                      >
                        <span className="font-bold text-[#171717] dark:text-[#F4F6F5] block">{vt} Extended Bounds</span>
                        <div className="flex justify-between text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
                          <span>Expansion Step:</span>
                          <span className="font-mono font-bold text-[#171717] dark:text-[#F4F6F5]">
                            +{dispatchSettings.radiusExpansionMetres?.[vt] || 1000}m
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
                          <span>Max Radius:</span>
                          <span className="font-mono font-bold text-[#171717] dark:text-[#F4F6F5]">
                            {dispatchSettings.maxRadiusMetres?.[vt] || 6000}m
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Offer Timeouts & Rounds */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] text-xs space-y-1">
                    <span className="text-[#5E6A64] dark:text-[#9AA6A0] block">Offer Duration</span>
                    <strong className="text-lg font-bold font-mono text-[#171717] dark:text-[#F4F6F5]">
                      {dispatchSettings.offerDurationSeconds || 10} seconds
                    </strong>
                    <p className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0]">
                      Captain offer acceptance countdown before re-dispatching.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] text-xs space-y-1">
                    <span className="text-[#5E6A64] dark:text-[#9AA6A0] block">Max Dispatch Rounds</span>
                    <strong className="text-lg font-bold font-mono text-[#171717] dark:text-[#F4F6F5]">
                      {dispatchSettings.maxRounds || 3} rounds
                    </strong>
                    <p className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0]">
                      Total search attempts before transitioning to NO_CAPTAIN.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] text-xs space-y-1">
                    <span className="text-[#5E6A64] dark:text-[#9AA6A0] block">Scheduled Window</span>
                    <strong className="text-lg font-bold font-mono text-[#171717] dark:text-[#F4F6F5]">
                      {dispatchSettings.scheduledDispatchWindowMinutes || 15} minutes
                    </strong>
                    <p className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0]">
                      Advance dispatch window opening time for scheduled rides.
                    </p>
                  </div>
                </div>

                {/* Save Button guarded by RBAC */}
                <PermissionGuard permission={PERMISSIONS.SETTINGS_WRITE}>
                  <div className="pt-4 border-t border-[#E2E8E4] dark:border-[#2A322D] flex justify-end">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSaveDispatchDialogOpen(true)}
                      className="gap-2 text-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Dispatch Configuration
                    </Button>
                  </div>
                </PermissionGuard>
              </div>
            ) : null}
          </Card>
        </TabsContent>

        {/* --- TAB 3: RELATIVE-DISTANCE RULE ENGINE --- */}
        <TabsContent value="rules" className="space-y-6">
          <RelativeDistanceSimulator
            initialRadiusMetres={dispatchSettings?.initialRadiusMetres?.BIKE || 2500}
            ruleBEnabledForBike={dispatchSettings?.distanceRuleBEnabled?.BIKE ?? true}
          />
        </TabsContent>
      </Tabs>

      {/* Create Fare Version Dialog */}
      <CreateFareConfigDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        initialVehicleType={vehicleFilter !== 'ALL' ? vehicleFilter : 'BIKE'}
        currentVersion={configs[0]?.version || 1}
        onConfirm={handleCreateVersion}
      />

      {/* Save Dispatch Tunables Dialog */}
      <ConfirmWithReasonDialog
        open={saveDispatchDialogOpen}
        onOpenChange={setSaveDispatchDialogOpen}
        title="Update Dispatch Engine Tunables"
        description="Search radius and offer durations affect driver matching latency and fleet fulfillment across Mumbai."
        actionName="settings.dispatch.update"
        targetId="cluster_mumbai_dispatch"
        targetType="DispatchConfig"
        confirmLabel="Confirm & Apply Settings"
        confirmVariant="default"
        onConfirm={handleSaveDispatchTunables}
      />
    </div>
  );
}
