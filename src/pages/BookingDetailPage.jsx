import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Car,
  AlertTriangle,
  ShieldCheck,
  Ban,
  CheckCircle2,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/ui/error-state';
import { ConfirmWithReasonDialog } from '../components/common/ConfirmWithReasonDialog';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { formatPaise, formatKolkata, maskPhone } from '../utils/formatters';
import { PERMISSIONS } from '../contracts/rbac';
import { useToast } from '../components/ui/toast';

export function BookingDetailPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [booking, setBooking] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resolution Dialog State
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const loadDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [bRes, rRes] = await Promise.all([
        bookingService.getBooking(bookingId),
        bookingService.getDispatchRounds(bookingId).catch(() => ({ rounds: [] })),
      ]);
      setBooking(bRes.booking);
      setRounds(rRes.rounds || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [bookingId]);

  const handleConfirmAction = async ({ reason, action }) => {
    if (action === 'bookings.resolve') {
      await bookingService.resolveBooking(bookingId, { reason, action: 'RESOLVED_BY_ADMIN' });
      addToast({ title: 'Booking Resolved', description: 'Manual resolution logged to audit trail.', variant: 'success' });
    } else {
      await bookingService.cancelBooking(bookingId, { reason });
      addToast({ title: 'Booking Cancelled', description: 'Cancellation logged to audit trail.', variant: 'default' });
    }
    loadDetails();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="space-y-4">
        <ErrorState
          title="Failed to load booking details"
          message={error?.message || 'Booking not found'}
          code={error?.code}
          requestId={error?.requestId}
          onRetry={loadDetails}
          secondaryAction={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/bookings')}
              className="gap-2 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Bookings
            </Button>
          }
        />
      </div>
    );
  }

  const { fareSnapshot, pickup, drop, timeline = [] } = booking;

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8E4] dark:border-[#2A322D]">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/bookings')} className="gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" />
            Back to Bookings
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-[#171717] dark:text-[#F4F6F5]">
                {booking.idempotencyKey || booking._id}
              </h1>
              <Badge variant="forest">{booking.vehicleType}</Badge>
              <Badge variant="outline">{booking.mode}</Badge>
            </div>
            <p className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
              Created on {formatKolkata(booking.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
            <PermissionGuard permission={PERMISSIONS.RIDES_RESOLVE}>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setCancelDialogOpen(true)}
                className="gap-1 text-xs"
              >
                <Ban className="w-3.5 h-3.5" />
                Cancel Booking
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setResolveDialogOpen(true)}
                className="gap-1 text-xs bg-[#15803D] hover:bg-[#0E7A4F] dark:bg-[#1FD88A] dark:text-[#06110C]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Force Resolve
              </Button>
            </PermissionGuard>
          )}
        </div>
      </div>

      {/* Grid: Route & Fare Snapshot + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route & Customer Info (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Route & Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] dark:bg-[#1FD88A] mt-1" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#9AA6A0]">Pickup</span>
                    <p className="text-xs font-semibold text-[#171717] dark:text-[#F4F6F5]">{pickup?.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A31C18] mt-1" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#9AA6A0]">Dropoff</span>
                    <p className="text-xs font-semibold text-[#171717] dark:text-[#F4F6F5]">{drop?.address}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D]">
                  <span className="text-[10px] uppercase font-bold text-[#9AA6A0]">Customer</span>
                  <p className="font-bold text-[#171717] dark:text-[#F4F6F5] mt-0.5">{booking.userId?.displayName || 'Customer'}</p>
                  <p className="text-[11px] font-mono text-[#5E6A64] dark:text-[#9AA6A0]">{maskPhone(booking.customerPhone || booking.userId?.email)}</p>
                </div>
                <div className="p-3 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D]">
                  <span className="text-[10px] uppercase font-bold text-[#9AA6A0]">Assigned Captain</span>
                  <p className="font-bold text-[#171717] dark:text-[#F4F6F5] mt-0.5">{booking.captainId?.displayName || 'None Assigned'}</p>
                  <p className="text-[11px] font-mono text-[#5E6A64] dark:text-[#9AA6A0]">{maskPhone(booking.captainId?.phone)} • {booking.captainId?.vehicleNumber || '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dispatch Rounds & Exclusion Reasons */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm">Dispatch Rounds & Candidate Exclusions</CardTitle>
                <CardDescription>Audited captain matches and distance rule evaluation</CardDescription>
              </div>
              <span className="text-xs font-mono text-[#9AA6A0]">{rounds.length} Round(s)</span>
            </CardHeader>
            <CardContent className="space-y-4">
              {rounds.length === 0 ? (
                <p className="text-xs text-[#9AA6A0]">No dispatch rounds recorded yet.</p>
              ) : (
                rounds.map((rnd, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#171717] dark:text-[#F4F6F5]">Round {rnd.roundNumber} ({rnd.status})</span>
                      <span className="font-mono text-[11px] text-[#9AA6A0]">Radius: {rnd.searchRadiusMetres}m • Duration: {rnd.offerDurationSeconds}s</span>
                    </div>

                    {/* Offered Captains */}
                    {rnd.offeredCaptains?.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#15803D] dark:text-[#1FD88A]">Offered Captains</span>
                        {rnd.offeredCaptains.map((c, cIdx) => (
                          <div key={cIdx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#F5F7F6] dark:bg-[#0B1A13]">
                            <span>{c.name} ({c.vehicle})</span>
                            <span className="font-mono font-bold text-[#15803D] dark:text-[#1FD88A]">{c.distanceToPickupMetres}m to pickup • {c.status}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skipped Captains with Exclusion Reasons */}
                    {rnd.skippedCaptains?.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase font-bold text-[#DC2626] dark:text-[#FF5A52]">Excluded Captains & Rule Triggers</span>
                        {rnd.skippedCaptains.map((s, sIdx) => {
                          const isRuleB = s.failedRule?.includes('Rule B');
                          return (
                            <div key={sIdx} className="p-2.5 rounded-lg border border-[#E2E8E4] dark:border-[#2A322D] text-xs space-y-1 bg-white dark:bg-[#171717]">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#171717] dark:text-[#F4F6F5]">{s.name || s.captainId}</span>
                                <Badge variant={isRuleB ? 'warning' : 'outline'} className="text-[10px]">
                                  {s.failedRule || 'Excluded'}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">{s.reason}</p>
                              {isRuleB && (
                                <p className="text-[10px] text-[#B45309] dark:text-[#F5B301] font-semibold flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Experimental Relative-Distance Rule active: excludes captains heading away from pickup.
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Fare Snapshot & State Timeline */}
        <div className="space-y-6">
          {/* Pinned Fare Snapshot */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pinned Fare Snapshot</CardTitle>
              <CardDescription>Fixed at booking creation (Version {fareSnapshot?.fareConfigVersion})</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[11px] text-[#DC2626] dark:text-[#FF5A52] border border-[#DC2626]/20 flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Fare config is pinned. Subsequent tariff modifications do not alter this ride.</span>
              </div>

              <div className="divide-y divide-[#E2E8E4] dark:divide-[#2A322D] pt-2">
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5E6A64] dark:text-[#9AA6A0]">Base Tariff</span>
                  <span className="font-mono">{formatPaise(fareSnapshot?.breakdown?.baseFarePaise ?? fareSnapshot?.breakdown?.basePaise)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5E6A64] dark:text-[#9AA6A0]">Distance Charge ({((fareSnapshot?.distanceMetres || 0) / 1000).toFixed(1)} km)</span>
                  <span className="font-mono">{formatPaise(fareSnapshot?.breakdown?.distanceCharge?.amountPaise ?? fareSnapshot?.breakdown?.distancePaise)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#5E6A64] dark:text-[#9AA6A0]">Time Rate</span>
                  <span className="font-mono">{formatPaise(fareSnapshot?.breakdown?.timeCharge?.amountPaise ?? fareSnapshot?.breakdown?.timePaise)}</span>
                </div>
                {(fareSnapshot?.breakdown?.totalTaxPaise || fareSnapshot?.breakdown?.taxesPaise) ? (
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#5E6A64] dark:text-[#9AA6A0]">GST / Taxes</span>
                    <span className="font-mono">{formatPaise(fareSnapshot?.breakdown?.totalTaxPaise ?? fareSnapshot?.breakdown?.taxesPaise)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between py-2 font-bold text-sm text-[#171717] dark:text-[#F4F6F5]">
                  <span>Total Gross Fare</span>
                  <span className="font-mono text-[#15803D] dark:text-[#1FD88A]">{formatPaise(fareSnapshot?.totalPaise)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* State Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">State Progression Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <div className="relative pl-6 space-y-4">
                  <div className="relative text-xs">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#15803D] dark:bg-[#1FD88A] ring-4 ring-white dark:ring-[#171717]" />
                    <span className="font-bold text-[#171717] dark:text-[#F4F6F5] uppercase text-[11px]">{booking.status}</span>
                    <p className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] font-mono">{formatKolkata(booking.createdAt)}</p>
                  </div>
                </div>
              ) : (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8E4] dark:before:bg-[#2A322D]">
                  {timeline.map((step, idx) => (
                    <div key={idx} className="relative text-xs">
                      <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#A31C18] ring-4 ring-white dark:ring-[#171717]" />
                      <span className="font-bold text-[#171717] dark:text-[#F4F6F5] uppercase text-[11px]">{step.status}</span>
                      <p className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] font-mono">{formatKolkata(step.at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmWithReasonDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Cancel Booking"
        actionName="bookings.admin_cancel"
        targetId={bookingId}
        targetType="Booking"
        confirmLabel="Confirm Cancellation"
        confirmVariant="destructive"
        onConfirm={(payload) => handleConfirmAction({ ...payload, action: 'bookings.cancel' })}
      />
      <ConfirmWithReasonDialog
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
        title="Force Resolve Ride"
        actionName="bookings.force_resolve"
        targetId={bookingId}
        targetType="Booking"
        confirmLabel="Force Resolve Ride"
        confirmVariant="default"
        onConfirm={(payload) => handleConfirmAction({ ...payload, action: 'bookings.resolve' })}
      />
    </div>
  );
}
