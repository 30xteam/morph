import 'server-only';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const OG_COLORS = [
  'canvas',
  'card',
  'line',
  'ink',
  'ink-soft',
  'ink-muted',
  'accent',
  'green-fg',
  'yellow-fg',
  'red-fg',
] as const;

export type OgColors = Record<(typeof OG_COLORS)[number], string>;

/** Reads the dark-theme color tokens so generated images stay in sync with DESIGN.md. */
export async function readDarkColors(): Promise<OgColors> {
  const css = await readFile(join(process.cwd(), 'src/design/tokens.generated.css'), 'utf8');
  const entries = OG_COLORS.map((name) => {
    const match = css.match(new RegExp(`--ds-color-${name}-dark:\\s*([^;]+);`));
    if (!match?.[1]) throw new Error(`Missing design token --ds-color-${name}-dark`);
    return [name, match[1].trim()];
  });
  return Object.fromEntries(entries) as OgColors;
}
