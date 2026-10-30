import React from 'react';
import { Search, RotateCcw, Filter, X } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * Reusable filter bar with search, status filter, vehicle type options,
 * and quick-reset action.
 */
export function FilterBar({
  searchQuery = '',
  onSearchChange,
  statusFilter = 'ALL',
  onStatusChange,
  statusOptions = [],
  vehicleFilter = 'ALL',
  onVehicleChange,
  vehicleOptions = ['ALL', 'BIKE', 'AUTO', 'CAB'],
  onReset,
  className = '',
}) {
  const hasActiveFilters =
    searchQuery.trim() !== '' || statusFilter !== 'ALL' || vehicleFilter !== 'ALL';

  return (
    <div
      className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] shadow-sm ${className}`}
    >
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E6A64] dark:text-[#9AA6A0]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search by ID, customer, address..."
          className="w-full bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl pl-9 pr-9 py-2 text-xs text-[#171717] dark:text-[#F4F6F5] placeholder:text-[#5E6A64] dark:placeholder:text-[#9AA6A0] focus:outline-none focus:ring-2 focus:ring-[#A31C18] min-h-[44px]"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange?.('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9AA6A0] hover:text-[#F4F6F5]"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        {statusOptions.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#5E6A64] dark:text-[#9AA6A0] hidden sm:inline">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange?.(e.target.value)}
              className="bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-xs font-semibold text-[#171717] dark:text-[#F4F6F5] focus:outline-none focus:ring-2 focus:ring-[#A31C18] min-h-[44px]"
            >
              <option value="ALL">All Statuses</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label || opt.value}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Vehicle Filter */}
        {vehicleOptions.length > 0 && onVehicleChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#5E6A64] dark:text-[#9AA6A0] hidden sm:inline">
              Vehicle:
            </span>
            <select
              value={vehicleFilter}
              onChange={(e) => onVehicleChange?.(e.target.value)}
              className="bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-3 py-2 text-xs font-semibold text-[#171717] dark:text-[#F4F6F5] focus:outline-none focus:ring-2 focus:ring-[#A31C18] min-h-[44px]"
            >
              {vehicleOptions.map((v) => (
                <option key={v} value={v}>
                  {v === 'ALL' ? 'All Vehicles' : v}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs gap-1.5 text-[#DC2626] dark:text-[#FF5A52] hover:bg-[#FBE9E8] dark:hover:bg-[#2A0F0E]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
