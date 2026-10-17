import { Inter } from 'next/font/google';

/**
 * Single place where font files are loaded. Each family's CSS variable must be
 * `--font-<slug of the DESIGN.md fontFamily>` so tokens.generated.css can resolve it
 * (`Inter` → `--font-inter`). `pnpm design:sync` fails if a family is missing here.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const fontVariables = [inter.variable].join(' ');
