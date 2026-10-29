/**
 * Monetary, percentage, and date formatters strictly following Vrumm project rules:
 * - Money: INR, integer paise (100 paise = ₹1.00). Displays friendly values.
 * - Percentage: Basis points (100 bps = 1.00%, 350 bps = 3.50%).
 * - Time: Display in Asia/Kolkata timezone.
 */

export function formatPaise(paise, options = {}) {
  if (paise === null || paise === undefined || isNaN(paise)) return '₹0.00';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(rupees);
}

export function parseRupeesToPaise(rupees) {
  const num = parseFloat(rupees);
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

export function formatBasisPoints(bps) {
  if (bps === null || bps === undefined || isNaN(bps)) return '0.00%';
  const percentage = bps / 100;
  return `${percentage.toFixed(2)}%`;
}

export function parsePercentageToBasisPoints(percentage) {
  const num = parseFloat(percentage);
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

export function formatKolkata(dateInput, formatStr = 'full') {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '—';

  const options = {
    timeZone: 'Asia/Kolkata',
  };

  if (formatStr === 'dateOnly') {
    options.year = 'numeric';
    options.month = 'short';
    options.day = 'numeric';
  } else if (formatStr === 'timeOnly') {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
    options.hour12 = true;
  } else {
    // 'full'
    options.year = 'numeric';
    options.month = 'short';
    options.day = 'numeric';
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
    options.hour12 = true;
  }

  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

export function maskPhone(phone) {
  if (!phone) return '—';
  const cleaned = String(phone).trim();
  if (cleaned.length < 8) return '****';
  // Example: +919876543210 -> +91 **** 3210
  return cleaned.slice(0, 3) + ' •••• ' + cleaned.slice(-4);
}

export function maskDocumentNumber(docNum) {
  if (!docNum) return '—';
  const str = String(docNum).trim();
  if (str.length <= 4) return '••••';
  return '•••• ' + str.slice(-4);
}
