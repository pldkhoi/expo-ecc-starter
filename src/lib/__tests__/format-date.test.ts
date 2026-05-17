import { formatDate } from '@/lib/format-date';

describe('formatDate', () => {
  it('formats a Date instance as "DD Mon YYYY"', () => {
    expect(formatDate(new Date('2025-03-14T00:00:00Z'))).toMatch(/^\d{2} [A-Za-z]{3} \d{4}$/);
  });

  it('parses an ISO string', () => {
    expect(formatDate('2024-01-01T00:00:00Z')).toMatch(/Jan 2024$/);
  });

  it('returns an empty string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});
