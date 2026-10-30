import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataTable } from './DataTable';

describe('DataTable Component', () => {
  const columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Customer' },
    { key: 'amount', header: 'Amount', align: 'right' },
  ];

  const sampleData = [
    { id: 'VRM-001', name: 'Aarav Patel', amount: '₹95.00' },
    { id: 'VRM-002', name: 'Neha Sharma', amount: '₹145.00' },
  ];

  it('renders columns and data rows properly', () => {
    render(<DataTable columns={columns} data={sampleData} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('VRM-001')).toBeInTheDocument();
    expect(screen.getByText('Aarav Patel')).toBeInTheDocument();
    expect(screen.getByText('₹95.00')).toBeInTheDocument();
  });

  it('renders loading skeleton when isLoading is true', () => {
    const { container } = render(<DataTable columns={columns} data={[]} isLoading={true} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders EmptyState when data is empty and not loading', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        emptyTitle="No Bookings Found"
        emptyDescription="Please adjust filters"
      />,
    );

    expect(screen.getByText('No Bookings Found')).toBeInTheDocument();
    expect(screen.getByText('Please adjust filters')).toBeInTheDocument();
  });

  it('renders ErrorState with retry button when isError is true', () => {
    const handleRetry = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={[]}
        isError={true}
        error={{ message: 'Server connection timeout', code: 'TIMEOUT_ERR' }}
        onRetry={handleRetry}
      />,
    );

    expect(screen.getByText(/Failed to load records/i)).toBeInTheDocument();
    expect(screen.getByText(/Server connection timeout/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Retry Operation/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('handles server-side pagination controls', () => {
    const handlePageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={sampleData}
        pagination={{
          page: 2,
          pages: 5,
          total: 100,
          limit: 20,
          onPageChange: handlePageChange,
        }}
      />,
    );

    expect(screen.getByText(/Page/i)).toBeInTheDocument();
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);

    const nextBtn = screen.getByRole('button', { name: /Next page/i });
    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(3);

    const prevBtn = screen.getByRole('button', { name: /Previous page/i });
    fireEvent.click(prevBtn);
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });
});
