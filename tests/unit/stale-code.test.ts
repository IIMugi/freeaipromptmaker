import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

describe('readiness runtime boundaries', () => {
  it('keeps one disabled ad boundary without obsolete placement wrappers', () => {
    const adsDirectory = path.join(root, 'components', 'Ads');
    const files = fs.readdirSync(adsDirectory).sort();

    expect(files).toEqual(['AdSenseScript.tsx', 'AdUnit.tsx', 'index.ts']);
    expect(fs.readFileSync(path.join(adsDirectory, 'index.ts'), 'utf8')).toMatch(
      /^export \{ AdUnit \} from '\.\/AdUnit';\s*$/,
    );
  });

  it('removes unused blog ad injection and inferred claims helpers', () => {
    expect(fs.existsSync(path.join(root, 'components', 'Blog', 'DynamicAdInjector.tsx'))).toBe(false);
    expect(fs.existsSync(path.join(root, 'lib', 'blog-helpers.ts'))).toBe(false);
    expect(fs.readFileSync(path.join(root, 'components', 'Blog', 'index.ts'), 'utf8')).not.toMatch(
      /DynamicAdInjector/,
    );
  });
});
