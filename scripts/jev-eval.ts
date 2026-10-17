import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// oxlint-disable-next-line typescript/no-explicit-any -- untyped JSON returned by the local API
type Json = Record<string, any>;

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const REPORTS = join(ROOT, 'docs', 'evaluation');
const args = process.argv.slice(2);
const command = args[0] ?? 'help';
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string, fallback: string) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? (args[index + 1] ?? fallback) : fallback;
};
const BASE = option('base', process.env.EVAL_BASE_URL ?? 'http://localhost:3000');

const pct = (value: number) => `${(value * 100).toFixed(1)}%`;
const usd = (value: number) => `$${value.toFixed(value < 0.01 ? 5 : 2)}`;
const stamp = () => new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');

async function post(path: string, body: unknown): Promise<Json> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as Json;
  if (!res.ok) throw new Error(`${path} → ${res.status}: ${JSON.stringify(data).slice(0, 400)}`);
  return data;
}

function save(name: string, markdown: string, data: Json) {
  mkdirSync(REPORTS, { recursive: true });
  const base = join(REPORTS, `${stamp()}-${name}`);
  writeFileSync(`${base}.md`, markdown);
  writeFileSync(`${base}.json`, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`\nSaved ${base}.md and .json`);
}

async function smoke() {
  const profiles = JSON.parse(
    readFileSync(join(ROOT, 'src/features/segmentation/evaluation/profiles.json'), 'utf8'),
  ) as Json[];
  const outcome = await post('/api/segment', { profile: profiles[0], trigger: 're_run' });
  const { provider, model, calibrated, latencyMs, inputTokens } = outcome.meta;
  const lines = [
    `# Jev smoke test · ${new Date().toISOString()}`,
    '',
    `- Provider: **${provider}** · model \`${model}\` · calibrated: **${calibrated}**`,
    `- Latency: **${latencyMs} ms** · input tokens: ${inputTokens}`,
    `- Segment: ${outcome.segment.value} (${pct(outcome.segment.probability)}) · light: ${outcome.light}`,
    `- salesReady ${pct(outcome.salesReady)} · decisionPower ${pct(outcome.decisionPower)} · fitsOffer ${pct(outcome.fitsOffer)} · wantsLearning ${pct(outcome.wantsLearning)}`,
    '',
    'No API keys are included in this report.',
  ];
  console.log(lines.join('\n'));
  save(`smoke-${provider}`, `${lines.join('\n')}\n`, outcome);

  const pass = provider === 'typesafe' && calibrated;
  console.log(
    pass
      ? '\nCUT-OFF CHECK: PASS. Real Jev answers with calibrated probabilities.'
      : '\nCUT-OFF CHECK: FAIL. Not real Jev. At 12:00 the team switches to the fallback (see docs/evaluation/README.md).',
  );
  process.exitCode = pass ? 0 : 2;
}

async function evaluate() {
  const mode = flag('consensus') ? 'consensus' : 'single';
  const r = await post('/api/segment/evaluate', { mode });
  const fields = Object.entries(r.fieldAccuracy as Record<string, number>)
    .map(([field, value]) => `| ${field} | ${pct(value)} |`)
    .join('\n');
  const confusion = (['green', 'yellow', 'red'] as const)
    .map(
      (expected) =>
        `| ${expected} | ${r.lightConfusion[expected].green} | ${r.lightConfusion[expected].yellow} | ${r.lightConfusion[expected].red} |`,
    )
    .join('\n');
  const misses = (r.misses as Json[])
    .map(
      (miss) =>
        `- ${miss.alias}: expected ${miss.expected}, got ${miss.got} (${miss.fields.join(', ')})`,
    )
    .join('\n');

  const markdown = `# Jev evaluation · ${mode} · ${new Date().toISOString()}

- Provider: **${r.provider}** (calibrated: ${r.calibrated}) · ${r.total} annotated profiles · ${r.jevCalls} Jev calls
- **Segment accuracy ${pct(r.segmentAccuracy)}** · **traffic light accuracy ${pct(r.lightAccuracy)}**
- **Decided alone (no person): ${pct(r.decidedAloneShare)}** · accuracy when deciding alone: ${pct(r.accuracyWhenAlone)}
- Light mix: green ${pct(r.lightShare.green)} · yellow ${pct(r.lightShare.yellow)} · red ${pct(r.lightShare.red)}
- Latency: avg ${r.avgLatencyMs} ms · p95 ${r.p95LatencyMs} ms
- **Cost per 1,000 profiles: ${usd(r.costPerThousandUsd)}**

| Question | Accuracy |
| --- | --- |
${fields}

| Expected \\ got | green | yellow | red |
| --- | --- | --- | --- |
${confusion}

## Misses (segment or light)

${misses || 'None.'}
`;
  console.log(markdown);
  save(`eval-${mode}-${r.provider}`, markdown, r);
}

async function simulate() {
  const days = Number(option('days', '30'));
  const r = await post('/api/segment/simulate', {
    days,
    seed: Number(option('seed', '30')),
    consensus: flag('consensus'),
  });
  const timeline = (r.timeline as Json[])
    .filter((row) => row.day % 5 === 0 || row.day === 1)
    .map((row) => `| ${row.day} | ${row.decisions} | ${row.green} | ${row.yellow} | ${row.red} |`)
    .join('\n');
  const transitions = (r.transitions as Json[])
    .slice(0, 25)
    .map((t) => `- Day ${t.day} · ${t.alias} · ${t.trigger}: ${t.from} → ${t.to}`)
    .join('\n');

  const markdown = `# ${days}-day simulation · ${new Date().toISOString()}

- Provider: **${r.provider}** (calibrated: ${r.calibrated}) · ${r.profiles} profiles · seed ${option('seed', '30')}
- ${r.decisions} decisions · ${r.jevCalls} Jev calls · total cost ${usd(r.totalCostUsd)}
- **${r.changedLight} profiles ended with a different light than on day 0** (a static segment would miss them)
- **${r.newGreens} new greens** appeared after day 0

| Day | Decisions | Green | Yellow | Red |
| --- | --- | --- | --- | --- |
${timeline}

## Transitions (first 25)

${transitions || 'None.'}
`;
  console.log(markdown);
  save(`simulate-${days}d-${r.provider}`, markdown, r);
}

const commands: Record<string, () => Promise<void>> = { smoke, eval: evaluate, simulate };

if (commands[command]) {
  await commands[command]().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
} else {
  console.log(`Usage (dev server running):
  pnpm jev:smoke                     one real call + 12:00 cut-off check
  pnpm jev:eval [--consensus]        60 annotated profiles
  pnpm jev:simulate [--days 30]      re-decide on simulated activity
Options: --base http://localhost:3000`);
}
