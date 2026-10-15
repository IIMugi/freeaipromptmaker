import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PromptLandingPage } from '@/components/Seo/PromptLandingPage';
import PromptGeneratorsHubPage from '@/app/prompt-generators/page';
import { generateMetadata as generateGenericMetadata } from '@/app/prompt-generator-for/[useCase]/page';
import * as useCaseData from '@/data/prompt-use-cases';

describe('prompt use-case publisher pages', () => {
  it('keeps only bounded, locally authored prompt inputs in the data schema', () => {
    expect(useCaseData.promptUseCases).toHaveLength(12);
    for (const useCase of useCaseData.promptUseCases) {
      expect(Object.keys(useCase).sort()).toEqual([
        'intent',
        'intro',
        'keywords',
        'negatives',
        'samplePrompts',
        'slug',
        'title',
      ]);
    }
    expect(useCaseData).not.toHaveProperty('modelUseCaseHints');
  });

  it('contains no ranking, outcome, popularity, benchmark, or fabricated-testing claims', () => {
    const corpus = JSON.stringify(useCaseData.promptUseCases);
    expect(corpus).not.toMatch(
      /tested recommendations|we (?:tested|found)|best models?|top choice|industry-leading|unmatched|superior|outperform|high[- ]ctr|conversion rates?|revenue|highest[- ]roi|3-second rule|consistent(?:ly)? (?:quality|results?|performance)|professional quality/i,
    );
  });

  it('renders a factual iteration worksheet without adding another main landmark', () => {
    const html = renderToStaticMarkup(
      <PromptLandingPage useCase={useCaseData.promptUseCases[0]!} />,
    );

    expect(html).not.toMatch(/<main\b/i);
    expect(html).toMatch(/Iteration worksheet/i);
    expect(html).toMatch(/not independently tested/i);
    expect(html).not.toMatch(/best ai models|pro tips|complete guide|tested recommendations/i);
  });

  it('renders the hub without a nested main or outcome promises', () => {
    const html = renderToStaticMarkup(PromptGeneratorsHubPage());
    expect(html).not.toMatch(/<main\b/i);
    expect(html).not.toMatch(/faster output quality|top creative workflows/i);
    expect(html).not.toMatch(/href="\/[a-z0-9-]+\/prompt-generator-for\//);
    expect(html).toContain('href="/prompt-generator-for/anime"');
  });

  it('keeps use-case metadata factual', async () => {
    const generic = await generateGenericMetadata({
      params: Promise.resolve({ useCase: 'youtube-thumbnails' }),
    });

    expect(generic.description).not.toMatch(/ready-to-use|optimized|best|tested|model-specific guidance/i);
  });
});
