import { describe, expect, it } from 'vitest';
import { median, summarizeReports } from '@/scripts/parse_lighthouse.mjs';

function report(performance: number, lcp: number, transfer: number) {
  return {
    lighthouseVersion: '13.4.0',
    categories: {
      performance: { score: performance },
      accessibility: { score: 1 },
      'best-practices': { score: 1 },
      seo: { score: 0.99 },
    },
    audits: {
      'first-contentful-paint': { numericValue: 900 },
      'largest-contentful-paint': { numericValue: lcp },
      'total-blocking-time': { numericValue: 50 },
      'cumulative-layout-shift': { numericValue: 0.01 },
      'total-byte-weight': { numericValue: transfer },
    },
  };
}

describe('Lighthouse multi-run parser', () => {
  it('calculates an odd-number median without mutating input', () => {
    const values = [3, 1, 2];
    expect(median(values)).toBe(2);
    expect(values).toEqual([3, 1, 2]);
  });

  it('summarizes three reports using category and audit medians', () => {
    const summary = summarizeReports([
      report(0.91, 2900, 300_000),
      report(0.95, 2500, 280_000),
      report(0.93, 2700, 290_000),
    ]);

    expect(summary).toEqual({
      lighthouseVersion: '13.4.0',
      runs: 3,
      performance: 93,
      accessibility: 100,
      bestPractices: 100,
      seo: 99,
      fcpMs: 900,
      lcpMs: 2700,
      tbtMs: 50,
      cls: 0.01,
      transferBytes: 290_000,
    });
  });
});
