/**
 * Client contracts mirroring backend domain contracts.
 */

export { PERMISSIONS, ROLES } from './rbac';

export const PAYMENT_STATUSES = Object.freeze([
  'PENDING',
  'CAPTURED',
  'FAILED',
  'REFUNDED_SIMULATED',
]);

export const PAYMENT_PROVIDERS = Object.freeze(['MOCK', 'RAZORPAY']);

export const LEDGER_ACCOUNT_TYPES = Object.freeze(['CUSTOMER', 'CAPTAIN', 'PLATFORM']);

export const LEDGER_ENTRY_TYPES = Object.freeze([
  'FARE_COLLECTED',
  'COMMISSION_EARNED',
  'CAPTAIN_EARNING',
  'CAPTAIN_PAYOUT_SIMULATED',
  'ADJUSTMENT',
]);

export const LEDGER_DIRECTIONS = Object.freeze(['CREDIT', 'DEBIT']);

export const PROMOTION_DISCOUNT_TYPES = Object.freeze(['PERCENTAGE', 'FLAT']);

export const INCENTIVE_TARGET_TYPES = Object.freeze([
  'DAILY_RIDES',
  'WEEKLY_RIDES',
  'PEAK_HOUR',
  'REFERRAL',
]);

export const VEHICLE_TYPES = Object.freeze(['BIKE', 'AUTO', 'CAB']);

export const INCIDENT_TYPES = Object.freeze([
  'SOS_SIMULATED',
  'ACCIDENT',
  'HARASSMENT',
  'ROUTE_DEVIATION',
  'OTHER',
]);

export const INCIDENT_SEVERITIES = Object.freeze(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const INCIDENT_STATUSES = Object.freeze([
  'REPORTED',
  'INVESTIGATING',
  'RESOLVED',
  'DISMISSED',
]);

export const SUPPORT_TICKET_CATEGORIES = Object.freeze([
  'BILLING',
  'RIDE_ISSUE',
  'ACCOUNT',
  'SAFETY',
  'OTHER',
]);

export const SUPPORT_TICKET_STATUSES = Object.freeze(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']);

export const SUPPORT_TICKET_PRIORITIES = Object.freeze(['LOW', 'NORMAL', 'HIGH', 'URGENT']);
