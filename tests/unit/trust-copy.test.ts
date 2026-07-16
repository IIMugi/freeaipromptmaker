import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const files = [
  'app/(legal)/about/page.tsx',
  'app/(legal)/content-standards/page.tsx',
  'app/(legal)/privacy/page.tsx',
  'app/(legal)/cookies/page.tsx',
  'app/(legal)/terms/page.tsx',
  'app/(legal)/contact/page.tsx',
  'app/tools/page.tsx',
  'data/ai-tools.ts',
  'app/error.tsx',
].map((file) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')).join('\n');

describe('publisher trust copy', () => {
  it('contains no unsupported history, test, rating, ad, or affiliate claims', () => {
    expect(files).not.toMatch(
      /50,?000|100,?000|since 2022|updated quarterly|rating:\s*\d|affiliateLink|Google AdSense|Consent Management Platform|our team has been notified|industry-leading|best-in-class/i,
    );
  });

  it('states the implemented privacy and readiness boundaries', () => {
    expect(files).toMatch(/prompt formatting runs locally/i);
    expect(files).toMatch(/uploaded image[\s\S]*Google Gemini/i);
    expect(files).toMatch(/analytics[\s\S]*explicit consent/i);
    expect(files).toMatch(/advertising is disabled/i);
    expect(files).toMatch(/approval is not guaranteed/i);
  });
});
