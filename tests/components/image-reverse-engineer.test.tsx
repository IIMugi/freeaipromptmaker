import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ImageReverseEngineer } from '@/components/ImageToPrompt/ImageReverseEngineer';

describe('image reverse engineer', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ code: 'analysis_unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }),
    ));
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:preview'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    });
  });

  it('preserves the selected file and points to the generator when analysis is unavailable, without fake output', async () => {
    render(<ImageReverseEngineer />);
    const input = screen.getByLabelText(/drop image or click to upload/i);
    const file = new File(
      [Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
      'sample.png',
      { type: 'image/png' },
    );
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /analyze image/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/currently unavailable/i);
    // No retry loop: the way forward is the prompt generator, and the file stays selected.
    expect(screen.queryByRole('button', { name: /analyze image/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /describe it in the prompt generator/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('button', { name: /remove image/i })).toBeEnabled();
    expect(screen.queryByText(/style dna/i)).not.toBeInTheDocument();
  });
});
