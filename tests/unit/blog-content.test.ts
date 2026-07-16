import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import editorialStatus from '@/data/editorial-status.json';

const postsDirectory = path.join(process.cwd(), 'posts');
const postFiles = fs
  .readdirSync(postsDirectory)
  .filter((fileName) => /\.(md|mdx)$/.test(fileName));

const hasInlineImage = (text: string) => {
  const prose = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '');

  return /!\[[^\]]*\]\s*(?:\([^)]*\)|\[[^\]]*\])|<(?:img|image|picture)\b/i.test(prose);
};

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

const leonardoAndMidjourneyCandidates = [
  {
    slug: '2026-02-09-master-leonardo-ai-models',
    title: 'Leonardo AI Model Selection Reference (2026 Interface)',
    requiredMarkers: [
      'Interface documentation dated: 2026-02-17',
      'Catalog snapshot checked: 2026-07-16',
      'Leonardo Lucid Origin',
      'Leonardo Lucid Realism',
      'Leonardo Phoenix 1.0',
      'Fast',
      'Ultra',
      '## Prompt-control worksheet',
      '| Intent to document | Model entry to inspect | Vendor-documented application | Record before generating |',
      'Concept art, social media visuals',
      'High-end product mockups, cinematic portraits',
      'Stylized illustrations, vector-style stickers',
      'Creating custom LoRAs',
      'Detailed infographics',
    ],
    sourceUrls: [
      'https://intercom.help/leonardo-ai/en/articles/8942360-how-to-generate-images-with-leonardo-ai',
      'https://docs.leonardo.ai/me/docs/list-of-models',
      'https://leonardo.ai/news/ai-image-models',
    ],
    internalLinks: ['/blog/2026-02-22-master-leonardo-ai-negative-prompts'],
  },
  {
    slug: '2026-02-22-master-leonardo-ai-negative-prompts',
    title: 'Leonardo AI Negative Prompts: A Bounded Troubleshooting Reference',
    requiredMarkers: [
      'Input-location documentation checked: 2026-07-16',
      'starting hypotheses',
      'negative prompts do not guarantee removal',
      '## One-variable troubleshooting sequence',
      'negative prompt',
      'aspect ratio',
      'Canvas',
    ],
    sourceUrls: [
      'https://intercom.help/leonardo-ai/en/articles/8067671-prompting-tips-tricks',
      'https://intercom.help/leonardo-ai/en/articles/8942360-how-to-generate-images-with-leonardo-ai',
      'https://intercom.help/leonardo-ai/en/articles/8093145-how-to-use-canvas-editor-tool',
    ],
    internalLinks: ['/blog/2026-02-09-master-leonardo-ai-models'],
  },
  {
    slug: '2025-11-27-midjourney-v6-complete-prompt-guide',
    title: 'Midjourney V6.1 Parameter Reference (Legacy Model)',
    requiredMarkers: [
      'V8.1 is the current default',
      'V6.1 is a legacy model',
      'V6.1 was released on 2024-07-30',
      'default until 2025-06-16',
      'Documentation snapshot checked: 2026-07-16',
      '--v 6.1',
      '## Prompt text versus parameters',
      '## V6.1 compatibility table',
      '## Migration checklist',
      'Unversioned prompts are state-dependent and nonportable.',
    ],
    sourceUrls: [
      'https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version',
      'https://docs.midjourney.com/hc/en-us/articles/32859204029709-Parameter-List',
    ],
    internalLinks: [],
  },
] as const;

const rankingLimitation = /\bnot(?:\s+\w+){0,3}\s+the\s+best\s+(?:choice|extension|tool|model|workflow|results?|quality)\b/gi;
const rankingOrHype = /#\s*1\b|\btop[- ]ranked\b|\branked\s+(?:#?\s*1|first)\b|\b(?:ranked|rated|named|declared)\s+(?:as\s+)?(?:the\s+)?best\b|\b(?:the\s+)?best\s+(?:choice|extension|tool|model|workflow|results?|quality)\b|\bperfect(?:ly)?\s+(?:outputs?|results?|quality|placement|compatibility|images?)\b|\b(?:universally?|game[- ]changer)\b/i;
const popularityOrAudienceClaim = /\b(?:most popular|widely (?:used|adopted)|popular with|used by (?:millions|thousands)|trusted by (?:millions|thousands)|millions of (?:users|creators)|for everyone)\b/i;
const priceOrRatingClaim = /[$€£¥]\s*\d|\b(?:USD|EUR|GBP|TRY)\s*\d|\b(?:costs?|priced at|price of)\s+\d+(?:\.\d+)?(?:\s+per\s+\w+)?\b|\b\d+(?:\.\d{1,2})?\s*(?:dollars?|euros?|pounds?)\b|\b(?:free|paid|premium)\s+tier\b|\bpricing plan\b|\b\d(?:\.\d+)?\s*\/\s*(?:5|10|100)\b|\b(?:one|two|three|four|five)[ -]star\b|\b(?:rated|rating of)\s+\d(?:\.\d+)?(?:\s+out of\s+(?:5|10))?/i;
const benchmarkClaim = /\b\d+(?:\.\d+)?%\s+(?:faster|slower|better|fewer|improvement|increase|decrease)\b|\b\d+(?:\.\d+)?x\s+faster\b|\btwice\s+as\s+(?:fast|slow)\b/i;
const fabricatedTesting = /\b(?:i|we)(?:\s+(?:have\s+)?|'ve\s+)(?:personally\s+)?(?:tested|compared|benchmarked|verified|ran|generated|installed|used|found)\b|\bour (?:tests?|testing)\s+(?:showed|found|demonstrated|confirmed)\b/i;
const unsupportedModeCostClaim = /\bfast\s+is\s+cheaper\b|\bultra\s+uses\s+more\s+(?:tokens|credits)\b/i;
const fabricatedTestingLimitations = [/\bwe tested no prompts\b/gi] as const;

const affirmativeGuaranteeClaims = [
  /\b(?:i|we)\s+guarantee\b/i,
  /\b(?:this|it)\s+guarantees\b/i,
  /\b(?:this|it)\s+(?:can|does|will)\s+guarantee\b/i,
  /\bthe\s+(?:extension|feature|method|tool|workflow)\s+(?:guaranteed|guarantees)\b/i,
  /\b(?:and|but)\s+guarantees\b/i,
  /\bit\s+not only\s+guarantees\b/i,
] as const;

const rankingAndHypeLimitations = [
  rankingLimitation,
  /\bnot\s+top[- ]ranked\b/gi,
  /\bnot\s+universally?\s+(?:compatible|supported|applicable)\b/gi,
  /\bdoes not produce perfect outputs?\b/gi,
] as const;

const popularityAndAudienceLimitations = [
  /\bnot\s+(?:widely (?:used|adopted)|the most popular|for everyone)\b/gi,
] as const;

interface EditorialClaimFamily {
  name: string;
  patterns: readonly RegExp[];
  limitations?: readonly RegExp[];
}

// This automation intentionally detects only reviewable phrase families.
// Novel grammar remains a manual editorial-review concern rather than inferred NLP.
const boundedEditorialClaimFamilies: readonly EditorialClaimFamily[] = [
  { name: 'affirmative guarantees', patterns: affirmativeGuaranteeClaims },
  {
    name: 'rankings and hype',
    patterns: [rankingOrHype],
    limitations: rankingAndHypeLimitations,
  },
  {
    name: 'popularity and audience',
    patterns: [popularityOrAudienceClaim],
    limitations: popularityAndAudienceLimitations,
  },
  { name: 'pricing and ratings', patterns: [priceOrRatingClaim] },
  { name: 'benchmarks', patterns: [benchmarkClaim] },
  {
    name: 'fabricated testing',
    patterns: [fabricatedTesting],
    limitations: fabricatedTestingLimitations,
  },
  { name: 'nonnumeric mode-cost claims', patterns: [unsupportedModeCostClaim] },
] as const;

const normalizeBoundedEditorialText = (text: string) => text
  .normalize('NFKC')
  .replace(/’/g, "'");

const hasUnsupportedClaim = (text: string) => boundedEditorialClaimFamilies.some((family) => {
  const normalizedText = normalizeBoundedEditorialText(text);
  const reviewText = (family.limitations ?? []).reduce(
    (result, limitation) => result.replace(limitation, ''),
    normalizedText,
  );

  return family.patterns.some((pattern) => pattern.test(reviewText));
});

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
      { label: 'documented modes only', text: 'Fast and Ultra are documented generation-mode labels.' },
      { label: 'no mode-cost comparison', text: 'This guide makes no token or credit comparison.' },
      { label: 'explicit no-testing boundary', text: 'We tested no prompts.' },
      { label: 'limited adoption', text: 'not widely used' },
      { label: 'limited popularity', text: 'not the most popular' },
      { label: 'limited audience', text: 'not for everyone' },
      { label: 'limited compatibility', text: 'not universally compatible' },
      { label: 'limited output', text: 'does not produce perfect outputs' },
      { label: 'limited ranking', text: 'not top-ranked' },
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
      { label: 'auxiliary first-person testing', text: 'We have tested every model.' },
      { label: 'curly personally tested', text: 'I’ve personally tested every model.' },
      { label: 'ascii personally tested', text: "I've personally tested every model." },
      { label: 'curly contracted first-person testing', text: 'I’ve tested every model.' },
      { label: 'ascii contracted first-person comparison', text: "I've compared every model." },
      { label: 'curly contracted first-person generation', text: 'We’ve generated images with every model.' },
      { label: 'test finding', text: 'Our tests showed cleaner output.' },
      { label: 'testing finding', text: 'Our testing showed fewer failures.' },
      { label: 'fast cheaper claim', text: 'Fast is cheaper.' },
      { label: 'ultra token claim', text: 'Ultra uses more tokens.' },
      { label: 'ultra credit claim', text: 'Ultra uses more credits.' },
      { label: 'affirmative adoption', text: 'widely used' },
      { label: 'affirmative popularity', text: 'the most popular' },
      { label: 'affirmative audience', text: 'for everyone' },
      { label: 'affirmative compatibility', text: 'universally compatible' },
      { label: 'affirmative output', text: 'produces perfect outputs' },
      { label: 'affirmative ranking', text: 'top-ranked' },
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

  it('prepares the Leonardo and Midjourney reference candidates from bounded primary sources', () => {
    const limitation = 'No independent image-generation comparison was performed for this guide.';
    const evidenceBoundary = ['**Documented:**', '**Locally checked:**', '**Not tested:**'];
    const legacyCopy = /hey there|fellow ai art|unlock (?:the true|new|unprecedented)|master every parameter|stunning ai art|secret sauce|artistic superpower|\uFFFD|PromptMaster/i;
    const inventedExperience = /\b(?:i know i(?:'|’)ve|i(?:'|’)ve (?:found|tried|learned|experienced|tested|compared|benchmarked|generated)|in my experience|my go-to|in my opinion|what works for me|trust me|for me,? this)\b/i;

    for (const candidate of leonardoAndMidjourneyCandidates) {
      const raw = fs.readFileSync(path.join(postsDirectory, `${candidate.slug}.mdx`), 'utf8');
      const { data, content } = matter(raw);

      expect(data).toMatchObject({ title: candidate.title, author: 'Free AI Prompt Maker' });
      expect(data).not.toHaveProperty('image');
      expect(data).not.toHaveProperty('imageCredit');
      expect(data).not.toHaveProperty('imageCreditUrl');
      expect(content).toContain(limitation);
      expect(content).toMatch(/^## Primary sources\s*$/m);

      for (const boundary of evidenceBoundary) expect(content).toContain(boundary);
      for (const marker of candidate.requiredMarkers) expect(content).toContain(marker);
      for (const link of candidate.internalLinks) expect(content).toContain(`](${link})`);

      const primarySources = content.split(/^## Primary sources\s*$/m)[1] ?? '';
      const sourceUrls = primarySources.match(/https:\/\/[^\s)]+/g) ?? [];
      expect(new Set(sourceUrls).size).toBeGreaterThanOrEqual(2);
      for (const sourceUrl of candidate.sourceUrls) expect(primarySources).toContain(sourceUrl);

      const proseWithoutUrls = raw
        .replace(/\]\([^)]+\)/g, ']()')
        .replace(/https:\/\/[^\s)"']+/g, '');
      expect(proseWithoutUrls).not.toMatch(legacyCopy);
      expect(proseWithoutUrls).not.toMatch(inventedExperience);
      expect(hasUnsupportedClaim(proseWithoutUrls)).toBe(false);
    }
  });

  it('marks unversioned Midjourney prompts as state-dependent and nonportable', () => {
    const raw = fs.readFileSync(
      path.join(postsDirectory, '2025-11-27-midjourney-v6-complete-prompt-guide.mdx'),
      'utf8',
    );
    const { content } = matter(raw);

    expect(content).toContain('Unversioned prompts are state-dependent and nonportable.');
  });

  it('orders Leonardo automatic and explicit selection before model-dependent settings', () => {
    const raw = fs.readFileSync(
      path.join(postsDirectory, '2026-02-09-master-leonardo-ai-models.mdx'),
      'utf8',
    );
    const { content } = matter(raw);
    const automatic = content.indexOf('**Automatic selection:**');
    const explicit = content.indexOf('**Explicit selection:**');
    const settings = content.indexOf('## Settings vary by model');

    expect(automatic).toBeGreaterThanOrEqual(0);
    expect(explicit).toBeGreaterThan(automatic);
    expect(settings).toBeGreaterThan(explicit);
  });

  it('labels the Leonardo negative-prompt worksheet as conditional editorial hypotheses', () => {
    const raw = fs.readFileSync(
      path.join(postsDirectory, '2026-02-22-master-leonardo-ai-negative-prompts.mdx'),
      'utf8',
    );
    const { content } = matter(raw);

    expect(content).toContain('If a negative-prompt field is present in the signed-in interface');
    expect(content).not.toContain('In the negative-prompt input exposed by the current interface');
    expect(content).toContain('Editorial convention, not vendor syntax:');
    expect(content).toContain('comma-separated bare terms');
    expect(content).toContain('The issue-to-term mappings are editorial starting hypotheses, not vendor guidance.');
    expect(content).toContain('| Observed issue | Editorial term hypothesis | What stays fixed | Next single variable if it persists |');
    expect(content).toContain('This is an editorial experiment design, not a vendor-prescribed order.');
    expect(content).not.toContain('Follow the source order');
    expect(content).toContain('with Alchemy');

    const progression = [
      '1. **Negative prompt:**',
      '2. **Model:**',
      '3. **Aspect ratio:**',
      '4. **Style:**',
      '5. **Canvas:**',
    ].map((marker) => content.indexOf(marker));
    expect(progression.every((position) => position >= 0)).toBe(true);
    expect(progression).toEqual([...progression].sort((left, right) => left - right));
  });

  it('keeps the Midjourney first screen, example, compatibility, and migration boundaries explicit', () => {
    const raw = fs.readFileSync(
      path.join(postsDirectory, '2025-11-27-midjourney-v6-complete-prompt-guide.mdx'),
      'utf8',
    );
    const { content } = matter(raw);
    const firstScreen = content.slice(0, 900);

    expect(firstScreen).toContain('V8.1 is the current default; V6.1 is a legacy model.');
    expect(content).toContain('quiet reading room, oak shelves, afternoon window light --v 6.1');
    expect(content).toContain('The only positively confirmed V6.1 parameter in this reference is `--v 6.1`.');
    expect(content).toContain('The V6 chart is not reinterpreted as V6.1-specific documentation.');
    expect(content).toContain('Remove unsupported carryover before adding `--v 6.1`.');
  });

  it('contains no inline Markdown or HTML images in the six candidate bodies', () => {
    const candidates = [...stableDiffusionCandidates, ...leonardoAndMidjourneyCandidates];

    for (const candidate of candidates) {
      const raw = fs.readFileSync(path.join(postsDirectory, `${candidate.slug}.mdx`), 'utf8');
      const { content } = matter(raw);

      expect(hasInlineImage(content), candidate.slug).toBe(false);
    }
  });

  it('detects bounded Markdown, HTML, and MDX inline-image forms', () => {
    const inlineImages = [
      '![inline alt](https://example.com/image.png)',
      '![reference alt][image-id]',
      '<img src="/image.png" alt="HTML image" />',
      '<Image src="/image.png" alt="MDX image" />',
      '<picture><source srcSet="/image.webp" /></picture>',
    ];
    const allowedNonImages = [
      '[ordinary link](https://example.com)',
      '`<Image />` is discussed as code.',
    ];

    for (const fixture of inlineImages) expect(hasInlineImage(fixture), fixture).toBe(true);
    for (const fixture of allowedNonImages) expect(hasInlineImage(fixture), fixture).toBe(false);
  });
});
