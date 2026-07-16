import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import editorialStatus from '@/data/editorial-status.json';

const postsDirectory = path.join(process.cwd(), 'posts');
const postFiles = fs
  .readdirSync(postsDirectory)
  .filter((fileName) => /\.(md|mdx)$/.test(fileName));

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
});
