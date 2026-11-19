import React, { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settingsService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PERMISSIONS } from '../contracts/contracts';
import { ConfirmWithReasonDialog } from '../components/common/ConfirmWithReasonDialog';
import {
  Settings,
  Shield,
  ShieldAlert,
  Lock,
  Compass,
  CreditCard,
  MapPin,
  PhoneCall,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    commercialLaunchDisabled: true,
    demoMode: true,
    simulatedPaymentsEnabled: true,
    geofenceActive: true,
    activeCluster: 'Mumbai MMR (Bandra, BKC, Andheri, Colaba, Dadar, Thane)',
    dispatchAlgorithm: 'V2_RELATIVE_DISTANCE',
    emergencyHelpline: '+91 112 (Police) / +91 108 (Ambulance) / 100',
    systemVersion: 'v0.9.4-alpha (Phase F Certified)',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form edit state
  const [demoMode, setDemoMode] = useState(true);
  const [simulatedPayments, setSimulatedPayments] = useState(true);
  const [geofenceActive, setGeofenceActive] = useState(true);
  const [dispatchAlgorithm, setDispatchAlgorithm] = useState('V2_RELATIVE_DISTANCE');
  const [emergencyHelpline, setEmergencyHelpline] = useState('+91 112 (Police) / +91 108 (Ambulance) / 100');

  // Confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await settingsService.getSettings();
      const s = res.settings;
      setSettings(s);
      setDemoMode(s.demoMode ?? true);
      setSimulatedPayments(s.simulatedPaymentsEnabled ?? true);
      setGeofenceActive(s.geofenceActive ?? true);
      setDispatchAlgorithm(s.dispatchAlgorithm || 'V2_RELATIVE_DISTANCE');
      setEmergencyHelpline(s.emergencyHelpline || '+91 112 (Police) / +91 108 (Ambulance) / 100');
    } catch (err) {
      setError(err?.message || 'Failed to fetch platform configuration settings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveSettings = async (reason) => {
    try {
      setIsSaving(true);
      setError(null);
      const updated = await settingsService.updateSettings({
        demoMode,
        simulatedPaymentsEnabled: simulatedPayments,
        geofenceActive,
        dispatchAlgorithm,
        emergencyHelpline,
        commercialLaunchDisabled: true, // Master lock enforced
        reason,
      });
      setSettings(updated.settings);
      setSuccessMessage('System configuration successfully updated and recorded in compliance audit log.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(err?.message || 'Failed to save system settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8E4] dark:border-[#2A322D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/20 dark:text-[#1FD88A]">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black tracking-tight text-[#171717] dark:text-[#F4F6F5]">
              System Flags & Environment Settings
            </h1>
          </div>
          <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
            Runtime governance, learning environment safeguards, dispatch algorithm tunables, and emergency protocols.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSettings}
            className="text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload
          </Button>
        </div>
      </div>

      {/* --- MASTER LEARNING ENVIRONMENT BANNER --- */}
      <div className="p-4 rounded-2xl bg-[#06110C] text-white border-2 border-[#1FD88A]/40 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#1FD88A]/20 text-[#1FD88A]">
              <Shield className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1FD88A]">
              Academic & Learning Project Mode
            </span>
          </div>
          <Badge variant="danger" className="font-mono text-xs font-bold gap-1">
            <Lock className="w-3.5 h-3.5" />
            COMMERCIAL LAUNCH: DISABLED
          </Badge>
        </div>

        <p className="text-xs text-[#9AA6A0] leading-relaxed">
          This deployment of the <strong>Vrumm Fleet Management & Dispatch System</strong> is strictly configured as an academic, prototype simulation modeling the Mumbai metropolitan region. Commercial operations, live production banking gateways, real driver disbursements, and real passenger dispatches are permanently inhibited.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#1FD88A]/20 text-[11px] font-mono text-[#9AA6A0]">
          <span>Pilot Cluster: <strong>Mumbai, Maharashtra</strong></span>
          <span>•</span>
          <span>Currency: <strong>INR (Paise Parity)</strong></span>
          <span>•</span>
          <span>Clock: <strong>Asia/Kolkata (IST)</strong></span>
          <span>•</span>
          <span>Version: <strong>{settings.systemVersion}</strong></span>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-[#15803D]/10 dark:bg-[#1FD88A]/15 border border-[#15803D]/30 text-[#15803D] dark:text-[#1FD88A] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/30 text-[#DC2626] dark:text-[#FF5A52] text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* --- SETTINGS FORM --- */}
      <div className="space-y-4">
        {/* Core System Locks Card */}
        <Card className="border border-[#E2E8E4] dark:border-[#2A322D]">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#A31C18]" />
              Safety Safeguards & Production Inhibitors
            </CardTitle>
            <CardDescription className="text-xs">
              System governance switches that prevent unintentional commercial escalation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Commercial Launch Locked Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D]">
              <div>
                <span className="font-bold text-[#171717] dark:text-[#F4F6F5] block">
                  Commercial Launch Inhibitor Lock
                </span>
                <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
                  Permanently prevents live public ride fulfillment and real UPI disbursements.
                </span>
              </div>
              <Badge variant="danger" className="font-mono text-xs">
                LOCKED (TRUE)
              </Badge>
            </div>

            {/* Simulated Payments */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D]">
              <div>
                <span className="font-bold text-[#171717] dark:text-[#F4F6F5] block">
                  Simulated Gateway Ledger Mode
                </span>
                <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
                  All bookings simulate Razorpay/UPI gateway transitions with instant mock captures.
                </span>
              </div>
              <input
                type="checkbox"
                checked={simulatedPayments}
                onChange={(e) => setSimulatedPayments(e.target.checked)}
                className="w-4 h-4 accent-[#15803D]"
              />
            </div>

            {/* Demo Mode */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D]">
              <div>
                <span className="font-bold text-[#171717] dark:text-[#F4F6F5] block">
                  Demo Seed Scenarios & Live Simulator
                </span>
                <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
                  Permits interactive simulated rides across Bandra, BKC, and Andheri test corridors.
                </span>
              </div>
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="w-4 h-4 accent-[#15803D]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dispatch & Fleet Algorithms */}
        <Card className="border border-[#E2E8E4] dark:border-[#2A322D]">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A]" />
              Dispatch Engine Configuration
            </CardTitle>
            <CardDescription className="text-xs">
              Configure driver matching logic and Mumbai municipal operational boundaries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Dispatch Algorithm Selection */}
            <div className="space-y-1.5">
              <label htmlFor="dispatch-algorithm-select" className="font-semibold text-[#171717] dark:text-[#F4F6F5]">
                Active Matching Algorithm
              </label>
              <select
                id="dispatch-algorithm-select"
                value={dispatchAlgorithm}
                onChange={(e) => setDispatchAlgorithm(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5] font-mono text-xs focus:ring-2 focus:ring-[#15803D]"
              >
                <option value="V2_RELATIVE_DISTANCE">
                  V2_RELATIVE_DISTANCE (Rule B: Excludes captains closer to drop than pickup) [RECOMMENDED]
                </option>
                <option value="V1_NEAREST_DISTANCE">
                  V1_NEAREST_DISTANCE (Standard Euclidean/Geodesic nearest driver radius)
                </option>
              </select>
            </div>

            {/* Geofence Active */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D]">
              <div>
                <span className="font-bold text-[#171717] dark:text-[#F4F6F5] block">
                  Enforce Mumbai Geofence Polygon
                </span>
                <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
                  Restricts pickup and drop off coordinates within Mumbai MMR boundary coordinates.
                </span>
              </div>
              <input
                type="checkbox"
                checked={geofenceActive}
                onChange={(e) => setGeofenceActive(e.target.checked)}
                className="w-4 h-4 accent-[#15803D]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Safety & Emergency Routing */}
        <Card className="border border-[#E2E8E4] dark:border-[#2A322D]">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#A31C18]" />
              Emergency Escalation Helpline Directory
            </CardTitle>
            <CardDescription className="text-xs">
              Configured emergency helplines broadcasted to the passenger app and trip-share web preview.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label htmlFor="emergency-helpline-input" className="font-semibold text-[#171717] dark:text-[#F4F6F5]">
                Helpline Numbers Broadcast
              </label>
              <input
                id="emergency-helpline-input"
                type="text"
                value={emergencyHelpline}
                onChange={(e) => setEmergencyHelpline(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5] font-mono text-xs focus:ring-2 focus:ring-[#15803D]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <PermissionGuard permission={PERMISSIONS.SETTINGS_WRITE}>
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={isSaving}
              onClick={() => setConfirmDialogOpen(true)}
              className="gap-1.5 px-5 h-10"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Recording Settings...' : 'Save System Changes'}
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Confirmation with Mandatory Justification Dialog */}
      <ConfirmWithReasonDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Confirm System Flag Changes"
        description="Updating system settings directly impacts runtime dispatch and payment simulations. A written reason is mandatory for compliance audit recording."
        actionLabel="Apply Changes"
        variant="default"
        requireReason={true}
        minReasonLength={5}
        onConfirm={handleSaveSettings}
      />
    </div>
  );
}
