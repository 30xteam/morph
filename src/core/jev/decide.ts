import 'server-only';
import { mockAdapter } from './adapters/mock-adapter';
import { openrouterAdapter } from './adapters/openrouter-adapter';
import { typesafeAdapter } from './adapters/typesafe-adapter';
import { jevEnv } from './jev-env';
import type { JevAdapter, JevProvider, JevRequest, JevResult } from './jev.types';

const ADAPTERS: Record<JevProvider, JevAdapter> = {
  mock: mockAdapter,
  typesafe: typesafeAdapter,
  openrouter: openrouterAdapter,
};

/** Price TypeSafe publishes for Jev input tokens; output tokens are free. */
export const JEV_USD_PER_MILLION_INPUT_TOKENS = 0.042;

export function estimateCostUsd(inputTokens: number) {
  return (inputTokens / 1_000_000) * JEV_USD_PER_MILLION_INPUT_TOKENS;
}

/**
 * Sends one state and a set of typed questions to the provider picked by `JEV_PROVIDER`
 * and returns every answer from a single pass, with the provider's latency and cost when it
 * reports them.
 */
export async function decide(request: JevRequest): Promise<JevResult> {
  const started = performance.now();
  const result = await ADAPTERS[jevEnv.JEV_PROVIDER](request);
  return {
    ...result,
    latencyMs: result.latencyMs ?? Math.round(performance.now() - started),
    costUsd: result.costUsd ?? estimateCostUsd(result.inputTokens),
  };
}
