import type { JevAnswer, JevResult } from '@/core/jev/jev.types';

function averageDistribution(answers: JevAnswer[]) {
  const totals: Record<string, number> = {};
  for (const answer of answers) {
    if (answer.type === 'noul') continue;
    for (const [key, probability] of Object.entries(answer.probabilities)) {
      totals[key] = (totals[key] ?? 0) + probability / answers.length;
    }
  }
  return totals;
}

function mergeAnswer(answers: JevAnswer[]): JevAnswer {
  const [first] = answers;
  if (!first) throw new Error('No answers to merge');

  if (first.type === 'noul') {
    const noul = answers.reduce(
      (total, answer) => total + (answer.type === 'noul' ? answer.noul : 0),
      0,
    );
    return { type: 'noul', noul: noul / answers.length };
  }

  const probabilities = averageDistribution(answers);
  const [bestKey, confidence] = Object.entries(probabilities).reduce(
    (best, entry) => (entry[1] > best[1] ? entry : best),
    ['', -1] as [string, number],
  );

  if (first.type === 'choice')
    return { type: 'choice', choice: bestKey, probabilities, confidence };
  const score = Object.entries(probabilities).reduce(
    (total, [key, probability]) => total + Number(key) * probability,
    0,
  );
  return { type: 'score', score, probabilities, confidence };
}

export function mergeResults(results: JevResult[]): JevResult {
  const [first] = results;
  if (!first) throw new Error('No results to merge');

  const answers = Object.fromEntries(
    Object.keys(first.answers).map((id) => [
      id,
      mergeAnswer(results.flatMap((result) => (result.answers[id] ? [result.answers[id]] : []))),
    ]),
  );

  return {
    provider: first.provider,
    model: `${first.model} ×${results.length} consensus`,
    calibrated: results.every((result) => result.calibrated),
    answers,
    inputTokens: results.reduce((total, result) => total + result.inputTokens, 0),
    latencyMs: Math.max(...results.map((result) => result.latencyMs)),
    costUsd: results.reduce((total, result) => total + result.costUsd, 0),
  };
}
