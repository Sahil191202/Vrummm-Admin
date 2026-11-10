import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { FaresPage } from './FaresPage';
import { fareService } from '../services/fareService';
import { ToastProvider } from '../components/ui/toast';

vi.mock('../services/fareService', () => ({
  fareService: {
    listFareConfigs: vi.fn(),
    getDispatchSettings: vi.fn(),
    createFareConfig: vi.fn(),
    updateDispatchSettings: vi.fn(),
  },
}));

describe('FaresPage (Fare & Dispatch Settings)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tariff configs tab with active version and paise formatting', async () => {
    fareService.listFareConfigs.mockResolvedValueOnce({
      configs: [
        {
          _id: 'fare_01',
          vehicleType: 'BIKE',
          zone: 'mumbai',
          version: 2,
          isActive: true,
          baseFarePaise: 2500, // ₹25.00
          perKmPaise: 1200, // ₹12.00 / km
          perMinutePaise: 150, // ₹1.50 / min
          minimumFarePaise: 3000,
          minimumBillableDistanceMetres: 1500,
          taxes: [{ label: 'GST', basisPoints: 500 }], // 5.00%
          effectiveFrom: '2026-06-01T00:00:00.000Z',
          reason: 'Monsoon fuel index update',
        },
      ],
      total: 1,
    });

    fareService.getDispatchSettings.mockResolvedValueOnce({
      settings: {
        offerDurationSeconds: 10,
        initialRadiusMetres: { BIKE: 2000, AUTO: 3000, CAB: 4000 },
        radiusExpansionMetres: { BIKE: 1000, AUTO: 1500, CAB: 2000 },
        maxRadiusMetres: { BIKE: 6000, AUTO: 8000, CAB: 10000 },
        maxRounds: 3,
        distanceRuleBEnabled: { BIKE: true, AUTO: true, CAB: false },
      },
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <FaresPage />
        </ToastProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Fare & Dispatch Settings/i)).toBeInTheDocument();
    expect(screen.getByText('Fare Configurations')).toBeInTheDocument();
    expect(screen.getByText('Dispatch & Radius Tunables')).toBeInTheDocument();
    expect(screen.getByText(/Relative-Distance Rule/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('CURRENT ACTIVE')).toBeInTheDocument();
      expect(screen.getByText('Version 2')).toBeInTheDocument();
      expect(screen.getByText(/₹25.00/i)).toBeInTheDocument();
      expect(screen.getByText(/₹12.00/i)).toBeInTheDocument();
      expect(screen.getByText('5.00%')).toBeInTheDocument();
    });
  });

  it('switches to Relative-Distance Rule tab and displays interactive simulation', async () => {
    fareService.listFareConfigs.mockResolvedValueOnce({ configs: [], total: 0 });
    fareService.getDispatchSettings.mockResolvedValueOnce({
      settings: {
        initialRadiusMetres: { BIKE: 2500 },
        distanceRuleBEnabled: { BIKE: true },
      },
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <FaresPage />
        </ToastProvider>
      </BrowserRouter>,
    );

    const rulesTab = screen.getByRole('tab', { name: /Relative-Distance Rule/i });
    fireEvent.click(rulesTab);

    expect(screen.getByText(/Interactive Rule Engine Simulator/i)).toBeInTheDocument();
    expect(screen.getByText(/Rule A: Max Pickup Radius/i)).toBeInTheDocument();
    expect(screen.getByText(/Rule B: Relative-Distance/i)).toBeInTheDocument();
  });
});
