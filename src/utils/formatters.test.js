import { describe, it, expect } from 'vitest';
import {
  formatPaise,
  parseRupeesToPaise,
  formatBasisPoints,
  parsePercentageToBasisPoints,
  formatKolkata,
  maskPhone,
  maskDocumentNumber,
} from './formatters';

describe('Vrumm Formatters (Money, BPS, Time, Masking)', () => {
  it('formats integer paise to INR currency strings', () => {
    // 15000 paise = ₹150.00
    expect(formatPaise(15000)).toMatch(/₹\s?150\.00/);
    expect(formatPaise(0)).toMatch(/₹\s?0\.00/);
    expect(formatPaise(99)).toMatch(/₹\s?0\.99/);
    expect(formatPaise(10000000)).toMatch(/₹\s?1,00,000\.00/); // Indian numbering grouping
    expect(formatPaise(null)).toBe('₹0.00');
    expect(formatPaise(undefined)).toBe('₹0.00');
  });

  it('parses rupees string into integer paise', () => {
    expect(parseRupeesToPaise('150.00')).toBe(15000);
    expect(parseRupeesToPaise('49.50')).toBe(4950);
    expect(parseRupeesToPaise('0')).toBe(0);
    expect(parseRupeesToPaise('invalid')).toBe(0);
  });

  it('formats basis points to friendly percentage string', () => {
    // 300 bps = 3.00%
    expect(formatBasisPoints(300)).toBe('3.00%');
    expect(formatBasisPoints(350)).toBe('3.50%');
    expect(formatBasisPoints(10000)).toBe('100.00%');
    expect(formatBasisPoints(0)).toBe('0.00%');
    expect(formatBasisPoints(null)).toBe('0.00%');
  });

  it('parses percentage into basis points', () => {
    expect(parsePercentageToBasisPoints('3.00')).toBe(300);
    expect(parsePercentageToBasisPoints('3.5')).toBe(350);
    expect(parsePercentageToBasisPoints('12.75')).toBe(1275);
  });

  it('formats UTC ISO timestamp into Asia/Kolkata display string', () => {
    const utcDate = '2026-10-29T00:00:00.000Z';
    // UTC 00:00:00 is 05:30:00 AM IST
    const formatted = formatKolkata(utcDate);
    expect(formatted).toContain('2026');
    expect(formatted).toContain('05:30');
    expect(formatKolkata(null)).toBe('—');
  });

  it('masks sensitive phone numbers and documents by default', () => {
    expect(maskPhone('+919876543210')).toBe('+91 •••• 3210');
    expect(maskPhone(null)).toBe('—');

    expect(maskDocumentNumber('MH01AB1234')).toBe('•••• 1234');
    expect(maskDocumentNumber('DL987654321')).toBe('•••• 4321');
    expect(maskDocumentNumber(null)).toBe('—');
  });
});
