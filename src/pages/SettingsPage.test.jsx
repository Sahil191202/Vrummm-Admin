import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { SettingsPage } from './SettingsPage';
import { settingsService } from '../services/settingsService';

vi.mock('../services/settingsService', () => ({
  settingsService: {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  },
}));

vi.mock('../components/auth/PermissionGuard', () => ({
  PermissionGuard: ({ children }) => <>{children}</>,
}));

describe('SettingsPage (System Flags & Commercial Launch Lock)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders settings page with mandatory commercial launch disabled banner', async () => {
    settingsService.getSettings.mockResolvedValue({
      settings: {
        commercialLaunchDisabled: true,
        demoMode: true,
        simulatedPaymentsEnabled: true,
        geofenceActive: true,
        activeCluster: 'Mumbai MMR',
        dispatchAlgorithm: 'V2_RELATIVE_DISTANCE',
        emergencyHelpline: '+91 112 (Police)',
        systemVersion: 'v0.9.4-alpha (Phase F Certified)',
      },
    });

    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/System Flags & Environment Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Academic & Learning Project Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/COMMERCIAL LAUNCH: DISABLED/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('LOCKED (TRUE)')).toBeInTheDocument();
      expect(screen.getByText(/v0.9.4-alpha/i)).toBeInTheDocument();
    });
  });

  it('opens confirmation dialog requiring reason when save is clicked', async () => {
    settingsService.getSettings.mockResolvedValue({
      settings: {
        commercialLaunchDisabled: true,
        demoMode: true,
        simulatedPaymentsEnabled: true,
        geofenceActive: true,
        dispatchAlgorithm: 'V2_RELATIVE_DISTANCE',
        emergencyHelpline: '+91 112 (Police)',
        systemVersion: 'v0.9.4-alpha',
      },
    });

    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(settingsService.getSettings).toHaveBeenCalled();
    });

    const saveButton = screen.getByRole('button', { name: /Save System Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Confirm System Flag Changes/i)).toBeInTheDocument();
      expect(screen.getByText(/A written reason is mandatory for compliance audit recording/i)).toBeInTheDocument();
    });
  });
});
