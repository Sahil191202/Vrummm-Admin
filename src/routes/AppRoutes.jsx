import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { BookingsPage } from '../pages/BookingsPage';
import { BookingDetailPage } from '../pages/BookingDetailPage';
import { DocumentsPage } from '../pages/DocumentsPage';
import { CaptainDocumentDetailPage } from '../pages/CaptainDocumentDetailPage';
import { FaresPage } from '../pages/FaresPage';
import { RevenuePlansPage } from '../pages/RevenuePlansPage';
import { PromotionsPage } from '../pages/PromotionsPage';
import { IncentivesPage } from '../pages/IncentivesPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { SafetyPage } from '../pages/SafetyPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { NotFound } from '../pages/NotFound';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PERMISSIONS } from '../contracts/rbac';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Shell */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.RIDES_READ}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="bookings"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.RIDES_READ}>
              <BookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="bookings/:bookingId"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.RIDES_READ}>
              <BookingDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="documents"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.DOCUMENTS_REVIEW}>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="documents/:captainId"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.DOCUMENTS_REVIEW}>
              <CaptainDocumentDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="fares"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.FARES_READ}>
              <FaresPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="revenue"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.REVENUE_PLANS_READ}>
              <RevenuePlansPage />
            </ProtectedRoute>
          }
        />
        <Route path="revenue-plans" element={<Navigate to="/revenue" replace />} />

        <Route
          path="promotions"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.PROMOTIONS_READ}>
              <PromotionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="incentives"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.PROMOTIONS_READ}>
              <IncentivesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="payments"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.PAYMENTS_READ}>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="incidents"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.INCIDENTS_READ}>
              <SafetyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="audit"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.AUDIT_READ}>
              <AuditLogsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.SETTINGS_READ}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
