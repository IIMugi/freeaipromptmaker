import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/script', () => ({
  default: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <script {...props}>{children}</script>
  ),
}));

describe('Google Analytics consent bootstrap', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GA4_ID;
    vi.resetModules();
  });

  it('rejects missing or unsafe measurement IDs', async () => {
    process.env.NEXT_PUBLIC_GA4_ID = "G-VALID' onload='alert(1)";
    const { GoogleAnalytics, GoogleConsentDefaults } = await import(
      '@/components/Analytics/GoogleAnalytics'
    );

    render(<><GoogleConsentDefaults /><GoogleAnalytics /></>);

    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
    expect(screen.queryByTestId('google-consent-defaults')).not.toBeInTheDocument();
  });

  it('sets denied defaults before loading and configuring a valid tag', async () => {
    process.env.NEXT_PUBLIC_GA4_ID = 'G-TEST123';
    const { GoogleAnalytics, GoogleConsentDefaults } = await import(
      '@/components/Analytics/GoogleAnalytics'
    );

    const { container } = render(<><GoogleConsentDefaults /><GoogleAnalytics /></>);
    const scripts = Array.from(container.querySelectorAll('script'));
    const defaults = scripts.find((script) => script.dataset.testid === 'google-consent-defaults');
    const external = scripts.find((script) => script.src.includes('googletagmanager.com'));
    const config = scripts.find((script) => script.id === 'google-analytics');

    expect(defaults?.textContent).toMatch(/consent['"],\s*['"]default/);
    expect(defaults?.textContent).toMatch(/analytics_storage['"]?:\s*['"]denied/);
    expect(defaults?.textContent).toMatch(/ad_storage['"]?:\s*['"]denied/);
    expect(defaults?.textContent).toMatch(/ad_user_data['"]?:\s*['"]denied/);
    expect(defaults?.textContent).toMatch(/ad_personalization['"]?:\s*['"]denied/);
    expect(scripts.indexOf(defaults!)).toBeLessThan(scripts.indexOf(external!));
    expect(scripts.indexOf(defaults!)).toBeLessThan(scripts.indexOf(config!));
    expect(external?.getAttribute('src')).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-TEST123',
    );
    expect(config?.textContent).toMatch(/site-consent-v2/);
    expect(config?.textContent).toMatch(/analytics-accepted/);
    expect(config?.textContent?.indexOf('analytics-accepted')).toBeLessThan(
      config?.textContent?.indexOf("'consent', 'update'") ?? -1,
    );
  });
});
