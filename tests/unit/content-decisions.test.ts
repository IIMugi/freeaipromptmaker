import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
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
const productionRenderCrawl = {
  generatedAt: '2026-07-16T23:45:59.700Z',
  eligibleManifestRoutes: 421,
  successfulHtmlRoutes: 420,
  countConvention:
    'unique normalized href destinations for outlinks; unique rendered source routes for inlinks',
  links: {
    '2025-11-27-midjourney-v6-complete-prompt-guide': {
      internalInlinks: '23',
      internalOutlinks: '14',
      externalOutlinks: '5',
    },
    '2026-01-04-stable-diffusion-regional-prompting-guide': {
      internalInlinks: '24',
      internalOutlinks: '14',
      externalOutlinks: '6',
    },
    '2026-01-25-stable-diffusion-wildcards-guide': {
      internalInlinks: '27',
      internalOutlinks: '14',
      externalOutlinks: '8',
    },
    '2026-02-09-master-leonardo-ai-models': {
      internalInlinks: '208',
      internalOutlinks: '14',
      externalOutlinks: '6',
    },
    '2026-02-13-best-stable-diffusion-extensions': {
      internalInlinks: '253',
      internalOutlinks: '14',
      externalOutlinks: '8',
    },
    '2026-02-22-master-leonardo-ai-negative-prompts': {
      internalInlinks: '230',
      internalOutlinks: '14',
      externalOutlinks: '6',
    },
  },
} as const;
const sharedConnectedFacts = {
  gscPerformanceRange: '2025-11-26 to 2026-07-14',
  gscRecentRange: '2026-04-15 to 2026-07-14',
  gscTrend: 'GROWING',
  gscIndexingEvidence: 'NO_SAMPLE_LEVEL_GSC_STATUS',
  ga4Range: '2026-04-17 to 2026-07-15',
  caveat:
    'GA4 captured 158 sessions versus 1,554 GSC clicks in comparable 90-day windows; treat GA4 as severely incomplete.',
} as const;
const baselineConnectedFacts = {
  '2025-11-27-midjourney-v6-complete-prompt-guide': {
    responseMs: '449', gscClicks: '42', gscImpressions: '133750', gscCtr: '0',
    gscPosition: '7,1', recentClicks: '32', recentImpressions: '44728', recentCtr: '0,1',
    recentPosition: '7,4', ga4Sessions: '7', ga4ActiveUsers: '7', ga4Engagement: '33 sn',
  },
  '2026-01-04-stable-diffusion-regional-prompting-guide': {
    responseMs: '339', gscClicks: '122', gscImpressions: '38089', gscCtr: '0,3',
    gscPosition: '6,2', recentClicks: '88', recentImpressions: '28672', recentCtr: '0,3',
    recentPosition: '6,4', ga4Sessions: '2', ga4ActiveUsers: '2', ga4Engagement: '46 sn',
  },
  '2026-01-25-stable-diffusion-wildcards-guide': {
    responseMs: '376', gscClicks: '81', gscImpressions: '23038', gscCtr: '0,4',
    gscPosition: '7,1', recentClicks: '72', recentImpressions: '18893', recentCtr: '0,4',
    recentPosition: '7,2', ga4Sessions: '5', ga4ActiveUsers: '1', ga4Engagement: '4 sn',
  },
  '2026-02-09-master-leonardo-ai-models': {
    responseMs: '383', gscClicks: '28', gscImpressions: '33592', gscCtr: '0,1',
    gscPosition: '7,2', recentClicks: '20', recentImpressions: '16011', recentCtr: '0,1',
    recentPosition: '8', ga4Sessions: '1', ga4ActiveUsers: '1', ga4Engagement: '24 sn',
  },
  '2026-02-13-best-stable-diffusion-extensions': {
    responseMs: '367', gscClicks: '45', gscImpressions: '17283', gscCtr: '0,3',
    gscPosition: '6,8', recentClicks: '32', recentImpressions: '12049', recentCtr: '0,3',
    recentPosition: '7,5', ga4Sessions: '7', ga4ActiveUsers: '5', ga4Engagement: '1 dk. 49 sn.',
  },
  '2026-02-22-master-leonardo-ai-negative-prompts': {
    responseMs: '338', gscClicks: '36', gscImpressions: '47414', gscCtr: '0,1',
    gscPosition: '6,2', recentClicks: '32', recentImpressions: '34543', recentCtr: '0,1',
    recentPosition: '6,2', ga4Sessions: '1', ga4ActiveUsers: '1', ga4Engagement: '4 sn',
  },
} as const;

const getSlug = (url: string) => new URL(url).pathname.split('/').filter(Boolean).pop() || '';
const getCurrentPostFacts = (slug: string) => {
  const raw = fs.readFileSync(path.join(process.cwd(), 'posts', `${slug}.mdx`), 'utf8');
  const { data, content } = matter(raw);
  return {
    frontmatterTitle: String(data.title),
    renderedTitle: `${String(data.title)} | Free AI Prompt Maker`,
    description: String(data.description),
    words: String(content.trim().split(/\s+/).length),
  };
};

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

  it('keeps promoted decision titles aligned with current bodies and records crawl provenance', () => {
    expect(productionRenderCrawl).toMatchObject({
      eligibleManifestRoutes: 421,
      successfulHtmlRoutes: 420,
      countConvention: expect.stringContaining('unique'),
    });

    for (const slug of promotedSlugs) {
      const current = getCurrentPostFacts(slug);
      const decision = rows.find((candidate) => getSlug(candidate.URL) === slug);

      expect(decision?.title).toBe(current.renderedTitle);
      expect(decision?.rationale).toMatch(/local production render.*2026-07-16/i);
    }
  });

  it('keeps promoted inventory body facts current', () => {
    for (const slug of promotedSlugs) {
      const current = getCurrentPostFacts(slug);
      const inventory = inventoryRows.find((candidate) => getSlug(candidate.URL) === slug);

      expect(current.renderedTitle).toBe(`${current.frontmatterTitle} | Free AI Prompt Maker`);
      expect(inventory?.title).toBe(current.renderedTitle);
      expect(inventory?.['meta description']).toBe(current.description);
      expect(inventory?.['approximate word count']).toBe(current.words);
    }
  });

  it('keeps promoted inventory link counts aligned with the production-render crawl', () => {
    for (const slug of promotedSlugs) {
      const inventory = inventoryRows.find((candidate) => getSlug(candidate.URL) === slug);
      const links = productionRenderCrawl.links[slug];

      expect(inventory?.['internal inlinks']).toBe(links.internalInlinks);
      expect(inventory?.['internal outlinks']).toBe(links.internalOutlinks);
      expect(inventory?.['external outlinks']).toBe(links.externalOutlinks);
    }
  });

  it('preserves promoted connected metrics, response measurements, and numeric scores', () => {
    for (const slug of promotedSlugs) {
      const inventory = inventoryRows.find((candidate) => getSlug(candidate.URL) === slug);
      const decision = rows.find((candidate) => getSlug(candidate.URL) === slug);
      const baseline = baselineConnectedFacts[slug];
      const scores = baselineScores[slug];

      expect(inventory).toMatchObject({
        'usefulness score': scores.usefulness,
        'trust/evidence score': scores.trust,
        'response ms': baseline.responseMs,
        'GSC performance range': sharedConnectedFacts.gscPerformanceRange,
        'GSC clicks': baseline.gscClicks,
        'GSC impressions': baseline.gscImpressions,
        'GSC CTR %': baseline.gscCtr,
        'GSC average position': baseline.gscPosition,
        'GSC recent range': sharedConnectedFacts.gscRecentRange,
        'GSC recent clicks': baseline.recentClicks,
        'GSC recent impressions': baseline.recentImpressions,
        'GSC recent CTR %': baseline.recentCtr,
        'GSC recent average position': baseline.recentPosition,
        'GSC click-rate trend': sharedConnectedFacts.gscTrend,
        'GSC indexing evidence': sharedConnectedFacts.gscIndexingEvidence,
        'GA4 range': sharedConnectedFacts.ga4Range,
        'GA4 sessions': baseline.ga4Sessions,
        'GA4 active users': baseline.ga4ActiveUsers,
        'GA4 avg engagement per session': baseline.ga4Engagement,
        'connected evidence caveat': sharedConnectedFacts.caveat,
      });
      expect(decision).toMatchObject({
        'GSC indexing evidence': sharedConnectedFacts.gscIndexingEvidence,
        'GSC clicks': baseline.gscClicks,
        'GSC impressions': baseline.gscImpressions,
        'GSC CTR %': baseline.gscCtr,
        'GSC average position': baseline.gscPosition,
        'GSC recent clicks': baseline.recentClicks,
        'GSC recent impressions': baseline.recentImpressions,
        'GSC click-rate trend': sharedConnectedFacts.gscTrend,
        'GA4 sessions': baseline.ga4Sessions,
        'GA4 avg engagement per session': baseline.ga4Engagement,
      });
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
