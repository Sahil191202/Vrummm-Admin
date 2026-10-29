import React from 'react';
import { useAuthStore } from '../../store/authStore';

/**
 * PermissionGuard shapes UI according to user permissions (deny-by-default).
 * Note: Hiding a button is not authorisation; backend enforces every operation.
 *
 * @param {Object} props
 * @param {string} [props.permission] - Single required permission string
 * @param {string[]} [props.anyPermissions] - User must have at least one of these
 * @param {string} [props.role] - Specific role check (sparingly used)
 * @param {React.ReactNode} [props.fallback=null] - Rendered if denied
 * @param {React.ReactNode} props.children
 */
export function PermissionGuard({
  permission,
  anyPermissions,
  role,
  fallback = null,
  children,
}) {
  const user = useAuthStore((s) => s.user);
  const permissions = useAuthStore((s) => s.permissions);

  if (!user) return fallback;

  // Strict Deny-by-default: If permissions array is empty or undefined, deny.
  if (!permissions || !Array.isArray(permissions)) {
    return fallback;
  }

  if (role && user.role !== role) {
    return fallback;
  }

  if (permission && !permissions.includes(permission)) {
    return fallback;
  }

  if (anyPermissions && anyPermissions.length > 0) {
    const hasAny = anyPermissions.some((p) => permissions.includes(p));
    if (!hasAny) return fallback;
  }

  return <>{children}</>;
}
