import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResolveIncidentDialog } from './ResolveIncidentDialog';
import { TicketDetailModal } from './TicketDetailModal';
import { TripSharePreviewModal } from './TripSharePreviewModal';
import { safetyService } from '../../services/safetyService';

vi.mock('../../services/safetyService', () => ({
  safetyService: {
    resolveIncident: vi.fn(),
    addTicketMessage: vi.fn(),
    updateTicketStatus: vi.fn(),
    getSharedTrip: vi.fn(),
  },
}));

describe('Safety Components Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ResolveIncidentDialog', () => {
    const mockIncident = {
      _id: 'inc_101',
      type: 'SOS_SIMULATED',
      severity: 'CRITICAL',
      status: 'REPORTED',
      description: 'In-app SOS panic trigger at Linking Road, Bandra West.',
    };

    it('requires mandatory audit justification (>= 5 chars) before allowing submit', async () => {
      render(
        <ResolveIncidentDialog
          open={true}
          onOpenChange={vi.fn()}
          incident={mockIncident}
          onSuccess={vi.fn()}
        />
      );

      expect(screen.getByText('Update Incident Resolution')).toBeInTheDocument();
      const submitBtn = screen.getByRole('button', { name: /Apply Resolution/i });
      expect(submitBtn).toBeDisabled();

      // Enter short reason (< 5 chars)
      const reasonInput = screen.getByPlaceholderText(/Written justification recorded permanently/i);
      fireEvent.change(reasonInput, { target: { value: 'test' } });
      expect(submitBtn).toBeDisabled();

      // Enter valid reason (>= 5 chars)
      fireEvent.change(reasonInput, { target: { value: 'Verified passenger safe on phone' } });
      expect(submitBtn).not.toBeDisabled();
    });

    it('submits resolution and closes dialog on valid submit', async () => {
      safetyService.resolveIncident.mockResolvedValueOnce({
        incident: { ...mockIncident, status: 'RESOLVED' },
      });
      const handleSuccess = vi.fn();
      const handleOpenChange = vi.fn();

      render(
        <ResolveIncidentDialog
          open={true}
          onOpenChange={handleOpenChange}
          incident={mockIncident}
          onSuccess={handleSuccess}
        />
      );

      const notesInput = screen.getByPlaceholderText(/Spoke with passenger, confirmed safe/i);
      fireEvent.change(notesInput, { target: { value: 'Confirmed false alarm by user' } });

      const reasonInput = screen.getByPlaceholderText(/Written justification recorded permanently/i);
      fireEvent.change(reasonInput, { target: { value: 'Standard drill audit verification' } });

      const submitBtn = screen.getByRole('button', { name: /Apply Resolution/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(safetyService.resolveIncident).toHaveBeenCalledWith('inc_101', {
          status: 'INVESTIGATING',
          resolutionNotes: 'Confirmed false alarm by user',
          reason: 'Standard drill audit verification',
        });
        expect(handleSuccess).toHaveBeenCalled();
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('TicketDetailModal', () => {
    const mockTicket = {
      _id: 'tkt_201',
      subject: 'Excessive fare query on BKC ride',
      category: 'BILLING',
      priority: 'HIGH',
      status: 'OPEN',
      user: { name: 'Priya Sharma', email: 'priya@example.com', role: 'CUSTOMER' },
      messages: [
        { sender: 'Priya Sharma', role: 'CUSTOMER', message: 'Why was peak surge charged?', at: '2026-10-30T05:00:00Z' },
      ],
    };

    it('renders ticket information and allows adding messages', async () => {
      safetyService.addTicketMessage.mockResolvedValueOnce({
        ticket: {
          ...mockTicket,
          messages: [
            ...mockTicket.messages,
            { sender: 'Support Ops', role: 'SUPPORT', message: 'Checking tariff rates.', at: '2026-10-30T05:05:00Z' },
          ],
        },
      });

      render(
        <TicketDetailModal
          open={true}
          onOpenChange={vi.fn()}
          ticket={mockTicket}
          onTicketUpdated={vi.fn()}
        />
      );

      expect(screen.getByText('Excessive fare query on BKC ride')).toBeInTheDocument();
      expect(screen.getByText('Why was peak surge charged?')).toBeInTheDocument();

      const replyInput = screen.getByPlaceholderText(/Type your response to the customer\/captain/i);
      fireEvent.change(replyInput, { target: { value: 'Checking tariff rates.' } });

      const sendBtn = screen.getByRole('button', { name: /Send/i });
      fireEvent.click(sendBtn);

      await waitFor(() => {
        expect(safetyService.addTicketMessage).toHaveBeenCalledWith('tkt_201', {
          message: 'Checking tariff rates.',
        });
      });
    });
  });

  describe('TripSharePreviewModal', () => {
    it('allows searching and displays public trip details', async () => {
      safetyService.getSharedTrip.mockResolvedValueOnce({
        sharedTrip: {
          token: 'share_123',
          status: 'IN_PROGRESS',
          vehicleType: 'AUTO',
          vehicleNumber: 'MH02BZ4921',
          captainName: 'Suresh Kamble',
          pickup: { address: 'Linking Road, Bandra' },
          drop: { address: 'CSMT Station' },
        },
      });

      render(
        <TripSharePreviewModal
          open={true}
          onOpenChange={vi.fn()}
          initialToken="share_123"
        />
      );

      expect(screen.getByText('Trip-Share Token Inspection')).toBeInTheDocument();
      const inspectBtn = screen.getByRole('button', { name: /Inspect/i });
      fireEvent.click(inspectBtn);

      await waitFor(() => {
        expect(screen.getByText(/MH02BZ4921/)).toBeInTheDocument();
        expect(screen.getByText(/Linking Road, Bandra/)).toBeInTheDocument();
        expect(screen.getByText(/CSMT Station/)).toBeInTheDocument();
        expect(screen.getByText('112 / 100')).toBeInTheDocument();
      });
    });
  });
});
