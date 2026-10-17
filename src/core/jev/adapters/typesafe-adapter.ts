import 'server-only';
import { jevEnv } from '../jev-env';
import type { JevAdapter, JevAnswer } from '../jev.types';

interface SystemOneResponse {
  model: string;
  answers: Record<string, JevAnswer>;
  usage?: { input_tokens?: number };
}

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
  const data = (await res.json()) as SystemOneResponse;

  return {
    provider: 'typesafe',
    model: data.model,
    calibrated: true,
    answers: data.answers,
    inputTokens: data.usage?.input_tokens ?? 0,
  };
};
