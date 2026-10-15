import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { metadata as homeMetadata } from '@/app/page';
import { metadata as imageToPromptMetadata } from '@/app/image-to-prompt/page';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

const userFacingFiles = [
  'app/page.tsx',
  'components/Hero/HeroSection.tsx',
  'components/Home/HowPromptFormattingWorks.tsx',
  'components/Home/SupportedModels.tsx',
  'components/Layout/Footer.tsx',
  'components/Layout/Header.tsx',
  'app/(legal)/content-standards/page.tsx',
  'app/(legal)/cookies/page.tsx',
  'app/(legal)/privacy/page.tsx',
  'app/(legal)/terms/page.tsx',
];

describe('home page copy', () => {
  it('targets prompt-generator searches in title and description', () => {
    const { title } = homeMetadata;
    const text = typeof title === 'object' && title && 'absolute' in title ? title.absolute : String(title);
    expect(text).toMatch(/prompt generator/i);
    expect(text.length).toBeLessThanOrEqual(65);
    const description = String(homeMetadata.description);
    expect(description.length).toBeGreaterThanOrEqual(110);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description).not.toMatch(/DALL-?E/i);
  });

  it('uses a search-oriented H1', () => {
    expect(read('components/Hero/HeroSection.tsx')).toMatch(/<h1[^>]*>\s*Free AI Image Prompt Generator\s*<\/h1>/);
  });

  it('has no internal readiness or compliance jargon in user-facing copy', () => {
    for (const file of userFacingFiles) {
      expect(read(file), file).not.toMatch(/readiness|trust boundaries|fails? closed/i);
    }
  });
});

describe('image-to-prompt while analysis is not connected', () => {
  it('is noindex', () => {
    expect(imageToPromptMetadata.robots).toMatchObject({ index: false });
  });

  it('is left out of the sitemap and the site navigation', () => {
    expect(sitemap().map(({ url }) => url)).not.toContain('https://freeaipromptmaker.com/image-to-prompt');
    expect(read('components/Layout/Header.tsx')).not.toContain('/image-to-prompt');
    expect(read('components/Layout/Footer.tsx')).not.toContain('/image-to-prompt');
  });
});
