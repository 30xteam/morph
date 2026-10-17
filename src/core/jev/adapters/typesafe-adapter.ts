import 'server-only';
import { z } from 'zod';

import { jevEnv } from '../jev-env';
import type { JevAdapter } from '../jev.types';

const probabilitiesSchema = z.record(z.string(), z.number());

const answerSchema = z.discriminatedUnion('type', [
  z.looseObject({
    type: z.literal('choice'),
    choice: z.string(),
    probabilities: probabilitiesSchema,
    confidence: z.number(),
  }),
  z.looseObject({
    type: z.literal('score'),
    score: z.number(),
    probabilities: probabilitiesSchema,
    confidence: z.number(),
  }),
  z.looseObject({ type: z.literal('noul'), noul: z.number() }),
]);

const systemOneResponseSchema = z.looseObject({
  model: z.string(),
  answers: z.record(z.string(), answerSchema),
  usage: z.looseObject({ input_tokens: z.number().optional() }).optional(),
  latency_ms: z.number().optional(),
  cost_usd: z.number().optional(),
});

export const typesafeAdapter: JevAdapter = async ({ state, questions }) => {
  if (!jevEnv.TYPESAFE_API_KEY) throw new Error('TYPESAFE_API_KEY is not set');

  const res = await fetch(`${jevEnv.TYPESAFE_BASE_URL.replace(/\/+$/, '')}/v1/systemone`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jevEnv.TYPESAFE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: jevEnv.TYPESAFE_MODEL, state, questions }),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`TypeSafe ${res.status}: ${await res.text()}`);
  const parsed = systemOneResponseSchema.safeParse(await res.json());
  if (!parsed.success) {
    throw new Error(
      `TypeSafe response has an unexpected shape. Run pnpm jev:raw and update the schema: ${z.prettifyError(parsed.error)}`,
    );
  }
  const data = parsed.data;

  return {
    provider: 'typesafe',
    model: data.model,
    calibrated: true,
    answers: data.answers,
    inputTokens: data.usage?.input_tokens ?? 0,
    latencyMs: data.latency_ms,
    costUsd: data.cost_usd,
  };
};
