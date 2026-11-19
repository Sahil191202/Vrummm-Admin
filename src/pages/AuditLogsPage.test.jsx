import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuditLogsPage } from './AuditLogsPage';
import { auditService } from '../services/auditService';

vi.mock('../services/auditService', () => ({
  auditService: {
    listAuditLogs: vi.fn(),
    getOperationsReport: vi.fn(),
    getFinancialReport: vi.fn(),
    getCaptainLeaderboard: vi.fn(),
  },
}));

describe('AuditLogsPage (Compliance Audit Trail & Reports)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders immutable audit log stream with actor, action, and written justification', async () => {
    auditService.listAuditLogs.mockResolvedValue({
      logs: [
        {
          _id: '65f0aud00000000000000001',
          actorId: 'usr_admin',
          actorName: 'Super Admin',
          actorRole: 'SUPER_ADMIN',
          action: 'fares.update_config',
          targetType: 'FareConfig',
          targetId: '65f0fare0003',
          reason: 'Updated monsoon tariff parameters to align with index fuel price inflation in Mumbai MMR',
          requestId: 'req_aud_001',
          createdAt: '2026-11-03T11:20:00.000Z',
        },
      ],
      total: 1,
    });

    auditService.getOperationsReport.mockResolvedValue({ report: {} });
    auditService.getFinancialReport.mockResolvedValue({ report: {} });
    auditService.getCaptainLeaderboard.mockResolvedValue({ leaderboard: [] });

    render(
      <BrowserRouter>
        <AuditLogsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Analytics & Audit Trail Desk/i)).toBeInTheDocument();
    expect(screen.getByText(/Tamper-Evident Write-Ahead Audit Trail/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText('fares.update_config').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Super Admin')).toBeInTheDocument();
      expect(screen.getAllByText('SUPER_ADMIN').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Updated monsoon tariff parameters to align/i)).toBeInTheDocument();
      expect(screen.getByText('req_aud_001')).toBeInTheDocument();
    });
  });

  it('switches to reports tab and displays operations, financial, and leaderboard data', async () => {
    auditService.listAuditLogs.mockResolvedValue({ logs: [], total: 0 });
    auditService.getOperationsReport.mockResolvedValue({
      report: {
        totalBookings: 150,
        completedRides: 135,
        completionRate: '90.0%',
        averageEtaMinutes: 3.8,
        cancelledRides: 15,
      },
    });
    auditService.getFinancialReport.mockResolvedValue({
      report: {
        grossBookingsPaise: 1250000,
        netCommissionPaise: 250000,
        captainPayoutsPaise: 1000000,
        taxCollectedPaise: 62500,
      },
    });
    auditService.getCaptainLeaderboard.mockResolvedValue({
      leaderboard: [
        {
          captainName: 'Suresh Kamble',
          vehicleNumber: 'MH02BZ4921',
          completedRides: 78,
          grossFarePaise: 234000,
          rating: 4.96,
          acceptanceRate: '98%',
        },
      ],
    });

    render(
      <BrowserRouter>
        <AuditLogsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(auditService.listAuditLogs).toHaveBeenCalled();
    });

    // Switch to reports tab
    const reportsTabButton = screen.getByRole('button', { name: /Operations & Financial Analytics/i });
    fireEvent.click(reportsTabButton);

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument(); // total bookings
      expect(screen.getByText('135')).toBeInTheDocument(); // completed rides
      expect(screen.getByText('₹12,500.00')).toBeInTheDocument(); // gross bookings
      expect(screen.getByText('₹2,500.00')).toBeInTheDocument(); // platform commission
      expect(screen.getByText('Suresh Kamble')).toBeInTheDocument(); // leaderboard
      expect(screen.getByText('MH02BZ4921')).toBeInTheDocument();
    });
  });
});
