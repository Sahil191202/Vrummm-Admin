import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Ban, ShieldCheck, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { DataTable } from '../components/common/DataTable';
import { FilterBar } from '../components/common/FilterBar';
import { ConfirmWithReasonDialog } from '../components/common/ConfirmWithReasonDialog';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { formatPaise, formatKolkata, maskPhone } from '../utils/formatters';
import { PERMISSIONS } from '../contracts/rbac';
import { useToast } from '../components/ui/toast';

const STATUS_OPTIONS = [
  { value: 'SEARCHING', label: 'Searching' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'ARRIVED', label: 'Arrived' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'NO_CAPTAIN', label: 'No Captain' },
];

export function BookingsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  // Cancellation Dialog State
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const res = await bookingService.listBookings({
        page,
        limit,
        status: statusFilter,
        vehicleType: vehicleFilter,
        search: searchQuery.trim(),
      });
      setBookings(res.bookings || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, statusFilter, vehicleFilter, searchQuery]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleResetFilters = () => {
    setStatusFilter('ALL');
    setVehicleFilter('ALL');
    setSearchQuery('');
    setPage(1);
  };

  const handleConfirmCancel = async ({ reason, targetId }) => {
    await bookingService.cancelBooking(targetId, { reason });
    addToast({
      title: 'Booking Cancelled',
      description: `Booking ${targetId} cancelled with reason logged to audit trail.`,
      variant: 'default',
    });
    loadBookings();
  };

  const columns = [
    {
      key: '_id',
      header: 'Booking ID',
      render: (item) => (
        <span className="font-mono font-bold text-[#171717] dark:text-[#F4F6F5]">
          {(item.idempotencyKey || item._id).slice(0, 14)}...
        </span>
      ),
    },
    {
      key: 'vehicleType',
      header: 'Service',
      render: (item) => (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] text-[#15803D] dark:text-[#1FD88A]">
          {item.vehicleType}
        </span>
      ),
    },
    {
      key: 'route',
      header: 'Route (Pickup → Drop)',
      render: (item) => (
        <div className="flex flex-col max-w-xs">
          <span className="font-semibold text-[#171717] dark:text-[#F4F6F5] truncate" title={item.pickup?.address}>
            {item.pickup?.address || 'Pickup Point'}
          </span>
          <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] truncate" title={item.drop?.address}>
            → {item.drop?.address || 'Drop Point'}
          </span>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#171717] dark:text-[#F4F6F5]">
            {item.userId?.displayName || 'Customer'}
          </span>
          <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] font-mono">
            {maskPhone(item.customerPhone || item.userId?.email)}
          </span>
        </div>
      ),
    },
    {
      key: 'fareSnapshot',
      header: 'Fare',
      render: (item) => (
        <span className="font-mono font-bold text-[#171717] dark:text-[#F4F6F5]">
          {formatPaise(item.fareSnapshot?.totalPaise)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const s = item.status;
        if (s === 'ACTIVE' || s === 'IN_PROGRESS') return <Badge variant="forest" dot>ACTIVE</Badge>;
        if (s === 'COMPLETED') return <Badge variant="success">COMPLETED</Badge>;
        if (s === 'SEARCHING') return <Badge variant="warning">SEARCHING</Badge>;
        if (s === 'CANCELLED') return <Badge variant="danger">CANCELLED</Badge>;
        if (s === 'NO_CAPTAIN') return <Badge variant="outline">NO CAPTAIN</Badge>;
        return <Badge variant="secondary">{s}</Badge>;
      },
    },
    {
      key: 'createdAt',
      header: 'Created (IST)',
      render: (item) => (
        <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] font-mono whitespace-nowrap">
          {formatKolkata(item.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/bookings/${item._id}`)}
            className="h-8 px-2.5 text-xs gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Button>

          {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' && (
            <PermissionGuard permission={PERMISSIONS.RIDES_RESOLVE}>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSelectedBookingForCancel(item);
                  setCancelDialogOpen(true);
                }}
                className="h-8 px-2.5 text-xs gap-1"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </Button>
            </PermissionGuard>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E2E8E4] dark:border-[#2A322D]">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F6F5]">
            Bookings & Ride Monitoring
          </h1>
          <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
            Real-time search, dispatch audits, state timelines & manual operator resolutions
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadBookings}
          disabled={isLoading}
          className="gap-2 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setPage(1);
        }}
        statusOptions={STATUS_OPTIONS}
        vehicleFilter={vehicleFilter}
        onVehicleChange={(v) => {
          setVehicleFilter(v);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Paginated Data Table */}
      <DataTable
        columns={columns}
        data={bookings}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={loadBookings}
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
        emptyTitle="No bookings found"
        emptyDescription="No ride records matched your filter criteria in the Mumbai cluster."
      />

      {/* Reason Required Cancellation Dialog */}
      <ConfirmWithReasonDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Cancel Booking & Abort Dispatch"
        description="Cancelling an active booking notifies both rider and captain. A written justification is permanently logged to the immutable audit log."
        actionName="bookings.admin_cancel"
        targetId={selectedBookingForCancel?._id}
        targetType="Booking"
        confirmLabel="Cancel Booking"
        confirmVariant="destructive"
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
