import 'server-only';
import { jevEnv } from '../jev-env';
import { clampProbability, normalize, toRankedAnswer } from '../jev-math';
import type { JevAdapter, JevAnswer, JevQuestion } from '../jev.types';

const SYSTEM_PROMPT = `You emulate a typed decision model. You receive a STATE and QUESTIONS.
Reply with one JSON object: {"answers": {<question id>: <answer>}} and nothing else.
- choice: {"probabilities": {<option>: number}} over every listed option, summing to 1.
- score: {"probabilities": {"0": number, "1": number, ...}} over every level index, summing to 1.
- noul: {"noul": number} = probability the statement is true.`;

interface ChatCompletion {
  model: string;
  choices: { message: { content: string } }[];
  usage?: { prompt_tokens?: number };
}

interface RawAnswer {
  probabilities?: Record<string, number>;
  noul?: number;
}

function toAnswer(question: JevQuestion, raw: RawAnswer | undefined): JevAnswer {
  if (question.type === 'noul') return { type: 'noul', noul: clampProbability(raw?.noul ?? 0.5) };

  const keys =
    question.type === 'choice'
      ? Object.keys(question.criteria)
      : question.criteria.map((_, index) => String(index));
  const probabilities = normalize(keys.map((key) => raw?.probabilities?.[key] ?? 0));
  return toRankedAnswer(question.type, keys, probabilities);
}

function parseAnswers(content: string) {
  const json = content.slice(content.indexOf('{'), content.lastIndexOf('}') + 1);
  const parsed = JSON.parse(json || '{}') as { answers?: Record<string, RawAnswer> };
  return parsed.answers ?? {};
}

export const openrouterAdapter: JevAdapter = async ({ state, questions }) => {
  if (!jevEnv.OPENROUTER_API_KEY) throw new Error('OPENROUTER_API_KEY is not set');

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jevEnv.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: jevEnv.OPENROUTER_MODEL,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify({ state, questions }) },
      ],
    }),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as ChatCompletion;
  const raw = parseAnswers(data.choices[0]?.message.content ?? '{}');

  const answers = Object.fromEntries(
    Object.entries(questions).map(([id, question]) => [id, toAnswer(question, raw[id])]),
  );

  return {
    provider: 'openrouter',
    model: data.model,
    calibrated: false,
    answers,
    inputTokens: data.usage?.prompt_tokens ?? 0,
  };
};
