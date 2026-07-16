import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LivePreview } from '@/components/Generator/LivePreview';

describe('prompt preview', () => {
  it('describes local formatting without invented quality scores', () => {
    render(
      <LivePreview
        prompt="quiet red fox --ar 4:5"
        model="flux"
        history={[]}
        draft={{
          subject: 'quiet red fox',
          style: 'editorial',
          camera: '50mm',
          negative: 'text',
          modelSyntax: 'Flux formatting active',
        }}
        validationMessage="Flux prompt is formatted locally."
        copyMessage=""
        showHistory={false}
        copyVariantState={null}
        onShowHistoryChange={vi.fn()}
        onCopyVariant={vi.fn()}
        onClearHistory={vi.fn()}
        onLoadFromHistory={vi.fn()}
        onDuplicateHistory={vi.fn()}
        onToggleFavorite={vi.fn()}
        onTogglePinned={vi.fn()}
        onRemixHistory={vi.fn()}
      />,
    );
    expect(screen.queryByText(/output confidence|syntax quality|guaranteed|\d+%/i)).not.toBeInTheDocument();
    expect(screen.getByText(/formatted locally for flux/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /copy prompt to clipboard/i })).toBeEnabled();
  });
});
