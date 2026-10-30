import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterBar } from './FilterBar';

describe('FilterBar Component', () => {
  const statusOptions = [
    { value: 'SEARCHING', label: 'Searching' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  it('triggers onSearchChange when typing in search input', () => {
    const handleSearch = vi.fn();
    render(
      <FilterBar
        searchQuery=""
        onSearchChange={handleSearch}
        statusOptions={statusOptions}
      />,
    );

    const input = screen.getByPlaceholderText(/Search by ID, customer/i);
    fireEvent.change(input, { target: { value: 'Bandra' } });
    expect(handleSearch).toHaveBeenCalledWith('Bandra');
  });

  it('triggers onStatusChange and onVehicleChange when selecting filters', () => {
    const handleStatus = vi.fn();
    const handleVehicle = vi.fn();

    render(
      <FilterBar
        statusFilter="ALL"
        onStatusChange={handleStatus}
        statusOptions={statusOptions}
        vehicleFilter="ALL"
        onVehicleChange={handleVehicle}
        vehicleOptions={['ALL', 'BIKE', 'AUTO', 'CAB']}
      />,
    );

    const selects = screen.getAllByRole('combobox');
    // Status select
    fireEvent.change(selects[0], { target: { value: 'SEARCHING' } });
    expect(handleStatus).toHaveBeenCalledWith('SEARCHING');

    // Vehicle select
    fireEvent.change(selects[1], { target: { value: 'BIKE' } });
    expect(handleVehicle).toHaveBeenCalledWith('BIKE');
  });

  it('shows reset button when filters are active and triggers onReset', () => {
    const handleReset = vi.fn();
    const { rerender } = render(
      <FilterBar
        searchQuery=""
        statusFilter="ALL"
        statusOptions={statusOptions}
        onReset={handleReset}
      />,
    );

    expect(screen.queryByRole('button', { name: /Reset/i })).not.toBeInTheDocument();

    rerender(
      <FilterBar
        searchQuery="Andheri"
        statusFilter="ACTIVE"
        statusOptions={statusOptions}
        onReset={handleReset}
      />,
    );

    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
