import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import {
  Activity,
  ShieldCheck,
  TrendingUp,
  Users,
  Car,
  AlertCircle,
  MoreVertical,
  Zap,
  Sparkles,
  Wifi,
  WifiOff,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PERMISSIONS } from '../contracts/rbac';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { SplineAreaChart, DonutProgressCircle, ZoneProgressBar } from '../components/ui/chart';
import { AvatarStack } from '../components/ui/avatar-stack';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { formatPaise } from '../utils/formatters';
import { useLiveDashboard } from '../hooks/useLiveDashboard';
import { bookingService } from '../services/bookingService';

const ON_DUTY_OPERATORS = [
  { name: 'Sanjay Deshmukh', initials: 'SD' },
  { name: 'Pooja Sharma', initials: 'PS' },
  { name: 'Rohan Mehta', initials: 'RM' },
  { name: 'Ananya Roy', initials: 'AR' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const t = useUIStore((s) => s.t);
  const { counts, connectionStatus, incidentAlerts } = useLiveDashboard();
  const [activeTab, setActiveTab] = useState('ALL');

  const [liveRides, setLiveRides] = useState([]);
  const [isLoadingRides, setIsLoadingRides] = useState(true);

  const fetchLiveRides = useCallback(async () => {
    setIsLoadingRides(true);
    try {
      const res = await bookingService.listBookings({ page: 1, limit: 10 });
      const rawBookings = res.bookings || [];
      const mapped = rawBookings.map((b) => ({
        id: b._id || b.id,
        service: b.vehicleType,
        pickup: b.pickup?.address || 'Pickup Point',
        dropoff: b.drop?.address || 'Dropoff Point',
        customer: b.userId?.displayName || 'Customer',
        captain: b.captainId?.displayName || 'Unassigned',
        paise: b.fareSnapshot?.totalPaise || 0,
        status: b.status,
      }));
      setLiveRides(mapped);
    } catch (err) {
      console.error('Failed to load live booking stream', err);
    } finally {
      setIsLoadingRides(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveRides();
  }, [fetchLiveRides, connectionStatus]);

  const filteredRides =
    activeTab === 'ALL'
      ? liveRides
      : liveRides.filter((r) => r.service === activeTab);

  return (
    <div className="space-y-6">
      {/* Live Incident Alert Banner */}
      {incidentAlerts.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/40 dark:border-[#FF5A52]/40 text-[#DC2626] dark:text-[#FF5A52] text-xs flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>URGENT SAFETY ALERT:</strong> Incident reported on ride {incidentAlerts[0]?.rideId || 'VRM-SOS'}. Immediate review required.
            </span>
          </div>
          <Button variant="destructive" size="sm" onClick={() => navigate('/incidents')} className="h-7 text-xs">
            Inspect SOS
          </Button>
        </div>
      )}

      {/* Top Banner Greeting */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#1FD88A] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Live Operations Overview
            </span>
            <span className="text-xs text-[#5E6A64] dark:text-[#9AA6A0]">•</span>
            <div className="flex items-center gap-1.5 text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
              <span className={`w-2 h-2 rounded-full ${connectionStatus === 'CONNECTED' ? 'bg-[#15803D] dark:bg-[#1FD88A] animate-pulse' : connectionStatus === 'MOCK' ? 'bg-[#F5B301]' : 'bg-[#DC2626]'}`} />
              <span className="font-mono text-[11px] uppercase">{connectionStatus}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F6F5]">
            Welcome back, {user?.displayName?.split(' ')[0] || 'Operator'}!
          </h1>
          <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
            Real-time ride-hailing cluster • Active role: <span className="text-[#15803D] dark:text-[#1FD88A] font-bold">{user?.role}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-[11px] font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Duty Crew:</span>
            <AvatarStack users={ON_DUTY_OPERATORS} extraCount={4} size="sm" />
          </div>

          <Button variant="default" size="default" onClick={() => navigate('/bookings')} className="gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-white" />
            View All Bookings
          </Button>
        </div>
      </div>

      {/* 4 Live Metric Cards with Socket Updates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Rides */}
        <Card glow className="p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#06110C] border border-[#E2E8E4] dark:border-[#1FD88A]/40 text-[#15803D] dark:text-[#1FD88A] flex items-center justify-center shadow-card-glow">
              <Car className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A] border border-[#15803D]/20 dark:border-[#1FD88A]/30">
              <TrendingUp className="w-3 h-3" />
              Live Active
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-[#F4F6F5] tracking-tight font-mono">
              {counts.activeRides.toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
              Active Rides in Progress
            </p>
          </div>
        </Card>

        {/* Searching Bookings */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#06110C] border border-[#E2E8E4] dark:border-[#2A322D] text-[#B45309] dark:text-[#F5B301] flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#B45309]/10 text-[#B45309] dark:bg-[#F5B301]/15 dark:text-[#F5B301] border border-[#B45309]/20 dark:border-[#F5B301]/30">
              In Dispatch
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-[#F4F6F5] tracking-tight font-mono">
              {counts.searchingBookings.toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
              Searching Bookings
            </p>
          </div>
        </Card>

        {/* Online Captains */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#06110C] border border-[#E2E8E4] dark:border-[#2A322D] text-[#15803D] dark:text-[#1FD88A] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A] border border-[#15803D]/20 dark:border-[#1FD88A]/30">
              Verified
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-[#F4F6F5] tracking-tight font-mono">
              {counts.onlineCaptains.toLocaleString()}
            </p>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
              Online Available Captains
            </p>
          </div>
        </Card>

        {/* Today's Gross Fare Volume */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/30 dark:border-[#FF5A52]/40 text-[#DC2626] dark:text-[#FF5A52] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#15803D]/10 text-[#15803D] dark:bg-[#22C55E]/15 dark:text-[#22C55E] border border-[#15803D]/20 dark:border-[#22C55E]/30">
              INR (paise)
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-[#F4F6F5] tracking-tight font-mono">
              {formatPaise(counts.todayFareVolumePaise)}
            </p>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
              Gross Fare Volume (Today)
            </p>
          </div>
        </Card>
      </div>

      {/* Middle Grid: Spline Chart & Regional Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A]" />
                Mumbai Hourly Booking Velocity
              </CardTitle>
              <CardDescription>Live completed bookings vs hourly tariff generation</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] dark:bg-[#1FD88A]" />
                Rides
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A31C18]" />
                Tariff
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <SplineAreaChart />
          </CardContent>
        </Card>

        {/* Right Col: Demand Clusters & SLA Rings */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base">Regional Demand Clusters</CardTitle>
            <CardDescription>Real-time booking density across Mumbai</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-around py-2 border-b border-[#E2E8E4] dark:border-[#2A322D]">
              <DonutProgressCircle percentage={88} accentColor="#1FD88A" label="Offer Acceptance" sublabel="Under 15s avg" />
              <DonutProgressCircle percentage={94} accentColor="#22C55E" label="Dispatch SLA" sublabel="Within 2.5km" />
            </div>

            <div className="space-y-2 pt-1">
              <ZoneProgressBar zone="BKC & Bandra Hub" count={1120} percentage={79} color="#1FD88A" />
              <ZoneProgressBar zone="Andheri & MIDC Corridor" count={840} percentage={64} color="#22C55E" />
              <ZoneProgressBar zone="South Mumbai / Colaba" count={590} percentage={48} color="#F5B301" />
              <ZoneProgressBar zone="Thane - Navi Mumbai" count={295} percentage={32} color="#DC2626" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Table: Live Dispatch Stream with quick nav */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base">Live Booking Stream (Mumbai)</CardTitle>
            <CardDescription>Click any trip to inspect dispatch rounds and exclusion rules</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLiveRides}
              disabled={isLoadingRides}
              className="gap-1 text-xs h-9 px-2.5"
              title="Refresh live booking stream"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRides ? 'animate-spin' : ''}`} />
            </Button>

            {['ALL', 'BIKE', 'AUTO', 'CAB'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
                  activeTab === tab
                    ? 'bg-[#A31C18] text-white shadow-button-glow glow-button'
                    : 'bg-[#F5F7F6] dark:bg-[#0B1A13] text-[#5E6A64] dark:text-[#9AA6A0] hover:text-[#171717] dark:hover:text-[#F4F6F5] border border-[#E2E8E4] dark:border-[#2A322D]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Route (Pickup → Drop)</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Assigned Captain</TableHead>
                <TableHead>Fare</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Inspection</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingRides ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-14 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-7 w-16 ml-auto rounded-lg" /></TableCell>
                  </TableRow>
                ))
              ) : filteredRides.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
                    No live bookings found for the selected filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRides.map((ride) => (
                  <TableRow
                    key={ride.id}
                    onClick={() => navigate(`/bookings/${ride.id}`)}
                    className="cursor-pointer hover:bg-[#F5F7F6] dark:hover:bg-[#171717]/80 transition-colors"
                  >
                    <TableCell className="font-mono font-bold text-[#171717] dark:text-[#F4F6F5]">
                      {ride.id.slice(0, 14)}...
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] text-[#15803D] dark:text-[#1FD88A]">
                        {ride.service}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#171717] dark:text-[#F4F6F5] truncate max-w-xs">{ride.pickup}</span>
                        <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] truncate max-w-xs">→ {ride.dropoff}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-[#171717] dark:text-[#F4F6F5]">{ride.customer}</TableCell>
                    <TableCell className="text-[#5E6A64] dark:text-[#9AA6A0]">{ride.captain}</TableCell>
                    <TableCell className="font-mono font-bold text-[#171717] dark:text-[#F4F6F5]">{formatPaise(ride.paise)}</TableCell>
                    <TableCell>
                      {(ride.status === 'ACTIVE' || ride.status === 'IN_PROGRESS') && <Badge variant="forest" dot>ACTIVE</Badge>}
                      {ride.status === 'COMPLETED' && <Badge variant="success">COMPLETED</Badge>}
                      {ride.status === 'SEARCHING' && <Badge variant="warning">SEARCHING</Badge>}
                      {ride.status === 'CANCELLED' && <Badge variant="destructive">CANCELLED</Badge>}
                      {ride.status === 'ACCEPTED' && <Badge variant="outline">ACCEPTED</Badge>}
                      {ride.status === 'ARRIVED' && <Badge variant="outline">ARRIVED</Badge>}
                      {!['ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'SEARCHING', 'CANCELLED', 'ACCEPTED', 'ARRIVED'].includes(ride.status) && (
                        <Badge variant="outline">{ride.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
