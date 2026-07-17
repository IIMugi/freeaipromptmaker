import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const activeGuidance = [
  'prd.md',
  'README_ADSENSE.md',
  'memory-bank/projectbrief.md',
  'memory-bank/productContext.md',
  'memory-bank/systemPatterns.md',
  'memory-bank/techContext.md',
  'memory-bank/activeContext.md',
  'memory-bank/progress.md',
];

describe('active project guidance', () => {
  it('contains no obsolete publishing or ad-placement instructions', () => {
    const corpus = activeGuidance
      .map((file) => fs.readFileSync(path.join(root, file), 'utf8'))
      .join('\n');

    expect(corpus).not.toMatch(
      /auto-blogger|git push|cron job|schedule:|günde 1|every 2 days|HeaderAd|SidebarAd|InArticleAd|EndOfContentAd|GeneratorResultAd|DynamicAdInjector/i,
    );
  });

  it('states the current manual-review and disabled-ads boundaries', () => {
    const product = fs.readFileSync(path.join(root, 'prd.md'), 'utf8');
    const ads = fs.readFileSync(path.join(root, 'README_ADSENSE.md'), 'utf8');
    const active = fs.readFileSync(path.join(root, 'memory-bank', 'activeContext.md'), 'utf8');

    expect(product).toMatch(/manual editorial review/i);
    expect(ads).toMatch(/ads are disabled/i);
    expect(active).toMatch(/AdSense readiness rebuild/i);
  });
});
