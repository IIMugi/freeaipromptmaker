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

const rankingLimitation = /\bnot(?:\s+\w+){0,3}\s+the\s+best\s+(?:choice|extension|tool|model|workflow|results?|quality)\b/gi;
const rankingOrHype = /#\s*1\b|\btop[- ]ranked\b|\branked\s+(?:#?\s*1|first)\b|\b(?:ranked|rated|named|declared)\s+(?:as\s+)?(?:the\s+)?best\b|\b(?:the\s+)?best\s+(?:choice|extension|tool|model|workflow|results?|quality)\b|\bperfect(?:ly)?\s+(?:outputs?|results?|quality|placement|compatibility|images?)\b|\b(?:universally?|game[- ]changer)\b/i;
const popularityOrAudienceClaim = /\b(?:most popular|widely (?:used|adopted)|popular with|used by (?:millions|thousands)|trusted by (?:millions|thousands)|millions of (?:users|creators)|for everyone)\b/i;
const priceOrRatingClaim = /[$€£¥]\s*\d|\b(?:USD|EUR|GBP|TRY)\s*\d|\b(?:costs?|priced at|price of)\s+\d+(?:\.\d+)?(?:\s+per\s+\w+)?\b|\b\d+(?:\.\d{1,2})?\s*(?:dollars?|euros?|pounds?)\b|\b(?:free|paid|premium)\s+tier\b|\bpricing plan\b|\b\d(?:\.\d+)?\s*\/\s*(?:5|10|100)\b|\b(?:one|two|three|four|five)[ -]star\b|\b(?:rated|rating of)\s+\d(?:\.\d+)?(?:\s+out of\s+(?:5|10))?/i;
const benchmarkClaim = /\b\d+(?:\.\d+)?%\s+(?:faster|slower|better|fewer|improvement|increase|decrease)\b|\b\d+(?:\.\d+)?x\s+faster\b|\btwice\s+as\s+(?:fast|slow)\b/i;
const fabricatedTesting = /\b(?:i|we)\s+(?:tested|compared|benchmarked|verified|ran|generated|installed|used|found)\b|\bour (?:tests?|testing)\s+(?:showed|found|demonstrated|confirmed)\b/i;

const affirmativeGuaranteeClaims = [
  /\b(?:i|we)\s+guarantee\b/i,
  /\b(?:this|it)\s+guarantees\b/i,
  /\b(?:this|it)\s+(?:can|does|will)\s+guarantee\b/i,
  /\bthe\s+(?:extension|feature|method|tool|workflow)\s+(?:guaranteed|guarantees)\b/i,
  /\b(?:and|but)\s+guarantees\b/i,
  /\bit\s+not only\s+guarantees\b/i,
] as const;

// This automation intentionally detects only reviewable phrase families.
// Novel grammar remains a manual editorial-review concern rather than inferred NLP.
const boundedEditorialClaimFamilies = [
  { name: 'affirmative guarantees', patterns: affirmativeGuaranteeClaims },
  { name: 'rankings and hype', patterns: [rankingOrHype] },
  { name: 'popularity and audience', patterns: [popularityOrAudienceClaim] },
  { name: 'pricing and ratings', patterns: [priceOrRatingClaim] },
  { name: 'benchmarks', patterns: [benchmarkClaim] },
  { name: 'fabricated testing', patterns: [fabricatedTesting] },
] as const;

const hasUnsupportedClaim = (text: string) => {
  const proseWithoutRankingLimitations = text.replace(rankingLimitation, '');
  return boundedEditorialClaimFamilies.some((family) =>
    family.patterns.some((pattern) => pattern.test(proseWithoutRankingLimitations)));
};

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
      { label: 'direct limitation', text: 'Regional prompting does not guarantee placement.' },
      { label: 'subject limitation', text: 'No extension can guarantee compatibility.' },
      { label: 'multiword subject limitation', text: 'No regional extension can guarantee compatibility.' },
      { label: 'multiword passive limitation', text: 'No generated output is guaranteed.' },
      { label: 'noun limitation', text: 'There is no guarantee of compatibility.' },
      { label: 'plural noun limitation', text: 'The documentation makes no guarantees about compatibility.' },
      { label: 'plural existential limitation', text: 'There are no guarantees of compatibility.' },
      { label: 'contextual guarantee noun', text: 'Without a guarantee of compatibility, pin the commit.' },
      { label: 'conditional guarantee noun', text: 'A guarantee would require evidence.' },
      { label: 'no-evidence guarantee', text: 'There is no evidence of a compatibility guarantee.' },
      { label: 'no-evidence comparison', text: 'There is no evidence supporting a speed comparison.' },
      { label: 'never disclaimer', text: 'This never guarantees a result.' },
      { label: 'modal not disclaimer', text: 'This will not guarantee compatibility.' },
      { label: 'modal never disclaimer', text: 'This can never guarantee placement.' },
      { label: 'contextual perfect', text: 'This syntax is perfectly valid.' },
      { label: 'contextual best', text: 'Choose the best fit for the documented requirement.' },
      { label: 'direct ranking disclaimer', text: 'This is not the best extension for every workflow.' },
      { label: 'qualified ranking disclaimer', text: 'This is not necessarily the best extension.' },
      { label: 'comparison limitation', text: 'No pricing or benchmark comparison was performed.' },
    ];
    const prohibited = [
      { label: 'direct guarantee', text: 'This guarantees consistent placement.' },
      { label: 'intervening guarantee', text: 'This guarantees consistently clean placement.' },
      { label: 'first-person base guarantee', text: 'We guarantee consistent placement.' },
      { label: 'singular first-person base guarantee', text: 'I guarantee clean output.' },
      { label: 'unrelated without clause', text: 'It works without setup and guarantees results.' },
      { label: 'unrelated no clause', text: 'It has no caveat but guarantees placement.' },
      { label: 'unrelated not clause', text: 'Not only fast, it guarantees quality.' },
      { label: 'additive not-only guarantee', text: 'It not only guarantees speed but improves quality.' },
      { label: 'past guarantee', text: 'The extension guaranteed clean outputs.' },
      { label: 'ranking', text: 'This is the best extension for image quality.' },
      { label: 'choice ranking', text: 'This is the best choice.' },
      { label: 'first-place ranking', text: 'This extension ranked first.' },
      { label: 'number-one ranking', text: 'This is the #1 extension.' },
      { label: 'top ranking', text: 'This is the top-ranked workflow.' },
      { label: 'perfect output', text: 'This tool produces perfect outputs.' },
      { label: 'hype', text: 'This is a game-changer.' },
      { label: 'popularity', text: 'This is the most popular extension.' },
      { label: 'adoption claim', text: 'This extension is widely adopted.' },
      { label: 'creator popularity', text: 'This extension is popular with creators.' },
      { label: 'audience size', text: 'Used by millions of creators.' },
      { label: 'currency price', text: 'The extension costs $9.99.' },
      { label: 'named currency price', text: 'The extension costs USD 12.' },
      { label: 'unqualified recurring price', text: 'The extension costs 12 per month.' },
      { label: 'tier claim', text: 'A premium tier is available.' },
      { label: 'numeric rating', text: 'Users rate it 4.8/5.' },
      { label: 'written numeric rating', text: 'It is rated 4.8 out of 5.' },
      { label: 'star rating', text: 'It has a five-star rating.' },
      { label: 'percentage benchmark', text: 'It runs 35% faster.' },
      { label: 'multiplier benchmark', text: 'It runs 2x faster.' },
      { label: 'written multiplier benchmark', text: 'It runs twice as fast.' },
      { label: 'failure benchmark', text: 'It has 35% fewer failures.' },
      { label: 'first-person finding', text: 'We found fewer failures.' },
      { label: 'test finding', text: 'Our tests showed cleaner output.' },
      { label: 'testing finding', text: 'Our testing showed fewer failures.' },
    ];

    for (const fixture of allowed) {
      expect(hasUnsupportedClaim(fixture.text), fixture.label).toBe(false);
    }
    for (const fixture of prohibited) {
      expect(hasUnsupportedClaim(fixture.text), fixture.label).toBe(true);
    }
  });

  it('prepares the Stable Diffusion workflow candidates from primary sources', () => {
    const limitation = 'No independent image-generation comparison was performed for this guide.';
    const legacyCopy = /hey there|imagine a world|ready to (?:transform|supercharge)|fellow ai art|unlock (?:new|unprecedented)|\uFFFD|PromptMaster/i;
    const inventedExperience = /\b(?:i know i(?:'|’)ve|i(?:'|’)ve (?:found|tried|learned|experienced)|in my experience|my go-to|in my opinion|what works for me|trust me|for me,? this)\b/i;

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
      expect(hasUnsupportedClaim(proseWithoutUrls)).toBe(false);
    }
  });
});
