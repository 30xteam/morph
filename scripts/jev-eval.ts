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
    readFileSync(join(ROOT, 'src/features/segmentation/data/crm-sample.json'), 'utf8'),
  ) as Json[];
  const profile = {
    ...profiles[0],
    signals: {
      eventsAttended: 0,
      emailsOpened: 0,
      emailsClicked: 0,
      programPageVisits: 0,
      roleChangedRecently: false,
      companyRaisedRound: false,
      daysSinceLastActivity: 3,
    },
  };
  const outcome = await post('/api/segment', { profile, trigger: 're_run' });
  const { provider, model, calibrated, latencyMs, inputTokens } = outcome.meta;
  const lines = [
    `# Jev smoke test · ${new Date().toISOString()}`,
    '',
    `- Provider: **${provider}** · model \`${model}\` · calibrated: **${calibrated}**`,
    `- Latency: **${latencyMs} ms** · input tokens: ${inputTokens}`,
    `- Program: ${outcome.program.value} (${pct(outcome.program.probability)}) · affinity: ${outcome.affinity.value} · light: ${outcome.light}`,
    `- salesReady ${pct(outcome.salesReady)} · decisionPower ${pct(outcome.decisionPower)} · wantsLearning ${pct(outcome.wantsLearning)}`,
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
  const limitArg = option('limit', '');
  const r = await post(
    '/api/segment/evaluate',
    limitArg ? { mode, limit: Number(limitArg) } : { mode },
  );
  const NEWLINE = String.fromCharCode(10);
  const programs = Object.keys(r.programConfusion as Record<string, unknown>);
  const confusion = programs
    .map(
      (expected) =>
        `| ${expected} | ${programs.map((got) => r.programConfusion[expected][got]).join(' | ')} |`,
    )
    .join(NEWLINE);
  const byInfo = Object.entries(r.programAccuracyByInfo as Record<string, Json>)
    .map(([level, row]) => `| ${level} | ${row.total} | ${pct(row.accuracy)} |`)
    .join(NEWLINE);
  const misses = (r.misses as Json[])
    .slice(0, 25)
    .map(
      (miss) => `- ${miss.alias}: 30X said ${miss.expected}, Jev said ${miss.got} (${miss.note})`,
    )
    .join(NEWLINE);

  const markdown = `# Jev vs 30X labels · ${mode} · ${new Date().toISOString()}

- Provider: **${r.provider}** (calibrated: ${r.calibrated}) · ${r.total} profiles from 30X's anonymized sample · ${r.jevCalls} Jev calls
- **Same program as 30X: ${pct(r.programAccuracy)}** · affinity band exact ${pct(r.affinityAccuracy)} · **within one band ${pct(r.affinityWithinOneBand)}**
- Role: taken from the CRM for the ${r.knownRoles} profiles that have it (not asked to Jev); Jev only infers it for the rest
- **Decided without a person: ${pct(r.decidedAloneShare)}** · program accuracy when deciding alone: ${pct(r.programAccuracyWhenAlone)}
- Light mix: green ${pct(r.lightShare.green)} · yellow ${pct(r.lightShare.yellow)} · red ${pct(r.lightShare.red)}
- Latency: avg ${r.avgLatencyMs} ms · p95 ${r.p95LatencyMs} ms · **cost per 1,000 profiles: ${usd(r.costPerThousandUsd)}**

## Program accuracy by how much 30X knows about the person

| Info level | Profiles | Same program |
| --- | --- | --- |
${byInfo}

## Program confusion (rows: 30X label, columns: Jev)

| 30X / Jev | ${programs.join(' | ')} |
| --- | ${programs.map(() => '---').join(' | ')} |
${confusion}

## First misses

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
  pnpm jev:eval [--consensus] [--limit N]  697 profiles vs 30X labels
  pnpm jev:simulate [--days 30]      re-decide on simulated activity
Options: --base http://localhost:3000`);
}
