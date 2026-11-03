import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { DocumentsPage } from './DocumentsPage';
import { documentService } from '../services/documentService';
import { ToastProvider } from '../components/ui/toast';

vi.mock('../services/documentService', () => ({
  documentService: {
    listCaptains: vi.fn(),
  },
}));

describe('DocumentsPage (Captain & Vehicle Document Review)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders queue header, summary stat cards, and candidate list', async () => {
    documentService.listCaptains.mockResolvedValueOnce({
      captains: [
        {
          _id: '65f02c0123456789012345c1',
          userId: {
            displayName: 'Suresh Kamble',
            email: 'suresh.k@example.com',
            phone: '+919820011111',
          },
          vehicleType: 'BIKE',
          approvalStatus: 'PENDING',
          vehicle: {
            make: 'Bajaj',
            model: 'Pulsar 150',
            year: 2022,
            registrationNumber: 'MH02BZ4921',
          },
          createdAt: '2026-10-25T10:00:00.000Z',
        },
      ],
      total: 1,
      page: 1,
      pages: 1,
      limit: 20,
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <DocumentsPage />
        </ToastProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Captain & Vehicle Document Review/i)).toBeInTheDocument();
    expect(screen.getByText(/Total in Queue/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending Audit/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Suresh Kamble')).toBeInTheDocument();
      expect(screen.getByText(/MH02BZ4921/i)).toBeInTheDocument();
      expect(screen.getByText('PENDING REVIEW')).toBeInTheDocument();
      // Masked phone verification
      expect(screen.getByText(/\+91 •••• 1111/)).toBeInTheDocument();
    });
  });

  it('displays empty state when no candidates match filters', async () => {
    documentService.listCaptains.mockResolvedValueOnce({
      captains: [],
      total: 0,
      page: 1,
      pages: 1,
      limit: 20,
    });

    render(
      <BrowserRouter>
        <ToastProvider>
          <DocumentsPage />
        </ToastProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/No captain candidates found/i)).toBeInTheDocument();
    });
  });
});
