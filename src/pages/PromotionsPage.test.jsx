import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { PromotionsPage } from './PromotionsPage';
import { promotionService } from '../services/promotionService';
import { ToastProvider } from '../components/ui/toast';

vi.mock('../services/promotionService', () => ({
  promotionService: {
    listPromotions: vi.fn(),
    createPromotion: vi.fn(),
    validatePromotion: vi.fn(),
  },
}));

describe('PromotionsPage (Customer Promotions & Promo Codes)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders promotions header, KPI cards, and promotion codes list', async () => {
    promotionService.listPromotions.mockResolvedValueOnce({
      promotions: [
        {
          _id: 'promo_1',
          code: 'VRUMM50',
          description: '50% off up to ₹50 on rides in Mumbai cluster',
          discountType: 'PERCENTAGE',
          discountValue: 50,
          maxDiscountPaise: 5000,
          minRideFarePaise: 10000,
          firstRideOnly: false,
          allowedVehicleTypes: ['BIKE', 'AUTO', 'CAB'],
          maxTotalRedemptions: 5000,
          currentRedemptions: 1420,
          isActive: true,
          expiresAt: '2026-12-31T23:59:59.000Z',
        },
      ],
      total: 1,
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <PromotionsPage />
        </ToastProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Customer Promotions & Promo Codes/i)).toBeInTheDocument();
    expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Total Redemptions')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('VRUMM50')).toBeInTheDocument();
      expect(screen.getByText('50% OFF')).toBeInTheDocument();
      expect(screen.getAllByText('ACTIVE').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('opens test promo code validator modal and runs simulated validation', async () => {
    promotionService.listPromotions.mockResolvedValueOnce({
      promotions: [
        {
          _id: 'promo_1',
          code: 'VRUMM50',
          discountType: 'PERCENTAGE',
          discountValue: 50,
          maxDiscountPaise: 5000,
          minRideFarePaise: 10000,
          isActive: true,
        },
      ],
      total: 1,
    });

    promotionService.validatePromotion.mockResolvedValueOnce({
      validation: {
        valid: true,
        discountAmountPaise: 5000,
        finalFarePaise: 10000,
        code: 'VRUMM50',
      },
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <PromotionsPage />
        </ToastProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('VRUMM50')).toBeInTheDocument();
    });

    const testButton = screen.getAllByRole('button', { name: /test/i })[0];
    fireEvent.click(testButton);

    expect(screen.getByText('Test Promo Code Eligibility')).toBeInTheDocument();

    const runSimBtn = screen.getByRole('button', { name: /run simulation/i });
    fireEvent.click(runSimBtn);

    await waitFor(() => {
      expect(screen.getByText('Promo Code Eligible')).toBeInTheDocument();
      expect(screen.getByText('- ₹50.00')).toBeInTheDocument();
    });
  });
});
