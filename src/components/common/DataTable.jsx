import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { EmptyState } from '../ui/empty-state';
import { ErrorState } from '../ui/error-state';
import { Button } from '../ui/button';

/**
 * Reusable server-side paginated DataTable with loading skeletons,
 * empty state, error/retry state, and touch-accessible controls.
 */
export function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
  pagination,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filter parameters.',
  sortColumn,
  sortDirection,
  onSort,
}) {
  if (isError) {
    return (
      <ErrorState
        title="Failed to load records"
        message={error?.message || 'A server error occurred while retrieving data.'}
        code={error?.code}
        requestId={error?.requestId}
        onRetry={onRetry}
      />
    );
  }

  const {
    page = 1,
    pages = 1,
    total = 0,
    limit = 20,
    onPageChange,
    onLimitChange,
  } = pagination || {};

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-2xl border border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#171717] shadow-sm">
        <table className="w-full text-left text-xs text-[#171717] dark:text-[#F4F6F5]">
          <thead className="border-b border-[#E2E8E4] dark:border-[#2A322D] text-[11px] uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0] font-semibold bg-[#F5F7F6] dark:bg-[#0B1A13]/50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`py-3.5 px-4 font-semibold ${col.align === 'right' ? 'text-right' : ''} ${
                    col.sortable ? 'cursor-pointer select-none hover:text-[#171717] dark:hover:text-[#F4F6F5]' : ''
                  }`}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 ${
                      col.align === 'right' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-[#9AA6A0]">
                        {sortColumn === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-[#A31C18]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-[#A31C18]" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8E4]/80 dark:divide-[#2A322D]/60">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-4">
                      <Skeleton className="h-4 w-3/4 rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State Row
              <tr>
                <td colSpan={columns.length} className="py-8 px-4 text-center">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    className="border-0 shadow-none bg-transparent dark:bg-transparent py-6"
                  />
                </td>
              </tr>
            ) : (
              // Render Data Rows
              data.map((item, rowIdx) => (
                <tr
                  key={item.id || item._id || rowIdx}
                  className="transition-colors hover:bg-[#F5F7F6] dark:hover:bg-[#0B1A13]/80"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={`py-3.5 px-4 align-middle ${
                        col.align === 'right' ? 'text-right' : ''
                      }`}
                    >
                      {col.render ? col.render(item, rowIdx) : item[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && !isLoading && data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1 text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-[#171717] dark:text-[#F4F6F5]">{data.length}</strong> of{' '}
              <strong className="text-[#171717] dark:text-[#F4F6F5]">{total}</strong> total records
            </span>
            {onLimitChange && (
              <div className="flex items-center gap-1.5 ml-3">
                <span className="text-[11px]">Rows:</span>
                <select
                  value={limit}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                  className="bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] rounded-lg px-2 py-1 text-xs text-[#171717] dark:text-[#F4F6F5] focus:outline-none focus:ring-1 focus:ring-[#A31C18]"
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="mr-2 text-[11px]">
              Page <strong className="text-[#171717] dark:text-[#F4F6F5]">{page}</strong> of{' '}
              <strong className="text-[#171717] dark:text-[#F4F6F5]">{pages || 1}</strong>
            </span>

            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => onPageChange?.(1)}
              aria-label="First page"
              className="h-8 w-8 min-h-[36px] min-w-[36px]"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
              aria-label="Previous page"
              className="h-8 w-8 min-h-[36px] min-w-[36px]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= pages}
              onClick={() => onPageChange?.(page + 1)}
              aria-label="Next page"
              className="h-8 w-8 min-h-[36px] min-w-[36px]"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= pages}
              onClick={() => onPageChange?.(pages)}
              aria-label="Last page"
              className="h-8 w-8 min-h-[36px] min-w-[36px]"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
