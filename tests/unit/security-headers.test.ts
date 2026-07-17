import { describe, expect, it } from 'vitest';
import { securityHeaders } from '@/next.config';

describe('security headers', () => {
  const headers = Object.fromEntries(securityHeaders.map(({ key, value }) => [key, value]));

  it('sets browser hardening headers', () => {
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['Permissions-Policy']).toMatch(/camera=\(\).*microphone=\(\).*geolocation=\(\)/);
    expect(headers['Strict-Transport-Security']).toMatch(/max-age=\d+.*includeSubDomains/i);
  });

  it('blocks objects and omits advertising origins while ads are disabled', () => {
    const csp = headers['Content-Security-Policy'];
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toMatch(/googlesyndication|doubleclick/);
  });
});
