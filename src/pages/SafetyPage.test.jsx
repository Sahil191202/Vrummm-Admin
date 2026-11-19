import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { SafetyPage } from './SafetyPage';
import { safetyService } from '../services/safetyService';

vi.mock('../services/safetyService', () => ({
  safetyService: {
    listIncidents: vi.fn(),
    getIncident: vi.fn(),
    resolveIncident: vi.fn(),
    listSupportTickets: vi.fn(),
    getSupportTicket: vi.fn(),
    addTicketMessage: vi.fn(),
    updateTicketStatus: vi.fn(),
    getSharedTrip: vi.fn(),
  },
}));

vi.mock('../components/auth/PermissionGuard', () => ({
  PermissionGuard: ({ children }) => <>{children}</>,
}));

describe('SafetyPage (Safety Incidents & Support Desk)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders incidents desk, summary cards, and displays SOS incident', async () => {
    safetyService.listIncidents.mockResolvedValue({
      incidents: [
        {
          _id: '65f0inc00000000000000101',
          rideId: '65f01a0123456789012345a1',
          type: 'SOS_SIMULATED',
          severity: 'CRITICAL',
          status: 'REPORTED',
          reportedBy: { name: 'Aarav Patel', role: 'CUSTOMER' },
          captain: { name: 'Suresh Kamble', vehicleNumber: 'MH02BZ4921' },
          address: 'Linking Road, Bandra West, Mumbai 400050',
          description: 'Passenger triggered simulated in-app SOS panic trigger.',
          createdAt: '2026-10-30T05:33:45.000Z',
        },
      ],
      total: 1,
    });

    safetyService.listSupportTickets.mockResolvedValue({
      tickets: [],
      total: 0,
    });

    render(
      <BrowserRouter>
        <SafetyPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Safety Operations & Support Desk/i)).toBeInTheDocument();
    expect(screen.getByText('Active SOS Alerts')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText('SOS_SIMULATED').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('CRITICAL').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Aarav Patel')).toBeInTheDocument();
      expect(screen.getByText(/Linking Road, Bandra West/i)).toBeInTheDocument();
      expect(screen.getByText(/Active Emergency SOS Trigger\(s\) Detected!/i)).toBeInTheDocument();
    });
  });

  it('switches to support tickets tab and displays ticket list', async () => {
    safetyService.listIncidents.mockResolvedValue({
      incidents: [],
      total: 0,
    });

    safetyService.listSupportTickets.mockResolvedValue({
      tickets: [
        {
          _id: '65f0tkt00000000000000101',
          rideId: 'ride_123',
          subject: 'Disputed peak surge surcharge on morning Bandra ride',
          category: 'BILLING',
          priority: 'URGENT',
          status: 'OPEN',
          user: { name: 'Aarav Patel', email: 'aarav.patel@example.com', role: 'CUSTOMER' },
          messages: [{ sender: 'Aarav Patel', message: 'Estimate was ₹80, fare was ₹95' }],
          createdAt: '2026-10-30T05:40:00.000Z',
        },
      ],
      total: 1,
    });

    render(
      <BrowserRouter>
        <SafetyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(safetyService.listIncidents).toHaveBeenCalled();
    });

    // Switch to tickets tab
    const ticketsTabButton = screen.getByRole('button', { name: /Support Tickets Desk/i });
    fireEvent.click(ticketsTabButton);

    await waitFor(() => {
      expect(screen.getByText('Disputed peak surge surcharge on morning Bandra ride')).toBeInTheDocument();
      expect(screen.getAllByText('BILLING').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('URGENT').length).toBeGreaterThanOrEqual(1);
    });
  });
});
