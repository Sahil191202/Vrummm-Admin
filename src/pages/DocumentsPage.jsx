import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck,
  FileText,
  Clock,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  Ban,
  Search,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { documentService } from '../services/documentService';
import { DataTable } from '../components/common/DataTable';
import { FilterBar } from '../components/common/FilterBar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PERMISSIONS } from '../contracts/rbac';
import { formatKolkata, maskPhone } from '../utils/formatters';
import { useToast } from '../components/ui/toast';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

export function DocumentsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [captains, setCaptains] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  const loadCaptains = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const res = await documentService.listCaptains({
        page,
        limit,
        approvalStatus: statusFilter,
        search: searchQuery.trim(),
      });
      setCaptains(res.captains || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch (err) {
      setIsError(true);
      setError(err);
      addToast({
        title: 'Failed to fetch captains',
        description: err.message || 'Please check network and credentials.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, statusFilter, searchQuery, addToast]);

  useEffect(() => {
    loadCaptains();
  }, [loadCaptains]);

  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setSearchQuery('');
    setPage(1);
  };

  const columns = [
    {
      key: 'captain',
      header: 'Captain Profile',
      render: (item) => {
        const name = item.userId?.displayName || 'Captain Candidate';
        const email = item.userId?.email || '—';
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#15803D]/15 text-[#15803D] dark:bg-[#1FD88A]/20 dark:text-[#1FD88A] font-bold text-xs flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-bold text-[#171717] dark:text-[#F4F6F5] leading-tight">{name}</p>
              <p className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">{email}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'vehicle',
      header: 'Vehicle & Plate',
      render: (item) => {
        const veh = item.vehicle;
        return (
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-xs text-[#171717] dark:text-[#F4F6F5]">
                {veh?.registrationNumber || 'Plate Pending'}
              </span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                {item.vehicleType || 'BIKE'}
              </Badge>
            </div>
            <p className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
              {veh?.make ? `${veh.make} ${veh.model || ''} (${veh.year || '—'})` : 'Registration in progress'}
            </p>
          </div>
        );
      },
    },
    {
      key: 'phone',
      header: 'Contact Phone',
      render: (item) => (
        <span className="font-mono text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
          {maskPhone(item.userId?.phone)}
        </span>
      ),
    },
    {
      key: 'approvalStatus',
      header: 'Review Status',
      render: (item) => {
        const status = item.approvalStatus;
        if (status === 'APPROVED') return <Badge variant="success">APPROVED</Badge>;
        if (status === 'REJECTED') return <Badge variant="danger">REJECTED</Badge>;
        if (status === 'SUSPENDED') return <Badge variant="warning">SUSPENDED</Badge>;
        return <Badge variant="forest">PENDING REVIEW</Badge>;
      },
    },
    {
      key: 'submittedAt',
      header: 'Onboarding Date',
      render: (item) => (
        <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] font-mono">
          {formatKolkata(item.createdAt, 'dateOnly')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/documents/${item._id}`)}
          className="gap-1.5 text-xs h-8"
        >
          <span>Review Docs</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8E4] dark:border-[#2A322D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A]">
              <FileCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#1FD88A]">
              Compliance & Verification
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F6F5]">
            Captain & Vehicle Document Review
          </h1>
          <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
            Audit identity, driving licences, RC books, and insurance with mandatory review logging.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadCaptains}
          disabled={isLoading}
          className="gap-2 text-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </Button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Total in Queue</p>
            <p className="text-2xl font-black text-[#171717] dark:text-[#F4F6F5] font-mono mt-1">
              {total}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] flex items-center justify-center text-[#15803D] dark:text-[#1FD88A]">
            <FileText className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Pending Audit</p>
            <p className="text-2xl font-black text-[#B45309] dark:text-[#F5B301] font-mono mt-1">
              {captains.filter((c) => c.approvalStatus === 'PENDING').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] flex items-center justify-center text-[#B45309] dark:text-[#F5B301]">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Approved Fleet</p>
            <p className="text-2xl font-black text-[#15803D] dark:text-[#1FD88A] font-mono mt-1">
              {captains.filter((c) => c.approvalStatus === 'APPROVED').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] flex items-center justify-center text-[#15803D] dark:text-[#1FD88A]">
            <UserCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">Rejected / Suspended</p>
            <p className="text-2xl font-black text-[#DC2626] dark:text-[#FF5A52] font-mono mt-1">
              {captains.filter((c) => c.approvalStatus === 'REJECTED' || c.approvalStatus === 'SUSPENDED').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] flex items-center justify-center text-[#DC2626] dark:text-[#FF5A52]">
            <Ban className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
        searchPlaceholder="Search candidate by name, phone, plate..."
        statusValue={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        statusOptions={STATUS_OPTIONS}
        onReset={handleResetFilters}
      />

      {/* Server-Side Paginated Captain Table */}
      <DataTable
        columns={columns}
        data={captains}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={loadCaptains}
        emptyTitle="No captain candidates found"
        emptyDescription="No document review candidates matched your filter criteria."
        pagination={{
          page,
          pages,
          total,
          limit,
          onPageChange: (p) => setPage(p),
          onLimitChange: (l) => {
            setLimit(l);
            setPage(1);
          },
        }}
      />
    </div>
  );
}
