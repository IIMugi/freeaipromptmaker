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

describe('content decision ledger', () => {
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
