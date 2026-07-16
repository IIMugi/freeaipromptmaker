import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const port = Number(process.env.ROUTE_AUDIT_PORT || 3201);
const origin = `http://127.0.0.1:${port}`;
const siteOrigin = 'https://freeaipromptmaker.com';
const manifestPath = path.resolve('.next/prerender-manifest.json');
const reportPath = path.resolve('work/route-audit.json');
const expectedRedirects = new Map([
  ['/flux-pro', '/prompt-generators'],
  [
    '/blog/2025-11-27-stable-diffusion-negative-prompts-guide',
    '/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
  ],
]);
const expectedGone = '/blog/2026-02-05-ai-art-reference-guide-inspiration-prompts/keyword';

function tags(html, name) {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) || [];
}

function attribute(tag, name) {
  return tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'))?.[1] || '';
}

function pathsFromSitemap(xml) {
  return new Set(
    [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname),
  );
}

function internalPath(raw) {
  if (!raw || /^(#|mailto:|tel:|javascript:)/i.test(raw)) return null;
  try {
    const url = new URL(raw, siteOrigin);
    if (url.origin !== siteOrigin && url.origin !== origin) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

async function waitForServer(child) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Production server exited with ${child.exitCode}`);
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('Production server did not become ready within 30 seconds');
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await worker(items[index]);
      }
    }),
  );
  return results;
}

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const pagePaths = Object.keys(manifest.routes).filter(
  (route) => !route.startsWith('/_') && route !== '/robots.txt' && route !== '/sitemap.xml',
);
const routes = [...new Set([...pagePaths, ...expectedRedirects.keys(), expectedGone])].sort();
const nextBin = path.resolve('node_modules/next/dist/bin/next');
const child = spawn(process.execPath, [nextBin, 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
});

let serverOutput = '';
child.stdout.on('data', (chunk) => (serverOutput += chunk.toString()));
child.stderr.on('data', (chunk) => (serverOutput += chunk.toString()));

const issues = [];
const discoveredLinks = new Set();
const discoveredAssets = new Set();

try {
  await waitForServer(child);
  const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
  if (sitemapResponse.status !== 200) issues.push(`sitemap returned ${sitemapResponse.status}`);
  const sitemapPaths = pathsFromSitemap(await sitemapResponse.text());

  const results = await mapLimit(routes, 12, async (route) => {
    const response = await fetch(`${origin}${route}`, { redirect: 'manual' });
    const contentType = response.headers.get('content-type') || '';
    const result = { route, status: response.status, contentType };

    if (expectedRedirects.has(route)) {
      const location = response.headers.get('location');
      if (response.status !== 308 || location !== expectedRedirects.get(route)) {
        issues.push(`${route}: expected 308 to ${expectedRedirects.get(route)}, got ${response.status} to ${location}`);
      }
      return result;
    }
    if (route === expectedGone) {
      if (response.status !== 410) issues.push(`${route}: expected 410, got ${response.status}`);
      return result;
    }
    if (response.status !== 200) {
      issues.push(`${route}: expected 200, got ${response.status}`);
      return result;
    }
    if (!contentType.includes('text/html')) return result;

    const html = await response.text();
    const canonicalTags = tags(html, 'link').filter((tag) => /rel=["'][^"']*canonical/i.test(tag));
    if (canonicalTags.length !== 1) {
      issues.push(`${route}: expected one canonical, found ${canonicalTags.length}`);
    } else {
      const canonical = attribute(canonicalTags[0], 'href');
      try {
        if (new URL(canonical).pathname !== route) issues.push(`${route}: canonical points to ${canonical}`);
      } catch {
        issues.push(`${route}: invalid canonical ${canonical}`);
      }
    }

    const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
    if (h1Count !== 1) issues.push(`${route}: expected one H1, found ${h1Count}`);

    const robotsTag = tags(html, 'meta').find((tag) => /name=["']robots["']/i.test(tag));
    const noindex = /noindex/i.test(robotsTag ? attribute(robotsTag, 'content') : '');
    if (noindex && sitemapPaths.has(route)) issues.push(`${route}: noindex page appears in sitemap`);
    if (!noindex && !sitemapPaths.has(route)) issues.push(`${route}: indexable page is absent from sitemap`);
    if (/aggregateRating|reviewRating/i.test(html)) issues.push(`${route}: unsupported rating schema found`);

    for (const tag of tags(html, 'a')) {
      const value = internalPath(attribute(tag, 'href'));
      if (value) discoveredLinks.add(value);
    }
    for (const tag of [...tags(html, 'img'), ...tags(html, 'script'), ...tags(html, 'link')]) {
      const raw = attribute(tag, 'src') || attribute(tag, 'href');
      const value = internalPath(raw);
      if (value && /\.(?:avif|css|gif|ico|jpe?g|js|png|svg|webp|woff2?)(?:\?|$)/i.test(value)) {
        discoveredAssets.add(value);
      }
    }
    return result;
  });

  await mapLimit([...discoveredLinks], 16, async (route) => {
    const response = await fetch(`${origin}${route}`, { redirect: 'manual' });
    if (response.status >= 400 && route !== expectedGone) {
      issues.push(`internal link ${route}: returned ${response.status}`);
    }
  });
  await mapLimit([...discoveredAssets], 16, async (route) => {
    const response = await fetch(`${origin}${route}`);
    if (response.status >= 400) issues.push(`asset ${route}: returned ${response.status}`);
  });

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(
    reportPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        routesChecked: results.length,
        sitemapUrls: sitemapPaths.size,
        internalLinksChecked: discoveredLinks.size,
        assetsChecked: discoveredAssets.size,
        statusCounts: results.reduce((counts, item) => {
          counts[item.status] = (counts[item.status] || 0) + 1;
          return counts;
        }, {}),
        issues,
      },
      null,
      2,
    )}\n`,
  );

  console.log(
    `Route audit: ${results.length} routes, ${sitemapPaths.size} sitemap URLs, ${discoveredLinks.size} internal links, ${discoveredAssets.size} assets`,
  );
  if (issues.length) {
    console.error(issues.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Route audit passed with 0 issues.');
  }
} finally {
  child.kill('SIGTERM');
  if (process.exitCode && serverOutput) console.error(serverOutput);
}
