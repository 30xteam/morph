import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { SEGMENTATION_QUESTIONS } from '../src/libs/segmentation/config/questions.ts';
import { toJevState } from '../src/libs/segmentation/services/profile-state.ts';
import type { Profile } from '../src/libs/segmentation/types/segmentation.types.ts';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const REPORTS = join(ROOT, 'docs', 'evaluation');
const SECRET_HEADERS = new Set(['authorization', 'cookie', 'set-cookie', 'x-api-key']);

const apiKey = process.env.TYPESAFE_API_KEY;
const baseUrl = (process.env.TYPESAFE_BASE_URL || 'https://api.typesafe.ai').replace(/\/+$/, '');
const model = process.env.TYPESAFE_MODEL || 'jev-latest';

function redact(text: string) {
  return apiKey ? text.replaceAll(apiKey, '[redacted]') : text;
}

async function main() {
  if (!apiKey) {
    console.error('TYPESAFE_API_KEY is not set. Add it to .env.local and never commit it.');
    process.exitCode = 1;
    return;
  }

  const profiles = JSON.parse(
    readFileSync(join(ROOT, 'src/libs/segmentation/data/crm-sample.json'), 'utf8'),
  ) as Profile[];
  const [stored] = profiles;
  const profile = stored
    ? {
        ...stored,
        signals: {
          eventsAttended: 0,
          emailsOpened: 0,
          emailsClicked: 0,
          programPageVisits: 0,
          roleChangedRecently: false,
          companyRaisedRound: false,
          daysSinceLastActivity: 3,
        },
      }
    : undefined;
  if (!profile) throw new Error('profiles.json is empty');

  const request = { model, state: toJevState(profile), questions: SEGMENTATION_QUESTIONS };
  const started = performance.now();
  const res = await fetch(`${baseUrl}/v1/systemone`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const latencyMs = Math.round(performance.now() - started);
  const body = redact(await res.text());

  let parsedBody: unknown = body;
  try {
    parsedBody = JSON.parse(body);
  } catch {
    parsedBody = body;
  }

  const capture = {
    capturedAt: new Date().toISOString(),
    endpoint: `${baseUrl}/v1/systemone`,
    status: res.status,
    latencyMs,
    headers: Object.fromEntries(
      [...res.headers].filter(([name]) => !SECRET_HEADERS.has(name.toLowerCase())),
    ),
    request,
    body: parsedBody,
  };

  mkdirSync(REPORTS, { recursive: true });
  const file = join(
    REPORTS,
    `${capture.capturedAt.slice(0, 16).replace(/[:T]/g, '-')}-raw-typesafe.json`,
  );
  writeFileSync(file, `${JSON.stringify(capture, null, 2)}\n`);

  console.log(`HTTP ${res.status} in ${latencyMs} ms`);
  console.log(JSON.stringify(parsedBody, null, 2).slice(0, 4000));
  console.log(`\nSaved ${file} (no API key inside).`);
  if (!res.ok) process.exitCode = 1;
}

await main();
