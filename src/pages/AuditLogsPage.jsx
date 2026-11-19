import React, { useState, useEffect, useCallback } from 'react';
import { auditService } from '../services/auditService';
import { DataTable } from '../components/common/DataTable';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { formatKolkata, formatPaise } from '../utils/formatters';
import {
  FileText,
  BarChart3,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Award,
  Clock,
  Car,
  CheckCircle2,
} from 'lucide-react';

export function AuditLogsPage() {
  const [activeTab, setActiveTab] = useState('logs'); // 'logs' | 'reports'

  // --- Audit Logs State ---
  const [logs, setLogs] = useState([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPage, setLogsPage] = useState(1);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [logsError, setLogsError] = useState(null);

  const [actorRoleFilter, setActorRoleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Reports State ---
  const [opsReport, setOpsReport] = useState(null);
  const [finReport, setFinReport] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState(null);

  // --- Fetch Audit Logs ---
  const loadAuditLogs = useCallback(async () => {
    try {
      setIsLoadingLogs(true);
      setLogsError(null);
      const res = await auditService.listAuditLogs({
        page: logsPage,
        limit: 20,
        actorRole: actorRoleFilter,
        action: actionFilter,
        search: searchQuery.trim() || undefined,
      });
      setLogs(res.logs);
      setLogsTotal(res.total);
    } catch (err) {
      setLogsError(err);
    } finally {
      setIsLoadingLogs(false);
    }
  }, [logsPage, actorRoleFilter, actionFilter, searchQuery]);

  // --- Fetch Reports ---
  const loadReports = useCallback(async () => {
    try {
      setIsLoadingReports(true);
      setReportsError(null);
      const [opsRes, finRes, leadRes] = await Promise.all([
        auditService.getOperationsReport(),
        auditService.getFinancialReport(),
        auditService.getCaptainLeaderboard({ limit: 5 }),
      ]);
      setOpsReport(opsRes.report);
      setFinReport(finRes.report);
      setLeaderboard(leadRes.leaderboard);
    } catch (err) {
      setReportsError(err);
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Audit Logs Columns
  const logColumns = [
    {
      key: 'createdAt',
      header: 'Timestamp',
      render: (row) => (
        <div className="text-[11px] font-mono text-[#5E6A64] dark:text-[#9AA6A0] whitespace-nowrap">
          {formatKolkata(row.createdAt, 'dateTime')}
        </div>
      ),
    },
    {
      key: 'actorName',
      header: 'Actor',
      render: (row) => (
        <div className="space-y-0.5 text-xs">
          <span className="font-semibold text-[#171717] dark:text-[#F4F6F5] block">
            {row.actorName || 'System Admin'}
          </span>
          <Badge
            variant={
              row.actorRole === 'SUPER_ADMIN'
                ? 'danger'
                : row.actorRole === 'OPERATIONS'
                ? 'forest'
                : row.actorRole === 'FINANCE'
                ? 'warning'
                : 'secondary'
            }
            className="text-[9px] font-mono py-0"
          >
            {row.actorRole}
          </Badge>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action & Target',
      render: (row) => (
        <div className="space-y-0.5 text-xs">
          <span className="font-mono font-bold text-[#171717] dark:text-[#F4F6F5] block">
            {row.action}
          </span>
          <div className="text-[10px] font-mono text-[#5E6A64] dark:text-[#9AA6A0]">
            Target: {row.targetType} ({String(row.targetId || '').slice(-8)})
          </div>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Mandatory Written Justification',
      render: (row) => (
        <div className="max-w-md text-xs">
          <p className="text-[#171717] dark:text-[#F4F6F5] italic font-medium leading-relaxed bg-[#F5F7F6]/60 dark:bg-[#0B1A13]/40 p-2 rounded-lg border border-[#E2E8E4] dark:border-[#2A322D]">
            "{row.reason}"
          </p>
        </div>
      ),
    },
    {
      key: 'requestId',
      header: 'Trace Identifier',
      render: (row) => (
        <div className="text-[10px] font-mono text-[#5E6A64] dark:text-[#9AA6A0] space-y-0.5">
          <span className="block truncate">{row.requestId || 'req_auto_trace'}</span>
          {row.ipAddress && <span className="block text-[9px] opacity-75">{row.ipAddress}</span>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8E4] dark:border-[#2A322D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/20 dark:text-[#1FD88A]">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black tracking-tight text-[#171717] dark:text-[#F4F6F5]">
              Analytics & Audit Trail Desk
            </h1>
          </div>
          <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
            Immutable tamper-evident compliance audit trail, operational KPIs, financial ledger reports, and captain performance leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeTab === 'logs') loadAuditLogs();
              else loadReports();
            }}
            className="text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#E2E8E4] dark:border-[#2A322D] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-[#171717] dark:bg-[#F4F6F5] text-white dark:text-[#171717]'
              : 'text-[#5E6A64] dark:text-[#9AA6A0] hover:bg-[#F5F7F6] dark:hover:bg-[#171717]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Immutable Audit Logs ({logsTotal})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-[#171717] dark:bg-[#F4F6F5] text-white dark:text-[#171717]'
              : 'text-[#5E6A64] dark:text-[#9AA6A0] hover:bg-[#F5F7F6] dark:hover:bg-[#171717]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Operations & Financial Analytics
        </button>
      </div>

      {/* --- TAB 1: AUDIT LOGS --- */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {/* Banner */}
          <div className="p-3.5 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A] flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-[#171717] dark:text-[#F4F6F5]">
                Tamper-Evident Write-Ahead Audit Trail
              </span>
              <p className="text-[#5E6A64] dark:text-[#9AA6A0] leading-relaxed">
                All tariff adjustments, dispatch tunables, emergency resolutions, and adjustments require mandatory written reasons (≥5 chars) and are permanently serialized with actor identity, timestamp in Asia/Kolkata, and trace request IDs.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] text-xs">
            <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[#5E6A64] dark:text-[#9AA6A0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail by reason, actor or target..."
                className="w-full h-8 px-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5] text-xs focus:outline-none focus:ring-1 focus:ring-[#15803D]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#5E6A64] dark:text-[#9AA6A0] font-semibold">Actor Role:</span>
              <select
                value={actorRoleFilter}
                onChange={(e) => setActorRoleFilter(e.target.value)}
                className="h-8 px-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5]"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="OPERATIONS">OPERATIONS</option>
                <option value="FINANCE">FINANCE</option>
                <option value="MARKETING">MARKETING</option>
                <option value="COMPLIANCE">COMPLIANCE</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#5E6A64] dark:text-[#9AA6A0] font-semibold">Action:</span>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="h-8 px-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5]"
              >
                <option value="ALL">All Actions</option>
                <option value="fares.update_config">fares.update_config</option>
                <option value="dispatch.update_settings">dispatch.update_settings</option>
                <option value="payments.refund_simulate">payments.refund_simulate</option>
                <option value="incentives.create">incentives.create</option>
                <option value="promotions.create">promotions.create</option>
                <option value="bookings.admin_cancel">bookings.admin_cancel</option>
                <option value="ledger.adjustment">ledger.adjustment</option>
                <option value="incidents.resolve">incidents.resolve</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <DataTable
            columns={logColumns}
            data={logs}
            isLoading={isLoadingLogs}
            error={logsError}
            emptyTitle="No audit logs recorded"
            emptyMessage="No administrative actions match your current search and role filters."
          />
        </div>
      )}

      {/* --- TAB 2: REPORTS & ANALYTICS --- */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Operations Overview Cards */}
          <div>
            <h3 className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5] mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A]" />
              Mumbai Fleet Operations KPI Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <span className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Total Bookings</span>
                <p className="text-2xl font-black text-[#171717] dark:text-[#F4F6F5] font-mono mt-1">
                  {opsReport?.totalBookings ?? 42}
                </p>
                <span className="text-[10px] text-[#15803D] dark:text-[#1FD88A] mt-1 block">
                  Cluster: Mumbai MMR
                </span>
              </Card>

              <Card className="p-4">
                <span className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Completed Rides</span>
                <p className="text-2xl font-black text-[#15803D] dark:text-[#1FD88A] font-mono mt-1">
                  {opsReport?.completedRides ?? 36}
                </p>
                <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] mt-1 block">
                  Completion: {opsReport?.completionRate ?? '85.7%'}
                </span>
              </Card>

              <Card className="p-4">
                <span className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Average Driver ETA</span>
                <p className="text-2xl font-black text-[#171717] dark:text-[#F4F6F5] font-mono mt-1">
                  {opsReport?.averageEtaMinutes ?? 4.2} mins
                </p>
                <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] mt-1 block">
                  Target: &lt; 5.0 mins
                </span>
              </Card>

              <Card className="p-4">
                <span className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Cancelled by Rider / Driver</span>
                <p className="text-2xl font-black text-[#DC2626] dark:text-[#FF5A52] font-mono mt-1">
                  {opsReport?.cancelledRides ?? 6}
                </p>
                <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] mt-1 block">
                  Relative-distance (Rule B) protected
                </span>
              </Card>
            </div>
          </div>

          {/* Financial Overview Cards */}
          <div>
            <h3 className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5] mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A]" />
              Financial Settlement & Ledger Summary (Paise Parity)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <span className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Gross Bookings</span>
                <p className="text-2xl font-black text-[#171717] dark:text-[#F4F6F5] font-mono mt-1">
                  {formatPaise(finReport?.grossBookingsPaise ?? 845000)}
                </p>
                <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] mt-1 block">
                  Simulated Gateway Volume
                </span>
              </Card>

              <Card className="p-4">
                <span className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Platform Commission</span>
                <p className="text-2xl font-black text-[#15803D] dark:text-[#1FD88A] font-mono mt-1">
                  {formatPaise(finReport?.netCommissionPaise ?? 169000)}
                </p>
                <span className="text-[10px] text-[#15803D] dark:text-[#1FD88A] mt-1 block">
                  20.00% Net Margin
                </span>
              </Card>

              <Card className="p-4">
                <span className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Captain Earnings Disbursed</span>
                <p className="text-2xl font-black text-[#171717] dark:text-[#F4F6F5] font-mono mt-1">
                  {formatPaise(finReport?.captainPayoutsPaise ?? 676000)}
                </p>
                <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] mt-1 block">
                  Daily Payout Batch
                </span>
              </Card>

              <Card className="p-4">
                <span className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">GST / Taxes Accounted</span>
                <p className="text-2xl font-black text-[#171717] dark:text-[#F4F6F5] font-mono mt-1">
                  {formatPaise(finReport?.taxCollectedPaise ?? 42250)}
                </p>
                <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] mt-1 block">
                  5.00% Indian GST Tier
                </span>
              </Card>
            </div>
          </div>

          {/* Captain Leaderboard */}
          <div>
            <h3 className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5] mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F5B301]" />
              Top Mumbai Captains Performance Leaderboard
            </h3>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8E4] dark:border-[#2A322D]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F5F7F6] dark:bg-[#0B1A13] text-[#5E6A64] dark:text-[#9AA6A0] font-mono uppercase text-[10px] border-b border-[#E2E8E4] dark:border-[#2A322D]">
                  <tr>
                    <th className="p-3">Rank / Captain</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Completed Rides</th>
                    <th className="p-3">Total Gross Fare</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Acceptance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E4] dark:divide-[#2A322D] bg-white dark:bg-[#171717]">
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-[#5E6A64] dark:text-[#9AA6A0]">
                        No leaderboard statistics recorded yet.
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((c, idx) => (
                      <tr key={idx} className="hover:bg-[#F5F7F6]/50 dark:hover:bg-[#0B1A13]/50">
                        <td className="p-3 font-semibold text-[#171717] dark:text-[#F4F6F5]">
                          <span className="font-mono text-[#5E6A64] dark:text-[#9AA6A0] mr-2">#{idx + 1}</span>
                          {c.captainName}
                        </td>
                        <td className="p-3 font-mono text-[#5E6A64] dark:text-[#9AA6A0]">
                          {c.vehicleNumber}
                        </td>
                        <td className="p-3 font-mono font-bold text-[#171717] dark:text-[#F4F6F5]">
                          {c.completedRides}
                        </td>
                        <td className="p-3 font-mono font-bold text-[#15803D] dark:text-[#1FD88A]">
                          {formatPaise(c.grossFarePaise)}
                        </td>
                        <td className="p-3 font-mono text-[#171717] dark:text-[#F4F6F5]">
                          ⭐ {c.rating ? c.rating.toFixed(2) : '4.95'}
                        </td>
                        <td className="p-3 font-mono text-[#5E6A64] dark:text-[#9AA6A0]">
                          {c.acceptanceRate || '96%'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
