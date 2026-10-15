// @vitest-environment node
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { gonePostSlugs } from '@/data/gone-posts';
import { permanentRedirects } from '@/data/redirects';
import { config, proxy } from '@/proxy';

const call = (path: string) => proxy(new NextRequest(new URL(path, 'https://freeaipromptmaker.com')));
const postSlugs = readdirSync(join(process.cwd(), 'posts')).map((file) => file.replace(/\.mdx$/, ''));

describe('proxy: removed URLs', () => {
  it('answers 410 for removed blog posts', async () => {
    const response = call(`/blog/${gonePostSlugs[0]}`);
    expect(response.status).toBe(410);
    expect(response.headers.get('x-robots-tag')).toBe('noindex');
    expect(await response.text()).toContain('/blog');
  });

  it('answers 410 for the old model-specific use-case pages', () => {
    expect(call('/midjourney/prompt-generator-for/anime').status).toBe(410);
    expect(call('/gpt4o/prompt-generator-for/logos').status).toBe(410);
  });

  it('lets kept pages through', () => {
    for (const path of ['/blog/2025-11-29-stable-diffusion-negative-prompts-guide', '/blog/does-not-exist', '/prompt-generator-for/anime']) {
      expect(call(path).status, path).toBe(200);
      expect(call(path).headers.get('x-middleware-next')).toBe('1');
    }
  });

  it('only runs on blog posts and model use-case paths', () => {
    expect(config.matcher).toEqual(['/blog/:slug', '/:model/prompt-generator-for/:useCase']);
  });
});

describe('content cleanup consistency', () => {
  it('never lists a kept post or a redirected post as gone', () => {
    const redirected = new Set(permanentRedirects.map((item) => item.source.replace('/blog/', '')));
    for (const slug of gonePostSlugs) {
      expect(postSlugs, slug).not.toContain(slug);
      expect(redirected.has(slug), slug).toBe(false);
    }
  });

  it('redirects removed posts only to pages that exist', () => {
    for (const { source, destination } of permanentRedirects) {
      if (!source.startsWith('/blog/')) continue;
      expect(postSlugs, source).not.toContain(source.slice('/blog/'.length));
      if (destination.startsWith('/blog/')) expect(postSlugs, destination).toContain(destination.slice('/blog/'.length));
    }
  });

  it('removed the model-specific route', () => {
    expect(existsSync(join(process.cwd(), 'app/[model]'))).toBe(false);
  });
});
