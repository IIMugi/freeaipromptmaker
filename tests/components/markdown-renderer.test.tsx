import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MarkdownRenderer } from '@/components/Blog/MarkdownRenderer';

describe('MarkdownRenderer', () => {
  it('renders GFM tables with accessible semantics inside a horizontal scroll region', () => {
    render(
      <MarkdownRenderer
        content={`| Feature | Choice |
| --- | --- |
| Regional separator | BREAK |
| Wildcard file | \`__name__\` |`}
      />,
    );

    const scrollRegion = screen.getByRole('region', { name: 'Scrollable data table' });
    expect(scrollRegion).toHaveClass('overflow-x-auto');
    expect(scrollRegion).toHaveAttribute('tabindex', '0');

    const table = within(scrollRegion).getByRole('table');
    expect(within(table).getAllByRole('columnheader')).toHaveLength(2);
    expect(within(table).getByRole('columnheader', { name: 'Feature' })).toBeVisible();
    expect(within(table).getByRole('columnheader', { name: 'Choice' })).toBeVisible();
    expect(within(table).getByRole('cell', { name: 'Regional separator' })).toBeVisible();
    expect(within(table).getByRole('cell', { name: 'BREAK' })).toBeVisible();
    expect(within(table).getByRole('cell', { name: '__name__' })).toBeVisible();
  });

  it('continues to strip raw HTML while rendering Markdown tables', () => {
    const { container } = render(
      <MarkdownRenderer
        content={`<script>window.compromised = true</script>

| Safe header |
| --- |
| Safe cell |`}
      />,
    );

    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(screen.queryByText(/window\.compromised/)).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Safe header' })).toBeVisible();
    expect(screen.getByRole('cell', { name: 'Safe cell' })).toBeVisible();
  });
});
