import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import editorialStatus from '@/data/editorial-status.json';

const postsDirectory = path.join(process.cwd(), 'posts');
const postFiles = fs
  .readdirSync(postsDirectory)
  .filter((fileName) => /\.(md|mdx)$/.test(fileName));

const stableDiffusionCandidates = [
  {
    slug: '2026-01-04-stable-diffusion-regional-prompting-guide',
    title: 'Stable Diffusion Regional Prompting with Regional Prompter',
    versionMarkers: [
      '3ed4cb30e10e510e4cd9b33cd9b11cda170859c2',
      'AUTOMATIC1111 1.10.1',
      'Documentation verified: 2026-07-16',
    ],
    sourceUrls: [
      'https://github.com/hako-mikan/sd-webui-regional-prompter',
      'https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.10.1',
    ],
    immutableSourceUrls: [
      'https://github.com/hako-mikan/sd-webui-regional-prompter/tree/3ed4cb30e10e510e4cd9b33cd9b11cda170859c2',
    ],
    internalLinks: [
      '/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
      '/blog/2026-01-25-stable-diffusion-wildcards-guide',
      '/blog/2026-02-13-best-stable-diffusion-extensions',
    ],
  },
  {
    slug: '2026-01-25-stable-diffusion-wildcards-guide',
    title: 'Stable Diffusion Wildcards with Dynamic Prompts',
    versionMarkers: [
      'de056ff8d80e4ad120e13a90cf200f3383f427c6',
      'AUTOMATIC1111 1.10.1',
      'Documentation verified: 2026-07-16',
    ],
    sourceUrls: [
      'https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/SYNTAX.md',
      'https://github.com/adieyal/sd-dynamic-prompts/blob/main/docs/tutorial.md',
      'https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.10.1',
    ],
    immutableSourceUrls: [
      'https://github.com/adieyal/sd-dynamic-prompts/blob/de056ff8d80e4ad120e13a90cf200f3383f427c6/docs/SYNTAX.md',
      'https://github.com/adieyal/sd-dynamic-prompts/blob/de056ff8d80e4ad120e13a90cf200f3383f427c6/docs/tutorial.md',
    ],
    internalLinks: [
      '/blog/2026-01-04-stable-diffusion-regional-prompting-guide',
      '/blog/2026-02-13-best-stable-diffusion-extensions',
      '/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
    ],
  },
  {
    slug: '2026-02-13-best-stable-diffusion-extensions',
    title: 'A Safety-First Guide to Stable Diffusion WebUI Extensions',
    versionMarkers: [
      'AUTOMATIC1111 1.10.1',
      'Documentation verified: 2026-07-16',
    ],
    sourceUrls: [
      'https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Extensions',
      'https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Developing-extensions',
      'https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.10.1',
    ],
    immutableSourceUrls: [
      'https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Extensions/8d34abe419d089974d649893136544038d666cfa',
      'https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Developing-extensions/721ba8fd97e333a641d60c970705200ebd63716d',
    ],
    internalLinks: [
      '/blog/2026-01-04-stable-diffusion-regional-prompting-guide',
      '/blog/2026-01-25-stable-diffusion-wildcards-guide',
      '/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
    ],
  },
] as const;

const guaranteeLanguage = /\bguarantee(?:s|d|ing)?\b/i;
const negatedGuarantee = /\b(?:does not|doesn't|cannot|can't|never|not)\s+guarantee(?:s|d|ing)?\b|\bno\s+(?:\w+\s+){0,3}can\s+guarantee(?:s|d|ing)?\b/gi;
const rankingOrHype = /\b(?:universally?|perfect(?:ly)?|game[- ]changer)\b|(?<!not the )(?<!not )\bbest\s+(?:extension|tool|model|workflow|results?|quality)\b|\b(?:ranked|rated|named|declared)\s+(?:as\s+)?(?:the\s+)?best\b/i;

const hasUnsupportedGuarantee = (text: string) =>
  guaranteeLanguage.test(text.replace(negatedGuarantee, ''));

describe('guide corpus', () => {
  it('has an explicit editorial status for every guide', () => {
    const slugs = postFiles.map((fileName) => fileName.replace(/\.(md|mdx)$/, ''));
    expect(Object.keys(editorialStatus).sort()).toEqual(slugs.sort());
  });

  it('contains no fabricated experience language in verified guides', () => {
    for (const fileName of postFiles) {
      const slug = fileName.replace(/\.(md|mdx)$/, '');
      const record = editorialStatus[slug as keyof typeof editorialStatus];
      if (record.state !== 'verified') continue;

      const { content } = matter(fs.readFileSync(path.join(postsDirectory, fileName), 'utf8'));
      expect(content).not.toMatch(/in my experience|i.ve found|what works for me/i);
    }
  });

  it('does not invent a current date when metadata is missing', () => {
    const blogSource = fs.readFileSync(path.join(process.cwd(), 'lib/blog.ts'), 'utf8');
    expect(blogSource).not.toMatch(/date:\s*data\.date\s*\|\|\s*new Date\(\)/);
  });

  it('distinguishes unsupported claims from honest limitations and contextual wording', () => {
    const allowed = [
      'Regional prompting does not guarantee placement.',
      'No extension can guarantee compatibility.',
      'This never guarantees a result.',
      'Choose the best fit for the documented requirement.',
      'This is not the best extension for every workflow.',
    ];
    const prohibited = [
      'This guarantees consistent placement.',
      'The extension guaranteed clean outputs.',
      'This is the best extension for image quality.',
      'This tool produces perfect outputs.',
      'This is a game-changer.',
    ];

    for (const text of allowed) {
      expect(hasUnsupportedGuarantee(text)).toBe(false);
      expect(text).not.toMatch(rankingOrHype);
    }
    for (const text of prohibited) {
      expect(hasUnsupportedGuarantee(text) || rankingOrHype.test(text)).toBe(true);
    }
  });

  it('prepares the Stable Diffusion workflow candidates from primary sources', () => {
    const limitation = 'No independent image-generation comparison was performed for this guide.';
    const legacyCopy = /hey there|imagine a world|ready to (?:transform|supercharge)|fellow ai art|unlock (?:new|unprecedented)|\uFFFD|PromptMaster/i;
    const inventedExperience = /\b(?:i know i(?:'|’)ve|i(?:'|’)ve (?:found|tried|learned|experienced)|in my experience|my go-to|in my opinion|what works for me|trust me|for me,? this)\b/i;
    const ratingOrPriceClaim = /\b\d(?:\.\d)?\s*\/\s*(?:5|10)\b|\b(?:one|two|three|four|five)[ -]star\b|\$\s*\d|\b(?:free|paid|premium) tier\b|\bpricing plan\b/i;
    const fakeTesting = /\b(?:i|we)\s+(?:tested|compared|benchmarked|verified|ran|generated|installed|used)\b/i;

    for (const candidate of stableDiffusionCandidates) {
      const raw = fs.readFileSync(path.join(postsDirectory, `${candidate.slug}.mdx`), 'utf8');
      const { data, content } = matter(raw);

      expect(data).toMatchObject({ title: candidate.title, author: 'Free AI Prompt Maker' });
      expect(data).not.toHaveProperty('image');
      expect(data).not.toHaveProperty('imageCredit');
      expect(data).not.toHaveProperty('imageCreditUrl');
      expect(content).toContain(limitation);
      expect(content).toMatch(/^## Primary sources\s*$/m);

      for (const marker of candidate.versionMarkers) expect(content).toContain(marker);
      for (const link of candidate.internalLinks) expect(content).toContain(`](${link})`);

      const primarySources = content.split(/^## Primary sources\s*$/m)[1] ?? '';
      const sourceUrls = primarySources.match(/https:\/\/[^\s)]+/g) ?? [];
      expect(new Set(sourceUrls).size).toBeGreaterThanOrEqual(2);
      for (const sourceUrl of candidate.sourceUrls) expect(primarySources).toContain(sourceUrl);
      for (const sourceUrl of candidate.immutableSourceUrls) expect(primarySources).toContain(sourceUrl);

      const proseWithoutUrls = raw
        .replace(/\]\([^)]+\)/g, ']()')
        .replace(/https:\/\/[^\s)"']+/g, '');
      expect(proseWithoutUrls).not.toMatch(legacyCopy);
      expect(proseWithoutUrls).not.toMatch(inventedExperience);
      expect(hasUnsupportedGuarantee(proseWithoutUrls)).toBe(false);
      expect(proseWithoutUrls).not.toMatch(ratingOrPriceClaim);
      expect(proseWithoutUrls).not.toMatch(fakeTesting);
      expect(proseWithoutUrls).not.toMatch(rankingOrHype);
    }
  });
});
