import React, { useState } from 'react';
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
  Filter,
  ArrowUpRight,
  Sparkles,
  Zap,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PERMISSIONS } from '../contracts/rbac';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { SplineAreaChart, DonutProgressCircle, ZoneProgressBar } from '../components/ui/chart';
import { AvatarStack } from '../components/ui/avatar-stack';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { formatPaise } from '../utils/formatters';

const RECENT_MUMBAI_RIDES = [
  {
    id: 'VRM-8921',
    service: 'BIKE',
    pickup: 'Bandra West (Linking Rd)',
    dropoff: 'BKC G-Block',
    customer: 'Aarav Patel',
    captain: 'Suresh K.',
    paise: 9500, // ₹95.00
    status: 'ACTIVE',
    time: '2 mins ago',
  },
  {
    id: 'VRM-8920',
    service: 'AUTO',
    pickup: 'Andheri East (Metro)',
    dropoff: 'Powai Hiranandani',
    customer: 'Neha Sharma',
    captain: 'Ganesh M.',
    paise: 14500, // ₹145.00
    status: 'COMPLETED',
    time: '8 mins ago',
  },
  {
    id: 'VRM-8919',
    service: 'CAB',
    pickup: 'Chhatrapati Shivaji Airport T2',
    dropoff: 'Colaba Causeway',
    customer: 'Vikram Joshi',
    captain: 'Pravin R.',
    paise: 68000, // ₹680.00
    status: 'COMPLETED',
    time: '14 mins ago',
  },
  {
    id: 'VRM-8918',
    service: 'BIKE',
    pickup: 'Dadar Western Station',
    dropoff: 'Lower Parel One World',
    customer: 'Pooja Iyer',
    captain: 'Ramesh V.',
    paise: 8000, // ₹80.00
    status: 'SEARCHING',
    time: '18 mins ago',
  },
  {
    id: 'VRM-8917',
    service: 'AUTO',
    pickup: 'Thane Viviana Mall',
    dropoff: 'Mulund West Station',
    customer: 'Kunal Deshmukh',
    captain: 'Sunil T.',
    paise: 11000, // ₹110.00
    status: 'COMPLETED',
    time: '22 mins ago',
  },
];

const ON_DUTY_OPERATORS = [
  { name: 'Sanjay Deshmukh', initials: 'SD' },
  { name: 'Pooja Sharma', initials: 'PS' },
  { name: 'Rohan Mehta', initials: 'RM' },
  { name: 'Ananya Roy', initials: 'AR' },
];

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const permissions = useAuthStore((s) => s.permissions);
  const language = useUIStore((s) => s.language);
  const t = useUIStore((s) => s.t);
  const isMockApi = useUIStore((s) => s.isMockApi);

  const [activeTab, setActiveTab] = useState('ALL');

  const filteredRides =
    activeTab === 'ALL'
      ? RECENT_MUMBAI_RIDES
      : RECENT_MUMBAI_RIDES.filter((r) => r.service === activeTab);

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#1FD88A] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Live Operations Feed
            </span>
            <span className="text-xs text-[#5E6A64] dark:text-[#9AA6A0]">•</span>
            <span className="text-xs text-[#5E6A64] dark:text-[#9AA6A0]">Mumbai Metropolitan Region</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F6F5]">
            {t('nav.dashboard')}
          </h1>
          <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
            Active operator session • Role: <span className="text-[#15803D] dark:text-[#1FD88A] font-bold">{user?.role}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-[11px] font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Duty Crew:</span>
            <AvatarStack users={ON_DUTY_OPERATORS} extraCount={4} size="sm" />
          </div>

          <Button variant="default" size="default" className="gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-white" />
            Dispatch Console
          </Button>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Rides */}
        <Card glow className="p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#06110C] border border-[#E2E8E4] dark:border-[#1FD88A]/40 text-[#15803D] dark:text-[#1FD88A] flex items-center justify-center shadow-card-glow">
              <Car className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A] border border-[#15803D]/20 dark:border-[#1FD88A]/30">
              <TrendingUp className="w-3 h-3" />
              +18.7%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-[#F4F6F5] tracking-tight">
              2,845
            </p>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
              Active Rides in Progress
            </p>
          </div>
        </Card>

        {/* Card 2: Online Captains */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#06110C] border border-[#E2E8E4] dark:border-[#2A322D] text-[#15803D] dark:text-[#1FD88A] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A] border border-[#15803D]/20 dark:border-[#1FD88A]/30">
              <TrendingUp className="w-3 h-3" />
              +8.4%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-[#F4F6F5] tracking-tight">
              1,420
            </p>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
              Online Verified Captains
            </p>
          </div>
        </Card>

        {/* Card 3: Today's Fare Velocity */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#06110C] border border-[#E2E8E4] dark:border-[#2A322D] text-[#B45309] dark:text-[#F5B301] flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A] border border-[#15803D]/20 dark:border-[#1FD88A]/30">
              <TrendingUp className="w-3 h-3" />
              +12.3%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-[#F4F6F5] tracking-tight">
              {formatPaise(48235000)}
            </p>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
              Gross Fare Volume (Today)
            </p>
          </div>
        </Card>

        {/* Card 4: Safety & SOS Alerts */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/30 dark:border-[#FF5A52]/40 text-[#DC2626] dark:text-[#FF5A52] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#15803D]/10 text-[#15803D] dark:bg-[#22C55E]/15 dark:text-[#22C55E] border border-[#15803D]/20 dark:border-[#22C55E]/30">
              100% Resolved
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-[#F4F6F5] tracking-tight">
              0
            </p>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
              Active Safety Incidents
            </p>
          </div>
        </Card>
      </div>

      {/* Middle Grid: Spline Area Graph + Circular Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A]" />
                Mumbai Hourly Booking Velocity
              </CardTitle>
              <CardDescription>
                Live completed bookings vs hourly tariff generation
              </CardDescription>
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

        {/* Right Col: Circular Fleet Performance & Zones */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base">Regional Demand Clusters</CardTitle>
            <CardDescription>Real-time booking density across Mumbai</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-around py-2 border-b border-[#E2E8E4] dark:border-[#2A322D]">
              <DonutProgressCircle
                percentage={88}
                accentColor="#1FD88A"
                label="Offer Acceptance"
                sublabel="Under 15s avg"
              />
              <DonutProgressCircle
                percentage={94}
                accentColor="#22C55E"
                label="Dispatch SLA"
                sublabel="Within 2.5km"
              />
            </div>

            <div className="space-y-2 pt-1">
              <ZoneProgressBar
                zone="BKC & Bandra Hub"
                count={1120}
                percentage={79}
                color="#1FD88A"
              />
              <ZoneProgressBar
                zone="Andheri & MIDC Corridor"
                count={840}
                percentage={64}
                color="#22C55E"
              />
              <ZoneProgressBar
                zone="South Mumbai / Colaba"
                count={590}
                percentage={48}
                color="#F5B301"
              />
              <ZoneProgressBar
                zone="Thane - Navi Mumbai"
                count={295}
                percentage={32}
                color="#DC2626"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Table: Recent Orders / Live Dispatch Stream */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base">Live Booking Stream (Mumbai)</CardTitle>
            <CardDescription>Real-time ride requests, vehicle matches and status updates</CardDescription>
          </div>

          <div className="flex items-center gap-2">
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
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell className="font-mono font-bold text-[#171717] dark:text-[#F4F6F5]">
                    {ride.id}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] text-[#15803D] dark:text-[#1FD88A]">
                      {ride.service}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#171717] dark:text-[#F4F6F5] truncate max-w-xs">
                        {ride.pickup}
                      </span>
                      <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] truncate max-w-xs">
                        → {ride.dropoff}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-[#171717] dark:text-[#F4F6F5]">
                    {ride.customer}
                  </TableCell>
                  <TableCell className="text-[#5E6A64] dark:text-[#9AA6A0]">
                    {ride.captain}
                  </TableCell>
                  <TableCell className="font-mono font-bold text-[#171717] dark:text-[#F4F6F5]">
                    {formatPaise(ride.paise)}
                  </TableCell>
                  <TableCell>
                    {ride.status === 'ACTIVE' && (
                      <Badge variant="forest" dot>
                        ACTIVE
                      </Badge>
                    )}
                    {ride.status === 'COMPLETED' && (
                      <Badge variant="success">COMPLETED</Badge>
                    )}
                    {ride.status === 'SEARCHING' && (
                      <Badge variant="warning">SEARCHING</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      className="p-1 rounded-lg text-[#5E6A64] dark:text-[#9AA6A0] hover:text-[#171717] dark:hover:text-[#F4F6F5]"
                      aria-label="View actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sensitive Action Demonstration with PermissionGuard */}
      <Card>
        <CardHeader>
          <CardTitle>Permission-Gated Sensitive Operations</CardTitle>
          <CardDescription>
            Internal control boundaries enforced by server-side RBAC. Sensitive changes require audit justification:
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-3">
            <PermissionGuard
              permission={PERMISSIONS.RIDES_RESOLVE}
              fallback={
                <Button
                  variant="outline"
                  disabled
                  title="Requires rides.resolve permission"
                  className="opacity-50 text-xs cursor-not-allowed"
                >
                  Force Resolve Ride (Restricted)
                </Button>
              }
            >
              <Button variant="default" size="default" className="text-xs">
                Force Resolve Ride (Authorized)
              </Button>
            </PermissionGuard>

            <PermissionGuard
              permission={PERMISSIONS.FARES_WRITE}
              fallback={
                <Button
                  variant="outline"
                  disabled
                  title="Requires fares.write permission"
                  className="opacity-50 text-xs cursor-not-allowed"
                >
                  Update Fare Matrix (Restricted)
                </Button>
              }
            >
              <Button variant="default" size="default" className="text-xs bg-[#B45309] hover:bg-[#92400E]">
                Update Fare Matrix (Authorized)
              </Button>
            </PermissionGuard>

            <PermissionGuard
              permission={PERMISSIONS.PAYMENTS_REFUND_SIMULATE}
              fallback={
                <Button
                  variant="outline"
                  disabled
                  title="Requires payments.refund.simulate permission"
                  className="opacity-50 text-xs cursor-not-allowed"
                >
                  Simulate Refund (Restricted)
                </Button>
              }
            >
              <Button variant="accent" size="default" className="text-xs">
                Simulate Refund (Authorized)
              </Button>
            </PermissionGuard>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
