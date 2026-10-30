import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { BookingsPage } from '../pages/BookingsPage';
import { BookingDetailPage } from '../pages/BookingDetailPage';
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
              <PlaceholderPage
                title="Captain & Vehicle Document Review"
                phase="Phase C"
                requiredPermission={PERMISSIONS.DOCUMENTS_REVIEW}
                description="Short-lived signed document viewing, approvals, rejections with mandatory reasons & expiry tracking"
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="fares"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.FARES_READ}>
              <PlaceholderPage
                title="Fare & Dispatch Settings"
                phase="Phase D"
                requiredPermission={PERMISSIONS.FARES_READ}
                description="Versioned fare matrices, pickup radius, relative-distance rule toggles & server-side previews"
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="revenue"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.REVENUE_PLANS_READ}>
              <PlaceholderPage
                title="Revenue Plans"
                phase="Phase D"
                requiredPermission={PERMISSIONS.REVENUE_PLANS_READ}
                description="Commission rates in basis points (300 to 350 bps) and simulated subscription tiers"
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="promotions"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.PROMOTIONS_READ}>
              <PlaceholderPage
                title="Customer Promotions"
                phase="Phase E"
                requiredPermission={PERMISSIONS.PROMOTIONS_READ}
                description="Promo codes, first-ride discounts, maximum caps in paise, and validity windows"
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="incentives"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.PROMOTIONS_READ}>
              <PlaceholderPage
                title="Captain Incentives"
                phase="Phase E"
                requiredPermission={PERMISSIONS.PROMOTIONS_READ}
                description="Daily/weekly targets, peak-hour bonuses, and referral reward management"
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="payments"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.PAYMENTS_READ}>
              <PlaceholderPage
                title="Payments, Ledger & Reconciliation"
                phase="Phase E"
                requiredPermission={PERMISSIONS.PAYMENTS_READ}
                description="Read-only append-only financial ledger, adjustment entries & simulated refunds"
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="incidents"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.INCIDENTS_READ}>
              <PlaceholderPage
                title="Safety Incidents & Support Tickets"
                phase="Phase F"
                requiredPermission={PERMISSIONS.INCIDENTS_READ}
                description="State history, incident escalation, resolution logs and emergency response records"
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="audit"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.AUDIT_READ}>
              <PlaceholderPage
                title="Analytics & Audit Logs"
                phase="Phase F"
                requiredPermission={PERMISSIONS.AUDIT_READ}
                description="Immutable log of sensitive actions (actor, action, target, timestamp, requestId, reason)"
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.SETTINGS_READ}>
              <PlaceholderPage
                title="Application Settings"
                phase="Phase F"
                requiredPermission={PERMISSIONS.SETTINGS_READ}
                description="System flags, commercial launch disabled lock & demo parameters"
              />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
