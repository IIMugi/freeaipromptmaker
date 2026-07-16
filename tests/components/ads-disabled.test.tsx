import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AdUnit } from '@/components/Ads/AdUnit';
import { AdSenseScript } from '@/components/Ads/AdSenseScript';

describe('readiness advertising', () => {
  it('renders no script, slot, label, or placeholder', () => {
    const { container } = render(
      <>
        <AdSenseScript />
        <AdUnit slot="test" />
      </>,
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText(/advert|placeholder/i)).not.toBeInTheDocument();
    expect(document.querySelector('script[src*="googlesyndication"]')).not.toBeInTheDocument();
  });
});
