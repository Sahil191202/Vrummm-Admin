import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { IncentivesPage } from './IncentivesPage';
import { incentiveService } from '../services/incentiveService';
import { ToastProvider } from '../components/ui/toast';

vi.mock('../services/incentiveService', () => ({
  incentiveService: {
    listCampaigns: vi.fn(),
    createCampaign: vi.fn(),
  },
}));

describe('IncentivesPage (Captain Incentives & Rewards)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders campaigns table, milestone metrics, and reward amounts in paise', async () => {
    incentiveService.listCampaigns.mockResolvedValueOnce({
      campaigns: [
        {
          _id: 'inc_1',
          name: 'Bandra-BKC Peak Hour 5-Ride Boost',
          description: 'Complete 5 peak-hour rides between 8 AM - 12 PM',
          targetType: 'PEAK_HOUR',
          targetCount: 5,
          rewardAmountPaise: 25000,
          completedCount: 384,
          isActive: true,
          expiresAt: '2026-11-30T23:59:59.000Z',
        },
      ],
      total: 1,
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <IncentivesPage />
        </ToastProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Captain Incentives & Rewards/i)).toBeInTheDocument();
    expect(screen.getByText('Driver Milestones Hit')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Bandra-BKC Peak Hour 5-Ride Boost')).toBeInTheDocument();
      expect(screen.getByText('PEAK_HOUR')).toBeInTheDocument();
      expect(screen.getByText('5 rides')).toBeInTheDocument();
      expect(screen.getByText('₹250.00')).toBeInTheDocument();
      expect(screen.getByText('384 claims')).toBeInTheDocument();
      expect(screen.getAllByText('ACTIVE').length).toBeGreaterThanOrEqual(1);
    });
  });
});
