import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import editorialStatus from '@/data/editorial-status.json';

function parseCsv(file: string) {
  const lines = fs.readFileSync(path.join(process.cwd(), file), 'utf8').trim().split(/\r?\n/);
  const cells = (line: string) =>
    line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((value) =>
      value.trim().replace(/^"|"$/g, '').replace(/""/g, '"'),
    );
  const headers = cells(lines[0]);
  return lines.slice(1).map((line) =>
    Object.fromEntries(cells(line).map((value, index) => [headers[index], value])),
  );
}

const rows = parseCsv('docs/adsense-rebuild/CONTENT_DECISIONS.csv');
const inventoryRows = parseCsv('docs/adsense-rebuild/URL_INVENTORY.csv');
const promotedSlugs = [
  '2025-11-27-midjourney-v6-complete-prompt-guide',
  '2026-01-04-stable-diffusion-regional-prompting-guide',
  '2026-01-25-stable-diffusion-wildcards-guide',
  '2026-02-09-master-leonardo-ai-models',
  '2026-02-13-best-stable-diffusion-extensions',
  '2026-02-22-master-leonardo-ai-negative-prompts',
] as const;
const expectedVerifiedSlugs = [
  ...promotedSlugs,
  '2025-11-29-stable-diffusion-negative-prompts-guide',
].sort();
const baselineScores = {
  '2025-11-27-midjourney-v6-complete-prompt-guide': { usefulness: '3', trust: '3' },
  '2026-01-04-stable-diffusion-regional-prompting-guide': { usefulness: '3', trust: '2' },
  '2026-01-25-stable-diffusion-wildcards-guide': { usefulness: '3', trust: '3' },
  '2026-02-09-master-leonardo-ai-models': { usefulness: '3', trust: '3' },
  '2026-02-13-best-stable-diffusion-extensions': { usefulness: '3', trust: '3' },
  '2026-02-22-master-leonardo-ai-negative-prompts': { usefulness: '3', trust: '3' },
} as const;

const getSlug = (url: string) => new URL(url).pathname.split('/').filter(Boolean).pop() || '';

describe('content decision ledger', () => {
  it('keeps 422 decisions and marks exactly seven guide rows verified', () => {
    const verifiedSlugs = rows
      .filter(
        (row) =>
          row['route type'] === 'guide' &&
          row['implementation status'] === 'IMPLEMENTED_VERIFIED',
      )
      .map((row) => getSlug(row.URL))
      .sort();

    expect(rows).toHaveLength(422);
    expect(verifiedSlugs).toEqual(expectedVerifiedSlugs);
    for (const slug of promotedSlugs) {
      const row = rows.find((candidate) => getSlug(candidate.URL) === slug);
      expect(row?.['primary decision']).toBe('IMPROVE');
      expect(row?.destination).toBe('');
      expect(row?.['implementation status']).toBe('IMPLEMENTED_VERIFIED');
      expect(row?.rationale).toContain('2026-07-16');
      expect(row?.rationale).toMatch(/snapshot/i);
      expect(row?.rationale).toMatch(/worksheet|table/i);
      expect(row?.rationale).toMatch(/no independent image-generation comparison/i);
    }
  });

  it('publishes only the six promoted inventory rows and leaves quarantine in place', () => {
    expect(inventoryRows).toHaveLength(422);

    for (const slug of promotedSlugs) {
      const row = inventoryRows.find((candidate) => getSlug(candidate.URL) === slug);
      const scores = baselineScores[slug];
      expect(row).toBeDefined();
      expect(row?.indexability).toBe('indexable');
      expect(row?.['canonical target']).toBe(row?.URL);
      expect(row?.['HTTP status']).toBe('200');
      expect(row?.['implementation status']).toBe('IMPLEMENTED_VERIFIED');
      expect(row?.['in sitemap']).toBe('yes');
      expect(row?.['robots meta']).toBe('index, follow');
      expect(row?.['usefulness score']).toBe(scores.usefulness);
      expect(row?.['trust/evidence score']).toBe(scores.trust);
      expect(row?.['recommended action']).toBe('IMPROVED_AND_VERIFIED');
    }

    const remainingNeedsReview = inventoryRows.filter(
      (row) => row['implementation status'] === 'IMPLEMENTED_NOINDEX_NEEDS_REVIEW',
    );
    expect(remainingNeedsReview).toHaveLength(245);
    for (const row of remainingNeedsReview) {
      expect(row.indexability).toBe('noindex');
      expect(row['in sitemap']).toBe('no');
      expect(row['robots meta']).toBe('noindex, follow');
    }
  });

  it('has one allowed primary decision per URL', () => {
    expect(new Set(rows.map((row) => row.URL)).size).toBe(rows.length);
    const allowed = new Set(['IMPROVE', 'MERGE', 'REDIRECT_301', 'DELETE_410', 'NOINDEX']);
    for (const row of rows) expect(allowed.has(row['primary decision'])).toBe(true);
  });

  it('has destinations for permanent moves and no redirect chains', () => {
    const moves = rows.filter((row) => ['MERGE', 'REDIRECT_301'].includes(row['primary decision']));
    for (const row of moves) expect(row.destination).toMatch(/^https:\/\/freeaipromptmaker\.com\//);
    const sources = new Set(moves.map((row) => row.URL));
    expect(moves.some((row) => sources.has(row.destination))).toBe(false);
  });

  it('matches guide implementation status to editorial visibility', () => {
    for (const row of rows.filter((item) => item['route type'] === 'guide')) {
      if (row['primary decision'] === 'MERGE') {
        expect(row['implementation status']).toBe('IMPLEMENTED_PERMANENT_REDIRECT');
        continue;
      }
      if (row['primary decision'] === 'DELETE_410') {
        expect(row['implementation status']).toBe('IMPLEMENTED_410');
        continue;
      }
      const slug = new URL(row.URL).pathname.split('/').filter(Boolean).pop() || '';
      const record = editorialStatus[slug as keyof typeof editorialStatus];
      expect(record).toBeDefined();
      expect(row['implementation status']).toBe(
        record.state === 'verified' ? 'IMPLEMENTED_VERIFIED' : 'IMPLEMENTED_NOINDEX_NEEDS_REVIEW',
      );
    }
  });
});
