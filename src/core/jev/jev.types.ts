export type JevProvider = 'mock' | 'typesafe' | 'openrouter';

export interface ChoiceQuestion {
  type: 'choice';
  instructions: string;
  criteria: Record<string, string | null>;
}

export interface ScoreQuestion {
  type: 'score';
  instructions: string;
  criteria: string[];
}

export interface NoulQuestion {
  type: 'noul';
  instructions: string;
  criteria?: { true: string; false: string };
}

export type JevQuestion = ChoiceQuestion | ScoreQuestion | NoulQuestion;

export type JevQuestions = Record<string, JevQuestion>;

export interface ChoiceAnswer {
  type: 'choice';
  choice: string;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface ScoreAnswer {
  type: 'score';
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
}

export interface NoulAnswer {
  type: 'noul';
  noul: number;
}

export type JevAnswer = ChoiceAnswer | ScoreAnswer | NoulAnswer;

export interface JevRequest {
  state: string | Record<string, unknown>;
  questions: JevQuestions;
}

export interface JevResult {
  provider: JevProvider;
  model: string;
  /** False when the answers come from an emulation (mock or a generative LLM), not from Jev itself. */
  calibrated: boolean;
  answers: Record<string, JevAnswer>;
  inputTokens: number;
  latencyMs: number;
}

export type JevAdapter = (request: JevRequest) => Promise<Omit<JevResult, 'latencyMs'>>;
