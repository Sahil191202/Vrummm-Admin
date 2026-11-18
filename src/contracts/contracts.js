/**
 * Client contracts mirroring backend domain contracts.
 */

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
