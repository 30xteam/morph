export function softmax(logits: number[]) {
  const max = Math.max(...logits);
  const exps = logits.map((logit) => Math.exp(logit - max));
  const sum = exps.reduce((total, value) => total + value, 0);
  return exps.map((value) => value / sum);
}

export function normalize(weights: number[]) {
  const sum = weights.reduce((total, value) => total + Math.max(value, 0), 0);
  if (sum === 0) return weights.map(() => 1 / weights.length);
  return weights.map((value) => Math.max(value, 0) / sum);
}

export function clampProbability(value: number) {
  if (!Number.isFinite(value)) return 0.5;
  return Math.min(Math.max(value, 0), 1);
}

export function argmax(values: number[]) {
  let best = 0;
  values.forEach((value, index) => {
    if (value > (values[best] ?? -Infinity)) best = index;
  });
  return best;
}

export function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export function toRankedAnswer(type: 'choice' | 'score', keys: string[], probabilities: number[]) {
  const best = argmax(probabilities);
  const byKey = Object.fromEntries(keys.map((key, index) => [key, probabilities[index] ?? 0]));
  const confidence = probabilities[best] ?? 0;

  if (type === 'choice') {
    return { type, choice: keys[best] ?? '', probabilities: byKey, confidence } as const;
  }
  const score = probabilities.reduce((total, p, index) => total + p * index, 0);
  return { type, score, probabilities: byKey, confidence } as const;
}
