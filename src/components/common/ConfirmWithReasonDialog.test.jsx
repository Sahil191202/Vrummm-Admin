import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfirmWithReasonDialog } from './ConfirmWithReasonDialog';
import { useAuthStore } from '../../store/authStore';
import { ROLES } from '../../contracts/rbac';

describe('ConfirmWithReasonDialog Component', () => {
  beforeEach(() => {
    useAuthStore.getState().setSession({
      accessToken: 'test-token',
      user: { id: 'usr-ops-1', displayName: 'Ops Agent', role: ROLES.OPERATIONS },
    });
  });

  it('renders modal with action details and disabled confirm button when reason is empty', () => {
    render(
      <ConfirmWithReasonDialog
        open={true}
        title="Cancel Ride"
        actionName="rides.admin_cancel"
        targetId="VRM-123"
        targetType="Booking"
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText('Cancel Ride')).toBeInTheDocument();
    expect(screen.getByText('rides.admin_cancel')).toBeInTheDocument();
    expect(screen.getByText('VRM-123')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /Confirm Action/i });
    expect(confirmBtn).toBeDisabled();
  });

  it('validates minimum character length requirement for written reason', async () => {
    render(
      <ConfirmWithReasonDialog
        open={true}
        title="Cancel Ride"
        actionName="rides.admin_cancel"
        targetId="VRM-123"
        minReasonLength={5}
        onConfirm={vi.fn()}
      />,
    );

    const textarea = screen.getByPlaceholderText(/State the operational reason/i);
    fireEvent.change(textarea, { target: { value: 'Bad' } }); // < 5 chars

    const confirmBtn = screen.getByRole('button', { name: /Confirm Action/i });
    expect(confirmBtn).toBeDisabled();

    fireEvent.change(textarea, { target: { value: 'Deadlock between assigned captains' } });
    expect(confirmBtn).not.toBeDisabled();
  });

  it('calls onConfirm with audit log payload including reason, actor, and target', async () => {
    const handleConfirm = vi.fn().mockResolvedValueOnce({ success: true });
    render(
      <ConfirmWithReasonDialog
        open={true}
        title="Force Resolve"
        actionName="bookings.force_resolve"
        targetId="VRM-777"
        targetType="Booking"
        confirmLabel="Resolve Now"
        onConfirm={handleConfirm}
      />,
    );

    const textarea = screen.getByPlaceholderText(/State the operational reason/i);
    fireEvent.change(textarea, { target: { value: 'Captain dropped passenger safely at destination' } });

    const confirmBtn = screen.getByRole('button', { name: /Resolve Now/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(handleConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'Captain dropped passenger safely at destination',
          action: 'bookings.force_resolve',
          targetId: 'VRM-777',
          targetType: 'Booking',
          actorRole: ROLES.OPERATIONS,
        }),
      );
    });
  });
});
