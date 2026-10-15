import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PromptLandingPage } from '@/components/Seo/PromptLandingPage';
import PromptGeneratorsHubPage, { metadata as hubMetadata } from '@/app/prompt-generators/page';
import { generateMetadata } from '@/app/prompt-generator-for/[useCase]/page';
import {
  countExamples,
  getRelatedPromptUseCases,
  promptUseCases,
  getUseCaseTitle,
} from '@/data/prompt-use-cases';
import { defaultSelections } from '@/lib/use-case-prompt';

const editorial = JSON.parse(readFileSync('data/editorial-status.json', 'utf8')) as Record<string, { state: string }>;
const fabricated =
  /we (?:tested|found)|tested recommendations|not independently tested|hypothes[ie]s|worksheet|best models?|industry-leading|outperform|high[- ]ctr|conversion rates?|guaranteed|professional quality/i;

describe('prompt use-case pages', () => {
  it('keeps the twelve existing URLs', () => {
    expect(promptUseCases.map((useCase) => useCase.slug).sort()).toEqual([
      'anime',
      'architecture',
      'cinematic-portraits',
      'fantasy-scenes',
      'fashion-editorial',
      'food-photography',
      'game-concepts',
      'logos',
      'pixel-art',
      'product-photography',
      'real-estate-interiors',
      'youtube-thumbnails',
    ]);
  });

  it.each(promptUseCases.map((useCase) => [useCase.slug, useCase] as const))('%s has valid metadata and content', (_, useCase) => {
    const title = getUseCaseTitle(useCase);
    expect(title).not.toContain('{count}');
    expect(title.length).toBeLessThanOrEqual(65);
    expect(useCase.description.length).toBeGreaterThanOrEqual(110);
    expect(useCase.description.length).toBeLessThanOrEqual(160);

    const total = countExamples(useCase);
    expect(total).toBeGreaterThanOrEqual(20);
    expect(total).toBeLessThanOrEqual(40);
    const prompts = useCase.examples.flatMap((group) => group.prompts);
    expect(new Set(prompts).size).toBe(prompts.length);

    expect(useCase.tips.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(useCase)).not.toMatch(fabricated);

    for (const slug of useCase.guides) expect(editorial[slug]?.state, slug).toBe('verified');

    const { builder } = useCase;
    expect(builder.defaultSubject.trim()).not.toBe('');
    expect(builder.aspectRatios.length).toBeGreaterThan(0);
    for (const word of builder.midjourneyNo) expect(word, 'Midjourney --no reads words separately').not.toMatch(/\s/);
    const selections = defaultSelections(builder);
    for (const [groupId, ids] of Object.entries(builder.defaults)) {
      expect(selections[groupId], `${groupId} defaults must be existing options`).toEqual(ids);
      const group = builder.groups.find((item) => item.id === groupId)!;
      if (!group.multiple) expect(ids.length).toBeLessThanOrEqual(1);
    }
  });

  it('renders builder, examples and links without a nested main', () => {
    const useCase = promptUseCases.find((item) => item.slug === 'pixel-art')!;
    const html = renderToStaticMarkup(<PromptLandingPage useCase={useCase} />);

    expect(html).not.toMatch(/<main\b/i);
    expect(html).toContain('<h1');
    expect(html).toContain(useCase.h1);
    expect(html).toContain(`${countExamples(useCase)} Pixel Art prompts to copy`);
    expect(html).toContain(useCase.examples[0]!.prompts[0]);
    // The prompt is split into role-marked spans; compare the visible text.
    expect(html.replace(/<[^>]+>/g, '')).toContain('pixel art, a knight with a blue cape');
    expect(html).toContain('href="/negative-prompt-generator"');
    expect(html).toContain(`href="/blog/${useCase.guides[0]}"`);
    expect(html).not.toMatch(fabricated);
  });

  it('links every page onward to different related pages', () => {
    const targets = new Set<string>();
    for (const useCase of promptUseCases) {
      const related = getRelatedPromptUseCases(useCase.slug, 4);
      expect(related).toHaveLength(4);
      expect(related.map((item) => item.slug)).not.toContain(useCase.slug);
      related.forEach((item) => targets.add(item.slug));
    }
    expect(targets.size).toBe(promptUseCases.length);
  });

  it('uses the page title as an absolute title', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ useCase: 'youtube-thumbnails' }) });
    expect(metadata.title).toEqual({ absolute: 'YouTube Thumbnail Prompt Generator + 36 Free AI Prompts' });
  });

  it('renders the hub with a card for every use case', () => {
    const html = renderToStaticMarkup(PromptGeneratorsHubPage());
    expect(html).not.toMatch(/<main\b/i);
    for (const useCase of promptUseCases) expect(html).toContain(`href="/prompt-generator-for/${useCase.slug}"`);
    expect(html).not.toMatch(/href="\/[a-z0-9-]+\/prompt-generator-for\//);
    const title = (hubMetadata.title as { absolute: string }).absolute;
    expect(title.length).toBeLessThanOrEqual(65);
    expect(hubMetadata.description!.length).toBeLessThanOrEqual(160);
  });
});
