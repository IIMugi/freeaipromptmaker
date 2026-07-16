import { describe, expect, it } from 'vitest';
import { securityHeaders } from '@/next.config';

describe('security headers', () => {
  const headers = Object.fromEntries(securityHeaders.map(({ key, value }) => [key, value]));

  it('sets browser hardening headers', () => {
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['Permissions-Policy']).toMatch(/camera=\(\).*microphone=\(\).*geolocation=\(\)/);
  });

  it('blocks objects and omits advertising origins while ads are disabled', () => {
    expect(headers['Content-Security-Policy']).toContain("object-src 'none'");
    expect(headers['Content-Security-Policy']).toContain("frame-src 'none'");
    expect(headers['Content-Security-Policy']).not.toMatch(/googlesyndication|doubleclick/);
  });
});
