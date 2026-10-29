import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AccessDenied } from './AccessDenied';

export function ProtectedRoute({ children, requiredPermission, requiredRole }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const permissions = useAuthStore((s) => s.permissions);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <AccessDenied
        title="Role Restriction"
        message={`This section is restricted to ${requiredRole} users only.`}
      />
    );
  }

  if (requiredPermission && (!permissions || !permissions.includes(requiredPermission))) {
    return (
      <AccessDenied
        requiredPermission={requiredPermission}
        message="Your account lacks the specific permission required to access this resource."
      />
    );
  }

  return children;
}
