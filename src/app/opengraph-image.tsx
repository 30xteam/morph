import { ImageResponse } from 'next/og';

import { SITE } from '@/core/config/site';
import { readDarkColors } from '@/core/og/design-tokens';
import { loadGoogleFont } from '@/core/og/google-font';
import { OgGraphMotif } from '@/core/og/og-graph-motif';
import { MorphMark } from '@/ui/logo';

export const alt = `${SITE.name}: ${SITE.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const colors = await readDarkColors();
  const text = `${SITE.name}${SITE.description}`;
  const [semibold, regular] = await Promise.all([
    loadGoogleFont('Inter', 600, text),
    loadGoogleFont('Inter', 400, text),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: colors.canvas,
        fontFamily: 'Inter',
        padding: '72px 56px 72px 80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 600,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: colors.accent }}>
          <MorphMark size={72} />
          <span style={{ fontSize: 64, fontWeight: 600, color: colors.ink, letterSpacing: -2 }}>
            {SITE.name}
          </span>
        </div>
        <p
          style={{
            fontSize: 40,
            fontWeight: 400,
            lineHeight: 1.3,
            color: colors['ink-soft'],
            letterSpacing: -0.5,
            margin: 0,
          }}
        >
          {SITE.description}
        </p>
      </div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <OgGraphMotif colors={colors} />
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Inter', data: semibold, weight: 600, style: 'normal' },
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
      ],
    },
  );
}
