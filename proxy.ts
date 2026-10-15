import { NextResponse, type NextRequest } from 'next/server';
import { goneModelSlugs, gonePostSlugs } from '@/data/gone-posts';

const gonePosts = new Set(gonePostSlugs);
const goneModels = new Set(goneModelSlugs);

const goneBody = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page removed</title></head><body style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;line-height:1.6"><h1>This page has been removed</h1><p>It is no longer available. See the current <a href="/blog">prompt guides</a> or use the <a href="/">prompt generator</a>.</p></body></html>`;

function gone() {
  return new NextResponse(goneBody, {
    status: 410,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}

export function proxy(request: NextRequest) {
  const [first, second] = request.nextUrl.pathname.split('/').filter(Boolean);
  if (first === 'blog' && second && gonePosts.has(second)) return gone();
  if (second === 'prompt-generator-for' && goneModels.has(first)) return gone();
  return NextResponse.next();
}

export const config = {
  matcher: ['/blog/:slug', '/:model/prompt-generator-for/:useCase'],
};
