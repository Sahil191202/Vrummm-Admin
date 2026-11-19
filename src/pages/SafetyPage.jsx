import React, { useState, useEffect, useCallback } from 'react';
import { safetyService } from '../services/safetyService';
import { DataTable } from '../components/common/DataTable';
import { FilterBar } from '../components/common/FilterBar';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PERMISSIONS } from '../contracts/contracts';
import { formatKolkata } from '../utils/formatters';
import { ResolveIncidentDialog } from '../components/safety/ResolveIncidentDialog';
import { TicketDetailModal } from '../components/safety/TicketDetailModal';
import { TripSharePreviewModal } from '../components/safety/TripSharePreviewModal';
import {
  ShieldAlert,
  LifeBuoy,
  RefreshCw,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Car,
  User,
  Search,
  MessageSquare,
} from 'lucide-react';

export function SafetyPage() {
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' | 'tickets'

  // --- Incidents State ---
  const [incidents, setIncidents] = useState([]);
  const [incidentsTotal, setIncidentsTotal] = useState(0);
  const [incidentsPage, setIncidentsPage] = useState(1);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(true);
  const [incidentsError, setIncidentsError] = useState(null);

  const [incidentStatusFilter, setIncidentStatusFilter] = useState('ALL');
  const [incidentSeverityFilter, setIncidentSeverityFilter] = useState('ALL');
  const [incidentTypeFilter, setIncidentTypeFilter] = useState('ALL');

  // --- Support Tickets State ---
  const [tickets, setTickets] = useState([]);
  const [ticketsTotal, setTicketsTotal] = useState(0);
  const [ticketsPage, setTicketsPage] = useState(1);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [ticketsError, setTicketsError] = useState(null);

  const [ticketStatusFilter, setTicketStatusFilter] = useState('ALL');
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState('ALL');
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState('ALL');

  // --- Dialog States ---
  const [selectedIncidentForResolve, setSelectedIncidentForResolve] = useState(null);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);

  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState(null);
  const [ticketDetailModalOpen, setTicketDetailModalOpen] = useState(false);

  const [tripShareModalOpen, setTripShareModalOpen] = useState(false);

  // --- Fetch Incidents ---
  const loadIncidents = useCallback(async () => {
    try {
      setIsLoadingIncidents(true);
      setIncidentsError(null);
      const res = await safetyService.listIncidents({
        page: incidentsPage,
        limit: 15,
        status: incidentStatusFilter,
        severity: incidentSeverityFilter,
        type: incidentTypeFilter,
      });
      setIncidents(res.incidents);
      setIncidentsTotal(res.total);
    } catch (err) {
      setIncidentsError(err);
    } finally {
      setIsLoadingIncidents(false);
    }
  }, [incidentsPage, incidentStatusFilter, incidentSeverityFilter, incidentTypeFilter]);

  // --- Fetch Tickets ---
  const loadTickets = useCallback(async () => {
    try {
      setIsLoadingTickets(true);
      setTicketsError(null);
      const res = await safetyService.listSupportTickets({
        page: ticketsPage,
        limit: 15,
        status: ticketStatusFilter,
        category: ticketCategoryFilter,
        priority: ticketPriorityFilter,
      });
      setTickets(res.tickets);
      setTicketsTotal(res.total);
    } catch (err) {
      setTicketsError(err);
    } finally {
      setIsLoadingTickets(false);
    }
  }, [ticketsPage, ticketStatusFilter, ticketCategoryFilter, ticketPriorityFilter]);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Active Critical SOS Alerts
  const activeSosIncidents = incidents.filter(
    (i) => i.severity === 'CRITICAL' && (i.status === 'REPORTED' || i.status === 'INVESTIGATING')
  );

  // Columns for Incidents DataTable
  const incidentColumns = [
    {
      key: 'type',
      header: 'Incident / Severity',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-xs text-[#171717] dark:text-[#F4F6F5]">
              {row.type}
            </span>
          </div>
          <Badge
            variant={
              row.severity === 'CRITICAL'
                ? 'danger'
                : row.severity === 'HIGH'
                ? 'warning'
                : 'secondary'
            }
            className="text-[10px] font-mono"
          >
            {row.severity}
          </Badge>
        </div>
      ),
    },
    {
      key: 'reportedBy',
      header: 'Reported By & Target',
      render: (row) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1 font-semibold text-[#171717] dark:text-[#F4F6F5]">
            <User className="w-3 h-3 text-[#5E6A64] dark:text-[#9AA6A0]" />
            <span>{row.reportedBy?.name || 'Anonymous Passenger'}</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#F5F7F6] dark:bg-[#0B1A13] text-[#5E6A64] dark:text-[#9AA6A0]">
              {row.reportedBy?.role}
            </span>
          </div>
          {row.captain && (
            <div className="text-[11px] font-mono text-[#5E6A64] dark:text-[#9AA6A0] flex items-center gap-1">
              <Car className="w-3 h-3" />
              <span>{row.captain.name} ({row.captain.vehicleNumber})</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Location & Description',
      render: (row) => (
        <div className="max-w-xs space-y-1 text-xs">
          <p className="line-clamp-2 text-[#171717] dark:text-[#F4F6F5]">
            {row.description}
          </p>
          {row.address && (
            <div className="flex items-center gap-1 text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] truncate">
              <MapPin className="w-3 h-3 text-[#15803D] dark:text-[#1FD88A] flex-shrink-0" />
              <span className="truncate">{row.address}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'State',
      render: (row) => (
        <Badge
          variant={
            row.status === 'REPORTED'
              ? 'danger'
              : row.status === 'INVESTIGATING'
              ? 'warning'
              : row.status === 'RESOLVED'
              ? 'success'
              : 'secondary'
          }
          className="font-mono text-[10px]"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Logged At',
      render: (row) => (
        <div className="text-[11px] font-mono text-[#5E6A64] dark:text-[#9AA6A0]">
          {formatKolkata(row.createdAt, 'dateTime')}
        </div>
      ),
    },
    {
      key: '_id',
      header: 'Actions',
      render: (row) => (
        <PermissionGuard permission={PERMISSIONS.INCIDENTS_RESOLVE}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedIncidentForResolve(row);
              setResolveDialogOpen(true);
            }}
            className="text-xs h-8 px-2.5"
          >
            Action / Resolve
          </Button>
        </PermissionGuard>
      ),
    },
  ];

  // Columns for Support Tickets DataTable
  const ticketColumns = [
    {
      key: 'subject',
      header: 'Subject & Category',
      render: (row) => (
        <div className="space-y-1 text-xs max-w-xs">
          <span className="font-bold text-[#171717] dark:text-[#F4F6F5] line-clamp-1 block">
            {row.subject}
          </span>
          <Badge variant="outline" className="font-mono text-[10px]">
            {row.category}
          </Badge>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'Submitter',
      render: (row) => (
        <div className="space-y-0.5 text-xs">
          <span className="font-semibold text-[#171717] dark:text-[#F4F6F5] block">
            {row.user?.name}
          </span>
          <span className="text-[11px] font-mono text-[#5E6A64] dark:text-[#9AA6A0] block">
            {row.user?.email || row.user?.role}
          </span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (row) => (
        <Badge
          variant={
            row.priority === 'URGENT'
              ? 'danger'
              : row.priority === 'HIGH'
              ? 'warning'
              : 'secondary'
          }
          className="font-mono text-[10px]"
        >
          {row.priority}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge
          variant={
            row.status === 'OPEN'
              ? 'warning'
              : row.status === 'IN_PROGRESS'
              ? 'forest'
              : 'secondary'
          }
          className="font-mono text-[10px]"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      render: (row) => (
        <div className="text-[11px] font-mono text-[#5E6A64] dark:text-[#9AA6A0]">
          {formatKolkata(row.updatedAt || row.createdAt, 'dateTime')}
        </div>
      ),
    },
    {
      key: '_id',
      header: 'Actions',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedTicketForDetail(row);
            setTicketDetailModalOpen(true);
          }}
          className="text-xs h-8 px-2.5 gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          View Thread
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8E4] dark:border-[#2A322D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#A31C18]/10 text-[#A31C18] dark:bg-[#A31C18]/20 dark:text-[#FF5A52]">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black tracking-tight text-[#171717] dark:text-[#F4F6F5]">
              Safety Operations & Support Desk
            </h1>
          </div>
          <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
            Live emergency SOS monitoring, incident investigations, support ticket desk, and trip-share inspector.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTripShareModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            Trip-Share Lookup
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeTab === 'incidents') loadIncidents();
              else loadTickets();
            }}
            className="text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Critical SOS Banner (if any open SOS exists) */}
      {activeSosIncidents.length > 0 && (
        <div className="p-4 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border-2 border-[#DC2626] text-[#DC2626] dark:text-[#FF5A52] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <span className="font-black uppercase tracking-wider text-sm block">
                {activeSosIncidents.length} Active Emergency SOS Trigger(s) Detected!
              </span>
              <p className="leading-relaxed">
                Emergency protocol initiated for Mumbai cluster. Control desk must review coordinates and establish driver contact immediately.
              </p>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setSelectedIncidentForResolve(activeSosIncidents[0]);
              setResolveDialogOpen(true);
            }}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs self-start sm:self-auto flex-shrink-0"
          >
            Review Urgent Alert
          </Button>
        </div>
      )}

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#E2E8E4] dark:border-[#2A322D] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('incidents')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'incidents'
              ? 'bg-[#171717] dark:bg-[#F4F6F5] text-white dark:text-[#171717]'
              : 'text-[#5E6A64] dark:text-[#9AA6A0] hover:bg-[#F5F7F6] dark:hover:bg-[#171717]'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Safety Incidents & SOS Desk ({incidentsTotal})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tickets'
              ? 'bg-[#171717] dark:bg-[#F4F6F5] text-white dark:text-[#171717]'
              : 'text-[#5E6A64] dark:text-[#9AA6A0] hover:bg-[#F5F7F6] dark:hover:bg-[#171717]'
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          Support Tickets Desk ({ticketsTotal})
        </button>
      </div>

      {/* --- TAB 1: INCIDENTS --- */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Active SOS Alerts</p>
                <p className="text-2xl font-black text-[#DC2626] dark:text-[#FF5A52] font-mono mt-1">
                  {incidents.filter((i) => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/20 flex items-center justify-center text-[#DC2626] dark:text-[#FF5A52]">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Under Investigation</p>
                <p className="text-2xl font-black text-[#B45309] dark:text-[#F5B301] font-mono mt-1">
                  {incidents.filter((i) => i.status === 'INVESTIGATING').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#F5B301]/10 border border-[#F5B301]/20 flex items-center justify-center text-[#B45309] dark:text-[#F5B301]">
                <Clock className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Resolved Cases</p>
                <p className="text-2xl font-black text-[#15803D] dark:text-[#1FD88A] font-mono mt-1">
                  {incidents.filter((i) => i.status === 'RESOLVED').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#15803D]/10 border border-[#15803D]/20 flex items-center justify-center text-[#15803D] dark:text-[#1FD88A]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Total Logged</p>
                <p className="text-2xl font-black text-[#171717] dark:text-[#F4F6F5] font-mono mt-1">
                  {incidentsTotal}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] flex items-center justify-center text-[#5E6A64] dark:text-[#9AA6A0]">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </Card>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#5E6A64] dark:text-[#9AA6A0] font-semibold">Status:</span>
              <select
                value={incidentStatusFilter}
                onChange={(e) => setIncidentStatusFilter(e.target.value)}
                className="h-8 px-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5]"
              >
                <option value="ALL">All Statuses</option>
                <option value="REPORTED">REPORTED</option>
                <option value="INVESTIGATING">INVESTIGATING</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="DISMISSED">DISMISSED</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#5E6A64] dark:text-[#9AA6A0] font-semibold">Severity:</span>
              <select
                value={incidentSeverityFilter}
                onChange={(e) => setIncidentSeverityFilter(e.target.value)}
                className="h-8 px-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5]"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#5E6A64] dark:text-[#9AA6A0] font-semibold">Type:</span>
              <select
                value={incidentTypeFilter}
                onChange={(e) => setIncidentTypeFilter(e.target.value)}
                className="h-8 px-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5]"
              >
                <option value="ALL">All Types</option>
                <option value="SOS_SIMULATED">SOS_SIMULATED</option>
                <option value="ACCIDENT">ACCIDENT</option>
                <option value="HARASSMENT">HARASSMENT</option>
                <option value="ROUTE_DEVIATION">ROUTE_DEVIATION</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          {/* Incidents Table */}
          <DataTable
            columns={incidentColumns}
            data={incidents}
            isLoading={isLoadingIncidents}
            error={incidentsError}
            emptyTitle="No safety incidents found"
            emptyMessage="All clear. No safety incident tickets match the selected filter criteria."
          />
        </div>
      )}

      {/* --- TAB 2: SUPPORT TICKETS --- */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Open Tickets</p>
                <p className="text-2xl font-black text-[#B45309] dark:text-[#F5B301] font-mono mt-1">
                  {tickets.filter((t) => t.status === 'OPEN').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#F5B301]/10 border border-[#F5B301]/20 flex items-center justify-center text-[#B45309] dark:text-[#F5B301]">
                <Clock className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">In Progress</p>
                <p className="text-2xl font-black text-[#15803D] dark:text-[#1FD88A] font-mono mt-1">
                  {tickets.filter((t) => t.status === 'IN_PROGRESS').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#15803D]/10 border border-[#15803D]/20 flex items-center justify-center text-[#15803D] dark:text-[#1FD88A]">
                <LifeBuoy className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Urgent Priority</p>
                <p className="text-2xl font-black text-[#DC2626] dark:text-[#FF5A52] font-mono mt-1">
                  {tickets.filter((t) => t.priority === 'URGENT').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/20 flex items-center justify-center text-[#DC2626] dark:text-[#FF5A52]">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </Card>

            <Card className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Total Tickets</p>
                <p className="text-2xl font-black text-[#171717] dark:text-[#F4F6F5] font-mono mt-1">
                  {ticketsTotal}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] flex items-center justify-center text-[#5E6A64] dark:text-[#9AA6A0]">
                <LifeBuoy className="w-5 h-5" />
              </div>
            </Card>
          </div>

          {/* Ticket Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#5E6A64] dark:text-[#9AA6A0] font-semibold">Status:</span>
              <select
                value={ticketStatusFilter}
                onChange={(e) => setTicketStatusFilter(e.target.value)}
                className="h-8 px-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5]"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#5E6A64] dark:text-[#9AA6A0] font-semibold">Category:</span>
              <select
                value={ticketCategoryFilter}
                onChange={(e) => setTicketCategoryFilter(e.target.value)}
                className="h-8 px-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5]"
              >
                <option value="ALL">All Categories</option>
                <option value="BILLING">BILLING</option>
                <option value="RIDE_ISSUE">RIDE_ISSUE</option>
                <option value="ACCOUNT">ACCOUNT</option>
                <option value="SAFETY">SAFETY</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#5E6A64] dark:text-[#9AA6A0] font-semibold">Priority:</span>
              <select
                value={ticketPriorityFilter}
                onChange={(e) => setTicketPriorityFilter(e.target.value)}
                className="h-8 px-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5]"
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">URGENT</option>
                <option value="HIGH">HIGH</option>
                <option value="NORMAL">NORMAL</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          {/* Tickets Table */}
          <DataTable
            columns={ticketColumns}
            data={tickets}
            isLoading={isLoadingTickets}
            error={ticketsError}
            emptyTitle="No support tickets found"
            emptyMessage="All user requests and complaints are currently resolved."
          />
        </div>
      )}

      {/* Resolve Incident Dialog */}
      <ResolveIncidentDialog
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
        incident={selectedIncidentForResolve}
        onSuccess={loadIncidents}
      />

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        open={ticketDetailModalOpen}
        onOpenChange={setTicketDetailModalOpen}
        ticket={selectedTicketForDetail}
        onTicketUpdated={loadTickets}
      />

      {/* Public Trip Share Modal */}
      <TripSharePreviewModal
        open={tripShareModalOpen}
        onOpenChange={setTripShareModalOpen}
      />
    </div>
  );
}
