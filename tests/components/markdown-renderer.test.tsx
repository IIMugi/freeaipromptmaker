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

    const scrollRegion = screen.getByRole('region', {
      name: 'Scrollable data table: Feature, Choice; first row: Regional separator, BREAK',
    });
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
| Safe cell <img src="x" onerror="window.compromised = true"> |`}
      />,
    );

    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.queryByText(/window\.compromised/)).not.toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAccessibleName(
      'Scrollable data table: Safe header; first row: Safe cell',
    );
    expect(screen.getByRole('columnheader', { name: 'Safe header' })).toBeVisible();
    expect(screen.getByRole('cell', { name: 'Safe cell' })).toBeVisible();
  });

  it('gives multiple scrollable tables unique content-derived accessible names', () => {
    render(
      <MarkdownRenderer
        content={`| Feature | Choice |
| --- | --- |
| Regional separator | BREAK |

| Feature | Choice |
| --- | --- |
| WebUI release | 1.10.1 |`}
      />,
    );

    const regions = screen.getAllByRole('region');
    expect(regions).toHaveLength(2);
    expect(regions[0]).toHaveAccessibleName(
      'Scrollable data table: Feature, Choice; first row: Regional separator, BREAK',
    );
    expect(regions[1]).toHaveAccessibleName(
      'Scrollable data table: Feature, Choice; first row: WebUI release, 1.10.1',
    );
    expect(new Set(regions.map((region) => region.getAttribute('aria-label'))).size).toBe(2);
    for (const region of regions) {
      expect(region).toHaveClass('overflow-x-auto');
      expect(region).toHaveAttribute('tabindex', '0');
      expect(within(region).getByRole('table')).toBeVisible();
    }
  });

  it('bounds table labels derived from long header and first-row content', () => {
    const longHeader = `Header ${'x'.repeat(100)}`;
    const longCell = `Cell ${'y'.repeat(100)}`;
    render(
      <MarkdownRenderer
        content={`| ${longHeader} | Choice |
| --- | --- |
| ${longCell} | Recorded value |`}
      />,
    );

    const region = screen.getByRole('region');
    const label = region.getAttribute('aria-label');
    expect(label).toContain('…');
    expect(label).not.toContain(longHeader);
    expect(label).not.toContain(longCell);
    expect(label?.length).toBeLessThanOrEqual(230);
  });
});
