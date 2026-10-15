import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { POSTS_PER_PAGE } from '@/lib/blog';
import { getEditorialRecords } from '@/lib/editorial';

const postsDirectory = path.join(process.cwd(), 'posts');
const records = getEditorialRecords();

const posts = fs
  .readdirSync(postsDirectory)
  .filter((fileName) => /\.(md|mdx)$/.test(fileName))
  .map((fileName) => {
    const { data, content } = matter(fs.readFileSync(path.join(postsDirectory, fileName), 'utf8'));
    return { slug: fileName.replace(/\.(md|mdx)$/, ''), data, content };
  });

const verifiedPosts = posts.filter(({ slug }) => records[slug]?.state === 'verified');
const verifiedSlugs = new Set(verifiedPosts.map(({ slug }) => slug));
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

// Code blocks hold copy-paste prompt text, not editorial claims.
const prose = (content: string) => content.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');

const fabricatedExperience =
  /\b(?:i|we)(?:'ve|\s+(?:have|had))?\s+(?:(?:personally|independently|carefully)\s+)?(?:tested|benchmarked|ran|generated)\b|\bour (?:tests?|testing)\s+(?:showed|found|demonstrated|confirmed)\b|\bin my experience\b|\bi.ve found\b|\bwhat works for me\b/i;

describe('guide corpus', () => {
  it('has exactly one editorial record per guide', () => {
    expect(Object.keys(records).sort()).toEqual(posts.map(({ slug }) => slug).sort());
  });

  it('indexes at least one verified guide', () => {
    expect(verifiedPosts.length).toBeGreaterThan(0);
  });

  it('keeps every verified guide on the server-rendered first hub page', () => {
    // One featured post plus one page of the list.
    expect(verifiedPosts.length).toBeLessThanOrEqual(POSTS_PER_PAGE + 1);
  });

  describe.each(verifiedPosts)('verified guide $slug', ({ slug, data, content }) => {
    const record = records[slug];

    it('has search-ready frontmatter', () => {
      expect(data.title?.trim()).toBeTruthy();
      expect(data.title.length).toBeLessThanOrEqual(65);
      expect(data.description.length).toBeGreaterThanOrEqual(110);
      expect(data.description.length).toBeLessThanOrEqual(160);
      expect(data.date).toMatch(isoDate);
      expect(data.author).toBe('Eren Koray');
    });

    it('records when and against which sources it was verified', () => {
      expect(record.lastVerified).toMatch(isoDate);
      expect(record.sources?.length).toBeGreaterThan(0);
      for (const source of record.sources ?? []) {
        expect(source).toMatch(/^https:\/\//);
        expect(content).toContain(source);
      }
    });

    it('does not claim hands-on testing that was never done', () => {
      expect(prose(content)).not.toMatch(fabricatedExperience);
    });

    it('links only to guides that are themselves indexed', () => {
      const blogLinks = [...content.matchAll(/\]\(\/blog\/([^)\s#?]+)/g)].map((match) => match[1]);
      for (const target of blogLinks) expect(verifiedSlugs).toContain(target);
    });
  });

  it('does not invent a current date when metadata is missing', () => {
    const blogSource = fs.readFileSync(path.join(process.cwd(), 'lib/blog.ts'), 'utf8');
    expect(blogSource).not.toMatch(/date:\s*data\.date\s*\|\|\s*new Date\(\)/);
  });
});
