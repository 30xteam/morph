import { NO_ACTIVITY } from '../config/signals';
import type { LumaEvent, LumaGuest } from '../types/luma.schema';
import type { Profile } from '../types/segmentation.types';

export const LUMA_QUESTIONS = {
  role: 'Rol',
  country: 'País',
  pain: '¿Cuál es tu principal dolor hoy?',
  goal: '¿Qué quieres lograr?',
  topics: 'Temas de interés',
} as const;

export function profileFromLuma(event: LumaEvent, guest: LumaGuest): Profile {
  const answers = new Map(
    guest.registration_answers.map(({ label, answer }) => [label, answer.trim()]),
  );
  const read = (label: string, fallback: string) => answers.get(label) || fallback;
  const topics = read(LUMA_QUESTIONS.topics, '')
    .split(',')
    .map((topic) => topic.trim())
    .filter(Boolean);

  return {
    id: `luma-${guest.api_id}`,
    alias: `Guest ${guest.api_id.slice(-4).toUpperCase()}`,
    source: 'luma',
    relation: 'lead',
    role: read(LUMA_QUESTIONS.role, 'Sin dato de rol'),
    country: read(LUMA_QUESTIONS.country, 'Sin dato'),
    pain: read(LUMA_QUESTIONS.pain, 'No declaró ningún dolor'),
    goal: read(LUMA_QUESTIONS.goal, 'Sin objetivo declarado'),
    topics,
    infoAvailable: topics.length ? 'Solo interés declarado' : 'Sin información',
    crm: { status: 'Nuevo registro en Luma', stage: event.name, program: 'Sin programa' },
    signals: NO_ACTIVITY,
  };
}

export function registrationAnswers(profile: Profile) {
  return [
    { label: LUMA_QUESTIONS.role, question_type: 'dropdown', answer: profile.role },
    { label: LUMA_QUESTIONS.country, question_type: 'text', answer: profile.country },
    { label: LUMA_QUESTIONS.pain, question_type: 'dropdown', answer: profile.pain },
    { label: LUMA_QUESTIONS.goal, question_type: 'dropdown', answer: profile.goal },
    {
      label: LUMA_QUESTIONS.topics,
      question_type: 'multi-select',
      answer: profile.topics.join(', '),
    },
  ];
}
