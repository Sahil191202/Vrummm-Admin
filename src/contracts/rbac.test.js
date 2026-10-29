import { describe, it, expect } from 'vitest';
import {
  PERMISSIONS,
  ROLES,
  DEFAULT_ROLE_PERMISSIONS,
  checkPermission,
} from './rbac';

describe('RBAC & Permissions (Deny by Default)', () => {
  it('denies access by default when permissions are empty, null, or undefined', () => {
    expect(checkPermission(null, PERMISSIONS.RIDES_READ)).toBe(false);
    expect(checkPermission(undefined, PERMISSIONS.RIDES_READ)).toBe(false);
    expect(checkPermission([], PERMISSIONS.RIDES_READ)).toBe(false);
    expect(checkPermission(['other.permission'], PERMISSIONS.RIDES_READ)).toBe(false);
  });

  it('allows access only when explicit permission is present in user list', () => {
    const userPerms = [PERMISSIONS.RIDES_READ, PERMISSIONS.RIDES_RESOLVE];
    expect(checkPermission(userPerms, PERMISSIONS.RIDES_READ)).toBe(true);
    expect(checkPermission(userPerms, PERMISSIONS.RIDES_RESOLVE)).toBe(true);
    expect(checkPermission(userPerms, PERMISSIONS.FARES_WRITE)).toBe(false);
  });

  it('contains expected default permission assignments for all admin roles', () => {
    const superAdminPerms = DEFAULT_ROLE_PERMISSIONS[ROLES.SUPER_ADMIN];
    expect(superAdminPerms).toContain(PERMISSIONS.RIDES_READ);
    expect(superAdminPerms).toContain(PERMISSIONS.FARES_WRITE);
    expect(superAdminPerms).toContain(PERMISSIONS.PAYMENTS_REFUND_SIMULATE);

    const opsPerms = DEFAULT_ROLE_PERMISSIONS[ROLES.OPERATIONS];
    expect(opsPerms).toContain(PERMISSIONS.RIDES_READ);
    expect(opsPerms).toContain(PERMISSIONS.RIDES_RESOLVE);
    expect(opsPerms).toContain(PERMISSIONS.FARES_WRITE);
    expect(opsPerms).not.toContain(PERMISSIONS.PAYMENTS_REFUND_SIMULATE);

    const financePerms = DEFAULT_ROLE_PERMISSIONS[ROLES.FINANCE];
    expect(financePerms).toContain(PERMISSIONS.PAYMENTS_READ);
    expect(financePerms).toContain(PERMISSIONS.PAYMENTS_REFUND_SIMULATE);
    expect(financePerms).not.toContain(PERMISSIONS.FARES_WRITE);

    const compliancePerms = DEFAULT_ROLE_PERMISSIONS[ROLES.COMPLIANCE];
    expect(compliancePerms).toContain(PERMISSIONS.DOCUMENTS_REVIEW);
    expect(compliancePerms).not.toContain(PERMISSIONS.FARES_WRITE);
    expect(compliancePerms).not.toContain(PERMISSIONS.PAYMENTS_REFUND_SIMULATE);
  });
});
