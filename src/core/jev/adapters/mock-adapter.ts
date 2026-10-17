import 'server-only';
import { estimateTokens, softmax, toRankedAnswer } from '../jev-math';
import type { JevAdapter, JevAnswer, JevQuestion } from '../jev.types';

const STOP_WORDS = new Set(
  [
    'the and for with from that this are its their who has was not but',
    'an as at be by in is it of on or so to no do',
    'de la el en y o a con sin por para los las un una del al se su es lo le u',
    'dato rol',
  ]
    .join(' ')
    .split(' '),
);

const LEAD_FIELD_WEIGHT = 4;

type WeightedWords = Map<string, number>;

function tokenize(text: string) {
  return new Set(
    text
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .split(/[^\p{L}\p{N}+]+/u)
      .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
      .map((word) => word.slice(0, 5)),
  );
}

function stateFields(state: string | Record<string, unknown>) {
  return typeof state === 'string' ? [state] : Object.values(state).map(String);
}

function weighWords(fields: string[]): WeightedWords {
  const weights: WeightedWords = new Map();
  fields.forEach((field, index) => {
    const weight = index === 0 && fields.length > 1 ? LEAD_FIELD_WEIGHT : 1;
    for (const word of tokenize(field)) {
      weights.set(word, Math.max(weights.get(word) ?? 0, weight));
    }
  });
  return weights;
}

function overlap(state: WeightedWords, text: string) {
  let hits = 0;
  for (const word of tokenize(text)) hits += state.get(word) ?? 0;
  return hits;
}

function answer(question: JevQuestion, state: WeightedWords): JevAnswer {
  if (question.type === 'noul') {
    const yes = overlap(state, question.criteria?.true ?? question.instructions);
    const no = overlap(state, question.criteria?.false ?? '');
    return { type: 'noul', noul: 1 / (1 + Math.exp(-(yes - no * 1.2 - 1) * 0.9)) };
  }

  const keys =
    question.type === 'choice'
      ? Object.keys(question.criteria)
      : question.criteria.map((_, index) => String(index));
  const descriptions =
    question.type === 'choice' ? Object.values(question.criteria) : question.criteria;
  const logits = descriptions.map((description, index) =>
    description === null ? 0.6 : overlap(state, `${keys[index]} ${description}`) * 1.8,
  );
  return toRankedAnswer(question.type, keys, softmax(logits));
}

export const mockAdapter: JevAdapter = async ({ state, questions }) => {
  const fields = stateFields(state);
  const text = fields.join(' ');
  const words = weighWords(fields);
  const answers = Object.fromEntries(
    Object.entries(questions).map(([id, question]) => [id, answer(question, words)]),
  );

  return {
    provider: 'mock',
    model: 'mock-keyword-heuristic',
    calibrated: false,
    answers,
    inputTokens: estimateTokens(text + JSON.stringify(questions)),
  };
};
