import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const docs = path.join(root, 'docs', 'adsense-rebuild');

describe('final readiness artifacts', () => {
  it('records the current clean-gate and editorial counts without stale one-guide totals', () => {
    const report = fs.readFileSync(path.join(docs, 'FINAL_READINESS_REPORT.md'), 'utf8');

    expect(report).toMatch(/seven source-verified guides/i);
    expect(report).toMatch(/27 files, 103 tests passed/i);
    expect(report).toMatch(/51 Chromium tests passed/i);
    expect(report).toMatch(/30 sitemap URLs/i);
    expect(report).not.toMatch(/only one guide|252 legacy|47 unit|32 browser|24 sitemap/i);
  });

  it('keeps CSV and route-audit distributions aligned with the final report', () => {
    const decisions = fs
      .readFileSync(path.join(docs, 'CONTENT_DECISIONS.csv'), 'utf8')
      .trim()
      .split(/\r?\n/);
    const inventory = fs
      .readFileSync(path.join(docs, 'URL_INVENTORY.csv'), 'utf8')
      .trim()
      .split(/\r?\n/);
    const routeAudit = JSON.parse(fs.readFileSync(path.join(docs, 'ROUTE_AUDIT.json'), 'utf8'));

    expect(decisions).toHaveLength(423);
    expect(inventory).toHaveLength(423);
    expect(routeAudit).toMatchObject({
      routesChecked: 423,
      sitemapUrls: 30,
      statusCounts: { 200: 420, 308: 2, 410: 1 },
      issues: [],
    });
  });

  it('records three fresh Lighthouse runs and their medians per route', () => {
    const lighthouse = JSON.parse(
      fs.readFileSync(path.join(docs, 'LIGHTHOUSE_SUMMARY.json'), 'utf8'),
    );

    expect(lighthouse.runsPerRoute).toBe(3);
    expect(lighthouse.routes['/'].runs).toHaveLength(3);
    expect(lighthouse.routes['/'].median).toMatchObject({ performance: 95, lcpMs: 2875 });
    const guide = lighthouse.routes['/blog/2025-11-29-stable-diffusion-negative-prompts-guide'];
    expect(guide.runs).toHaveLength(3);
    expect(guide.median).toMatchObject({ performance: 96, lcpMs: 2820 });
  });
});
