import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { PermissionGuard } from './PermissionGuard';
import { useAuthStore } from '../../store/authStore';
import { PERMISSIONS, ROLES } from '../../contracts/rbac';

describe('PermissionGuard Component', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  it('renders fallback when unauthenticated (deny-by-default)', () => {
    render(
      <PermissionGuard
        permission={PERMISSIONS.RIDES_READ}
        fallback={<div>Fallback Forbidden</div>}
      >
        <div>Authorized Content</div>
      </PermissionGuard>,
    );

    expect(screen.queryByText('Authorized Content')).not.toBeInTheDocument();
    expect(screen.getByText('Fallback Forbidden')).toBeInTheDocument();
  });

  it('renders children when authenticated user has the required permission', () => {
    useAuthStore.getState().setSession({
      accessToken: 'test-token',
      user: { role: ROLES.OPERATIONS },
      permissions: [PERMISSIONS.RIDES_READ],
    });

    render(
      <PermissionGuard
        permission={PERMISSIONS.RIDES_READ}
        fallback={<div>Fallback Forbidden</div>}
      >
        <div>Authorized Content</div>
      </PermissionGuard>,
    );

    expect(screen.getByText('Authorized Content')).toBeInTheDocument();
    expect(screen.queryByText('Fallback Forbidden')).not.toBeInTheDocument();
  });

  it('renders fallback when authenticated user lacks the required permission', () => {
    useAuthStore.getState().setSession({
      accessToken: 'test-token',
      user: { role: ROLES.OPERATIONS },
      permissions: [PERMISSIONS.RIDES_READ],
    });

    render(
      <PermissionGuard
        permission={PERMISSIONS.FARES_WRITE}
        fallback={<div>Fallback Forbidden</div>}
      >
        <div>Authorized Content</div>
      </PermissionGuard>,
    );

    expect(screen.queryByText('Authorized Content')).not.toBeInTheDocument();
    expect(screen.getByText('Fallback Forbidden')).toBeInTheDocument();
  });

  it('handles anyPermissions check correctly', () => {
    useAuthStore.getState().setSession({
      accessToken: 'test-token',
      user: { role: ROLES.FINANCE },
      permissions: [PERMISSIONS.PAYMENTS_READ],
    });

    render(
      <PermissionGuard
        anyPermissions={[PERMISSIONS.FARES_WRITE, PERMISSIONS.PAYMENTS_READ]}
        fallback={<div>Fallback Forbidden</div>}
      >
        <div>Allowed By Any Check</div>
      </PermissionGuard>,
    );

    expect(screen.getByText('Allowed By Any Check')).toBeInTheDocument();
  });
});
