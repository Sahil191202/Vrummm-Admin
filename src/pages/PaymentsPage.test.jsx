import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { PaymentsPage } from './PaymentsPage';
import { paymentService } from '../services/paymentService';
import { ledgerService } from '../services/ledgerService';
import { ToastProvider } from '../components/ui/toast';
import { useAuthStore } from '../store/authStore';
import { PERMISSIONS, ROLES } from '../contracts/rbac';

vi.mock('../services/paymentService', () => ({
  paymentService: {
    listPayments: vi.fn(),
    simulateRefund: vi.fn(),
  },
}));

vi.mock('../services/ledgerService', () => ({
  ledgerService: {
    listEntries: vi.fn(),
    getBalance: vi.fn(),
    createAdjustment: vi.fn(),
    getReconciliationReport: vi.fn(),
  },
}));

describe('PaymentsPage (Payments, Append-Only Ledger & Reconciliation)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().setSession({
      accessToken: 'test-token',
      user: { role: ROLES.FINANCE, id: 'test-fin' },
      permissions: [PERMISSIONS.PAYMENTS_READ, PERMISSIONS.PAYMENTS_REFUND_SIMULATE],
    });
  });

  it('renders payments stream with transaction details and simulated refund action', async () => {
    paymentService.listPayments.mockResolvedValueOnce({
      payments: [
        {
          _id: 'pay_mum_001',
          rideId: '65f01a0123456789012345a1',
          customerName: 'Aarav Patel',
          customerPhone: '+919876500001',
          captainName: 'Suresh Kamble',
          vehicleNumber: 'MH02BZ4921',
          amountPaise: 9500,
          provider: 'RAZORPAY',
          status: 'CAPTURED',
          createdAt: '2026-10-30T05:35:00.000Z',
        },
      ],
      total: 1,
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <PaymentsPage />
        </ToastProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Payments, Ledger & Reconciliation/i)).toBeInTheDocument();
    expect(screen.getByText('Payments Stream')).toBeInTheDocument();
    expect(screen.getByText('Append-Only Ledger')).toBeInTheDocument();
    expect(screen.getByText(/Reconciliation & Balances/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('pay_mum_001')).toBeInTheDocument();
      expect(screen.getByText('Aarav Patel')).toBeInTheDocument();
      expect(screen.getByText('₹95.00')).toBeInTheDocument();
      expect(screen.getAllByText('CAPTURED').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByRole('button', { name: /simulate refund/i })).toBeInTheDocument();
    });
  });

  it('switches to Append-Only Ledger tab and displays immutable entries with parity checks', async () => {
    paymentService.listPayments.mockResolvedValueOnce({ payments: [], total: 0 });

    ledgerService.listEntries.mockResolvedValueOnce({
      entries: [
        {
          _id: 'ledg_001',
          accountUserId: '65f0plat0000000000000000',
          accountType: 'PLATFORM',
          direction: 'CREDIT',
          amountPaise: 19500,
          entryType: 'FARE_COLLECTED',
          description: 'Ride fare captured from Priya Sharma',
          reason: 'Automated settlement of completed ride',
          createdAt: '2026-10-30T05:22:01.000Z',
        },
      ],
      total: 1,
    });

    ledgerService.getBalance.mockResolvedValueOnce({
      balancePaise: 19500,
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <PaymentsPage />
        </ToastProvider>
      </BrowserRouter>,
    );

    const ledgerTab = screen.getByRole('button', { name: /append-only ledger/i });
    fireEvent.click(ledgerTab);

    expect(screen.getByText(/APPEND-ONLY DOUBLE ENTRY AUDIT TRAIL/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('ledg_001')).toBeInTheDocument();
      expect(screen.getByText('+ CREDIT')).toBeInTheDocument();
      expect(screen.getAllByText('FARE_COLLECTED').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Ride fare captured from Priya Sharma')).toBeInTheDocument();
    });

    // Verify STRICT RULE: No edit or delete controls exist in ledger view
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('switches to Reconciliation tab and displays balanced parity metrics', async () => {
    paymentService.listPayments.mockResolvedValueOnce({ payments: [], total: 0 });

    ledgerService.getReconciliationReport.mockResolvedValueOnce({
      balancePaise: 125000,
      totalCollectedPaise: 850000,
      totalCommissionPaise: 127500,
      totalCaptainEarningsPaise: 722500,
      totalPayoutsPaise: 500000,
      discrepanciesCount: 0,
      reconciledAt: '2026-10-30T06:00:00.000Z',
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <PaymentsPage />
        </ToastProvider>
      </BrowserRouter>,
    );

    const reconTab = screen.getByRole('button', { name: /reconciliation & balances/i });
    fireEvent.click(reconTab);

    await waitFor(() => {
      expect(screen.getByText('Platform Treasury Balance')).toBeInTheDocument();
      expect(screen.getByText('₹1,250.00')).toBeInTheDocument();
      expect(screen.getByText(/0 Discrepancies/i)).toBeInTheDocument();
      expect(screen.getByText(/100% matched debit\/credit parity/i)).toBeInTheDocument();
    });
  });
});
