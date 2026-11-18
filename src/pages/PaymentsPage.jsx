import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  BookOpen,
  Scale,
  RotateCcw,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldAlert,
  Wallet,
  Building2,
  UserCheck,
} from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { ledgerService } from '../services/ledgerService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/ui/error-state';
import { EmptyState } from '../components/ui/empty-state';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PERMISSIONS } from '../contracts/rbac';
import { formatPaise, formatKolkata, maskPhone } from '../utils/formatters';
import { useToast } from '../components/ui/toast';
import { SimulateRefundDialog } from '../components/payments/SimulateRefundDialog';
import { CreateAdjustmentDialog } from '../components/payments/CreateAdjustmentDialog';

const TABS = [
  { id: 'PAYMENTS', label: 'Payments Stream', icon: CreditCard },
  { id: 'LEDGER', label: 'Append-Only Ledger', icon: BookOpen },
  { id: 'RECONCILIATION', label: 'Reconciliation & Balances', icon: Scale },
];

export function PaymentsPage() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('PAYMENTS');

  // Tab 1: Payments State
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [selectedRefundPayment, setSelectedRefundPayment] = useState(null);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);

  // Tab 2: Ledger State
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(true);
  const [ledgerError, setLedgerError] = useState(null);
  const [accountTypeFilter, setAccountTypeFilter] = useState('ALL');
  const [entryTypeFilter, setEntryTypeFilter] = useState('ALL');
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);

  // Tab 3: Reconciliation State
  const [reconciliation, setReconciliation] = useState(null);
  const [reconLoading, setReconLoading] = useState(true);
  const [reconError, setReconError] = useState(null);

  // Platform Balance State
  const [platformBalancePaise, setPlatformBalancePaise] = useState(0);

  // 1. Load Payments
  const loadPayments = useCallback(async () => {
    setPaymentsLoading(true);
    setPaymentsError(null);
    try {
      const res = await paymentService.listPayments({
        status: paymentStatusFilter === 'ALL' ? undefined : paymentStatusFilter,
        rideId: paymentSearch.trim() || undefined,
      });
      setPayments(res.payments || []);
    } catch (err) {
      setPaymentsError(err);
      addToast({
        title: 'Failed to load payments',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setPaymentsLoading(false);
    }
  }, [paymentStatusFilter, paymentSearch, addToast]);

  // 2. Load Ledger
  const loadLedger = useCallback(async () => {
    setLedgerLoading(true);
    setLedgerError(null);
    try {
      const [entriesRes, balRes] = await Promise.all([
        ledgerService.listEntries({
          accountType: accountTypeFilter === 'ALL' ? undefined : accountTypeFilter,
          entryType: entryTypeFilter === 'ALL' ? undefined : entryTypeFilter,
        }),
        ledgerService.getBalance(),
      ]);
      setLedgerEntries(entriesRes.entries || []);
      setPlatformBalancePaise(balRes.balancePaise);
    } catch (err) {
      setLedgerError(err);
      addToast({
        title: 'Failed to load ledger',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLedgerLoading(false);
    }
  }, [accountTypeFilter, entryTypeFilter, addToast]);

  // 3. Load Reconciliation
  const loadReconciliation = useCallback(async () => {
    setReconLoading(true);
    setReconError(null);
    try {
      const report = await ledgerService.getReconciliationReport();
      setReconciliation(report);
      setPlatformBalancePaise(report.balancePaise);
    } catch (err) {
      setReconError(err);
      addToast({
        title: 'Failed to load reconciliation report',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setReconLoading(false);
    }
  }, [addToast]);

  // Initial and reactive loads
  useEffect(() => {
    if (activeTab === 'PAYMENTS') loadPayments();
    if (activeTab === 'LEDGER') loadLedger();
    if (activeTab === 'RECONCILIATION') loadReconciliation();
  }, [activeTab, loadPayments, loadLedger, loadReconciliation]);

  // Simulated refund handler
  const handleRefundSimulated = async (paymentId, { reason }) => {
    await paymentService.simulateRefund(paymentId, { reason });
    addToast({
      title: 'Simulated Refund Executed',
      description: `Payment ${paymentId} marked as REFUNDED_SIMULATED and recorded in immutable ledger.`,
      variant: 'default',
    });
    loadPayments();
    if (activeTab === 'LEDGER') loadLedger();
    if (activeTab === 'RECONCILIATION') loadReconciliation();
  };

  // Manual adjustment handler
  const handleAdjustmentCreated = async (payload) => {
    await ledgerService.createAdjustment(payload);
    addToast({
      title: 'Ledger Adjustment Committed',
      description: `Immutable entry recorded for ${payload.accountType} (${payload.direction} ${formatPaise(payload.amountPaise)}).`,
      variant: 'default',
    });
    loadLedger();
    if (activeTab === 'RECONCILIATION') loadReconciliation();
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'CAPTURED':
        return <Badge variant="success">CAPTURED</Badge>;
      case 'PENDING':
        return <Badge variant="warning">PENDING</Badge>;
      case 'REFUNDED_SIMULATED':
        return (
          <Badge variant="outline" className="text-[#DC2626] border-[#DC2626]/40 bg-[#FBE9E8] dark:bg-[#2A0F0E]">
            REFUNDED (SIMULATED)
          </Badge>
        );
      case 'FAILED':
        return <Badge variant="destructive">FAILED</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717] dark:text-[#F5F7F6] flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#A31C18]" />
            Payments, Ledger & Reconciliation
          </h1>
          <p className="text-sm text-[#667085] dark:text-[#9AA6A0] mt-1">
            Read-only immutable double-entry ledger, gateway transaction stream, simulated refunds, and platform reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'LEDGER' && (
            <PermissionGuard requiredPermission={PERMISSIONS.PAYMENTS_READ}>
              <Button
                size="sm"
                onClick={() => setAdjustmentDialogOpen(true)}
                className="bg-[#A31C18] hover:bg-[#851613] text-white flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Append Adjustment
              </Button>
            </PermissionGuard>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeTab === 'PAYMENTS') loadPayments();
              if (activeTab === 'LEDGER') loadLedger();
              if (activeTab === 'RECONCILIATION') loadReconciliation();
            }}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E2E8E4] dark:border-[#2A322D] gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
                isActive
                  ? 'border-[#A31C18] text-[#A31C18] bg-white dark:bg-[#06110C] font-bold'
                  : 'border-transparent text-[#667085] dark:text-[#9AA6A0] hover:text-[#171717] dark:hover:text-[#F5F7F6]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PAYMENTS STREAM */}
      {activeTab === 'PAYMENTS' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#06110C]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA6A0]" />
              <Input
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                placeholder="Search by Ride Reference ID..."
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="flex rounded-lg border border-[#E2E8E4] dark:border-[#2A322D] p-0.5 bg-[#F5F7F6] dark:bg-[#0B1510] text-xs">
                {['ALL', 'CAPTURED', 'PENDING', 'REFUNDED_SIMULATED', 'FAILED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setPaymentStatusFilter(st)}
                    className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-all ${
                      paymentStatusFilter === st
                        ? 'bg-white dark:bg-[#171717] text-[#171717] dark:text-white shadow-sm'
                        : 'text-[#667085] dark:text-[#9AA6A0]'
                    }`}
                  >
                    {st === 'REFUNDED_SIMULATED' ? 'REFUNDED' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          {paymentsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : paymentsError ? (
            <ErrorState error={paymentsError} onRetry={loadPayments} />
          ) : payments.length === 0 ? (
            <EmptyState
              title="No payments found"
              description="No transaction records match the specified filters."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#06110C]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E2E8E4] dark:border-[#2A322D] bg-[#F5F7F6] dark:bg-[#0B1510] text-[#667085] dark:text-[#9AA6A0] uppercase font-mono text-[11px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Payment / Order ID</th>
                    <th className="py-3 px-4 font-semibold">Ride Ref</th>
                    <th className="py-3 px-4 font-semibold">Customer</th>
                    <th className="py-3 px-4 font-semibold">Captain / Vehicle</th>
                    <th className="py-3 px-4 font-semibold">Amount (INR)</th>
                    <th className="py-3 px-4 font-semibold">Provider</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Timestamp (IST)</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E4] dark:divide-[#2A322D]">
                  {payments.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-[#F5F7F6]/50 dark:hover:bg-[#0B1510]/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-[#171717] dark:text-white">
                          {p._id}
                        </div>
                        <div className="font-mono text-[11px] text-[#667085] dark:text-[#9AA6A0]">
                          {p.providerOrderId || p.providerPaymentId || '—'}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-[#171717] dark:text-white">
                        {p.rideId || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#171717] dark:text-white">
                          {p.customerName || 'Customer'}
                        </div>
                        <div className="text-[11px] font-mono text-[#667085] dark:text-[#9AA6A0]">
                          {maskPhone(p.customerPhone)}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#171717] dark:text-white">
                          {p.captainName || '—'}
                        </div>
                        <div className="text-[11px] font-mono text-[#667085] dark:text-[#9AA6A0]">
                          {p.vehicleNumber || '—'}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-sm text-[#171717] dark:text-white">
                        {formatPaise(p.amountPaise)}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#F5F7F6] dark:bg-[#0B1510] border border-[#E2E8E4] dark:border-[#2A322D]">
                          {p.provider}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {getPaymentStatusBadge(p.status)}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-[#667085] dark:text-[#9AA6A0]">
                        {formatKolkata(p.createdAt)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {p.status === 'CAPTURED' ? (
                          <PermissionGuard requiredPermission={PERMISSIONS.PAYMENTS_REFUND_SIMULATE}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRefundPayment(p);
                                setRefundDialogOpen(true);
                              }}
                              className="text-xs h-7 px-2 text-[#DC2626] border-[#DC2626]/30 hover:bg-[#FBE9E8] dark:hover:bg-[#2A0F0E]"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Simulate Refund
                            </Button>
                          </PermissionGuard>
                        ) : p.status === 'REFUNDED_SIMULATED' ? (
                          <span className="text-[11px] font-mono text-[#DC2626] dark:text-[#FF8A84] italic">
                            Simulated Refunded
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#9AA6A0]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPEND-ONLY FINANCIAL LEDGER */}
      {activeTab === 'LEDGER' && (
        <div className="space-y-4">
          {/* Immutability Alert Notice */}
          <div className="p-3.5 rounded-xl border border-[#0A7B44]/20 bg-[#E6F9F0] dark:bg-[#082015] flex items-start gap-3 text-xs text-[#0A7B44] dark:text-[#1FD88A] leading-relaxed">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#0A7B44] dark:text-[#1FD88A] mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">APPEND-ONLY DOUBLE ENTRY AUDIT TRAIL</strong>
              This ledger is strictly immutable. No entry can be modified, patched, or deleted. All debits and credits maintain mathematical parity.
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#06110C]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#667085] dark:text-[#9AA6A0]">Account:</span>
              {['ALL', 'PLATFORM', 'CAPTAIN', 'CUSTOMER'].map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => setAccountTypeFilter(acc)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    accountTypeFilter === acc
                      ? 'bg-[#171717] text-white dark:bg-[#1FD88A] dark:text-[#06110C]'
                      : 'text-[#667085] dark:text-[#9AA6A0] hover:bg-[#F5F7F6] dark:hover:bg-[#0B1510]'
                  }`}
                >
                  {acc}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#667085] dark:text-[#9AA6A0]">Type:</span>
              <select
                value={entryTypeFilter}
                onChange={(e) => setEntryTypeFilter(e.target.value)}
                className="h-8 px-2 text-xs rounded-md border border-[#E2E8E4] dark:border-[#2A322D] bg-[#F5F7F6] dark:bg-[#0B1510] text-[#171717] dark:text-[#F5F7F6] focus:outline-none"
              >
                <option value="ALL">All Entry Types</option>
                <option value="FARE_COLLECTED">FARE_COLLECTED</option>
                <option value="COMMISSION_EARNED">COMMISSION_EARNED</option>
                <option value="CAPTAIN_EARNING">CAPTAIN_EARNING</option>
                <option value="CAPTAIN_PAYOUT_SIMULATED">CAPTAIN_PAYOUT_SIMULATED</option>
                <option value="ADJUSTMENT">ADJUSTMENT</option>
              </select>
            </div>
          </div>

          {/* Immutable Entries Table */}
          {ledgerLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : ledgerError ? (
            <ErrorState error={ledgerError} onRetry={loadLedger} />
          ) : ledgerEntries.length === 0 ? (
            <EmptyState
              title="No ledger entries found"
              description="No immutable records match your filter criteria."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#06110C]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E2E8E4] dark:border-[#2A322D] bg-[#F5F7F6] dark:bg-[#0B1510] text-[#667085] dark:text-[#9AA6A0] uppercase font-mono text-[11px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Ledger Entry ID</th>
                    <th className="py-3 px-4 font-semibold">Recorded At (IST)</th>
                    <th className="py-3 px-4 font-semibold">Account Entity</th>
                    <th className="py-3 px-4 font-semibold">Direction</th>
                    <th className="py-3 px-4 font-semibold">Amount (INR)</th>
                    <th className="py-3 px-4 font-semibold">Entry Classification</th>
                    <th className="py-3 px-4 font-semibold">Audit Notes & Reason</th>
                    <th className="py-3 px-4 font-semibold">Refs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E4] dark:divide-[#2A322D]">
                  {ledgerEntries.map((e) => (
                    <tr
                      key={e._id}
                      className="hover:bg-[#F5F7F6]/50 dark:hover:bg-[#0B1510]/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#171717] dark:text-white">
                        {e._id}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-[#667085] dark:text-[#9AA6A0]">
                        {formatKolkata(e.createdAt)}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-xs text-[#171717] dark:text-white">
                          {e.accountType}
                        </span>
                        <span className="block font-mono text-[10px] text-[#667085] dark:text-[#9AA6A0]">
                          {e.accountUserId}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold">
                        {e.direction === 'CREDIT' ? (
                          <span className="flex items-center text-[#0A7B44] dark:text-[#1FD88A]">
                            <ArrowDownLeft className="w-3.5 h-3.5 mr-0.5" />
                            + CREDIT
                          </span>
                        ) : (
                          <span className="flex items-center text-[#DC2626] dark:text-[#FF8A84]">
                            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                            - DEBIT
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-sm text-[#171717] dark:text-white">
                        {formatPaise(e.amountPaise)}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {e.entryType}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-xs text-[#171717] dark:text-white">
                          {e.description}
                        </div>
                        {e.reason && (
                          <div className="text-[11px] italic text-[#667085] dark:text-[#9AA6A0]">
                            Audit: {e.reason}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-[10px] text-[#667085] dark:text-[#9AA6A0]">
                        {e.rideId && <div>Ride: {e.rideId.slice(-6)}</div>}
                        {e.paymentId && <div>Pay: {e.paymentId.slice(-6)}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RECONCILIATION & BALANCES */}
      {activeTab === 'RECONCILIATION' && (
        <div className="space-y-6">
          {reconLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : reconError ? (
            <ErrorState error={reconError} onRetry={loadReconciliation} />
          ) : (
            <>
              {/* Reconciliation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase text-[#667085] dark:text-[#9AA6A0]">
                        Platform Treasury Balance
                      </p>
                      <h3 className="text-2xl font-bold text-[#0A7B44] dark:text-[#1FD88A] mt-1">
                        {formatPaise(reconciliation?.balancePaise || platformBalancePaise)}
                      </h3>
                      <p className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5">
                        Net platform retained funds
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#E6F9F0] dark:bg-[#082015] text-[#0A7B44] dark:text-[#1FD88A]">
                      <Wallet className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase text-[#667085] dark:text-[#9AA6A0]">
                        Gross Fare Collected
                      </p>
                      <h3 className="text-2xl font-bold text-[#171717] dark:text-[#F5F7F6] mt-1">
                        {formatPaise(reconciliation?.totalCollectedPaise || 0)}
                      </h3>
                      <p className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5">
                        From captured passenger rides
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1510] text-[#171717] dark:text-[#F5F7F6]">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase text-[#667085] dark:text-[#9AA6A0]">
                        Platform Commission
                      </p>
                      <h3 className="text-2xl font-bold text-[#A31C18] mt-1">
                        {formatPaise(reconciliation?.totalCommissionPaise || 0)}
                      </h3>
                      <p className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5">
                        Accrued take-rate revenue
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[#A31C18]">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase text-[#667085] dark:text-[#9AA6A0]">
                        Captain Earnings Credited
                      </p>
                      <h3 className="text-2xl font-bold text-[#171717] dark:text-[#F5F7F6] mt-1">
                        {formatPaise(reconciliation?.totalCaptainEarningsPaise || 0)}
                      </h3>
                      <p className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5">
                        Net payable driver allocation
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1510] text-[#171717] dark:text-[#F5F7F6]">
                      <UserCheck className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase text-[#667085] dark:text-[#9AA6A0]">
                        Simulated Batch Payouts
                      </p>
                      <h3 className="text-2xl font-bold text-[#171717] dark:text-[#F5F7F6] mt-1">
                        {formatPaise(reconciliation?.totalPayoutsPaise || 0)}
                      </h3>
                      <p className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5">
                        Disbursed driver settlements
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1510] text-[#171717] dark:text-[#F5F7F6]">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#0A7B44]/30 bg-[#E6F9F0]/40 dark:bg-[#082015]/40">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono uppercase text-[#0A7B44] dark:text-[#1FD88A]">
                        Reconciliation Parity
                      </p>
                      <h3 className="text-2xl font-bold text-[#0A7B44] dark:text-[#1FD88A] mt-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-6 h-6" />
                        0 Discrepancies
                      </h3>
                      <p className="text-[11px] text-[#667085] dark:text-[#9AA6A0] mt-0.5">
                        100% matched debit/credit parity
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0A7B44] text-white">
                      <Scale className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Section */}
              <div className="p-5 rounded-xl border border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#06110C] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[#171717] dark:text-white">
                    Need to rectify a gateway rounding or partner discrepancy?
                  </h4>
                  <p className="text-xs text-[#667085] dark:text-[#9AA6A0] mt-0.5">
                    Manual adjustments append an immutable audited transaction. All entries require minimum 5-character written justification.
                  </p>
                </div>

                <PermissionGuard requiredPermission={PERMISSIONS.PAYMENTS_READ}>
                  <Button
                    onClick={() => setAdjustmentDialogOpen(true)}
                    className="bg-[#A31C18] hover:bg-[#851613] text-white whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Create Manual Adjustment
                  </Button>
                </PermissionGuard>
              </div>
            </>
          )}
        </div>
      )}

      {/* Modals */}
      <SimulateRefundDialog
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        payment={selectedRefundPayment}
        onRefundSimulated={handleRefundSimulated}
      />

      <CreateAdjustmentDialog
        open={adjustmentDialogOpen}
        onOpenChange={setAdjustmentDialogOpen}
        onAdjustmentCreated={handleAdjustmentCreated}
      />
    </div>
  );
}
