import 'server-only';

/** Downloads a TrueType subset of a Google Font containing only `text`, as ImageResponse needs raw font data. */
export async function loadGoogleFont(family: string, weight: number, text: string) {
  const query = new URLSearchParams({ family: `${family}:wght@${weight}`, text });
  const css = await fetch(`https://fonts.googleapis.com/css2?${query}`).then((response) =>
    response.text(),
  );
  const source = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!source) throw new Error(`Could not resolve ${family} ${weight} from Google Fonts`);
  const response = await fetch(source);
  if (!response.ok) throw new Error(`Could not download ${family} ${weight}`);
  return response.arrayBuffer();
}
