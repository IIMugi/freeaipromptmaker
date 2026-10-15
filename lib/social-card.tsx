import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

// The social preview: the cyanotype palette from app/globals.css, with a role-marked sample prompt.
const C = {
  ground: '#0c1b2e',
  ink: '#e8eef5',
  ink2: '#b9c7d6',
  line: '#24405f',
  style: '#9cc0f2',
  light: '#e0b77a',
  param: '#9ccbae',
};

const SAMPLE: Array<{ text: string; color: string }> = [
  { text: 'an old fisherman mending nets', color: C.ink },
  { text: ', ', color: C.ink2 },
  { text: 'oil painting', color: C.style },
  { text: ', ', color: C.ink2 },
  { text: 'golden hour light', color: C.light },
  { text: ' ', color: C.ink2 },
  { text: '--ar 4:5', color: C.param },
];

export const socialCardSize = { width: 1200, height: 630 };

export function socialCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: C.ground,
          color: C.ink,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 11,
              background: C.style,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 6,
              padding: '0 11px',
            }}
          >
            <div style={{ width: 30, height: 5, borderRadius: 3, background: C.ground }} />
            <div style={{ width: 20, height: 5, borderRadius: 3, background: C.ground, opacity: 0.75 }} />
            <div style={{ width: 13, height: 5, borderRadius: 3, background: C.ground, opacity: 0.5 }} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>{SITE.name}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.04, letterSpacing: -1.5 }}>
            Free AI Image Prompt Generator
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginTop: 40,
              paddingTop: 28,
              borderTop: `2px solid ${C.line}`,
              fontSize: 32,
              fontFamily: 'monospace',
            }}
          >
            {SAMPLE.map((part, index) => (
              <span key={index} style={{ color: part.color, whiteSpace: 'pre' }}>
                {part.text}
              </span>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 26, color: C.ink2 }}>For Midjourney, Stable Diffusion, Flux, ChatGPT and Gemini. Free, in your browser.</div>
      </div>
    ),
    socialCardSize,
  );
}
