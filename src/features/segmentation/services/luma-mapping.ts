import { NO_ACTIVITY } from '../mocks/profiles.mock';
import type { LumaRegistration } from '../types/luma.schema';
import { COMPANY_SIZES } from '../types/profile.schema';
import type { Profile } from '../types/segmentation.types';

export const LUMA_QUESTIONS = {
  role: 'Role',
  company: 'Company',
  industry: 'Industry',
  companySize: 'Company size',
  country: 'Country',
  goal: 'What do you want from this event?',
} as const;

function sizeOf(answer: string | undefined): Profile['companySize'] {
  return COMPANY_SIZES.find((size) => size === answer) ?? '2-10';
}

export function profileFromLuma(registration: LumaRegistration): Profile {
  const answers = new Map(
    registration.guest.registration_answers.map(({ label, answer }) => [label, answer.trim()]),
  );
  const read = (label: string, fallback: string) => answers.get(label) || fallback;
  const suffix = registration.guest.api_id.slice(-4).toUpperCase();

  return {
    id: `luma-${registration.guest.api_id}`,
    alias: `Sign-up #${suffix}`,
    role: read(LUMA_QUESTIONS.role, 'Unknown role'),
    company: read(LUMA_QUESTIONS.company, 'Unknown company'),
    industry: read(LUMA_QUESTIONS.industry, 'Unknown'),
    companySize: sizeOf(answers.get(LUMA_QUESTIONS.companySize)),
    country: read(LUMA_QUESTIONS.country, 'Unknown'),
    event: registration.event.name,
    signupAnswer: read(LUMA_QUESTIONS.goal, 'No answer given'),
    signals: NO_ACTIVITY,
  };
}

export function lumaFromProfile(profile: Profile, guestId: string): LumaRegistration {
  return {
    event: { name: profile.event },
    guest: {
      api_id: guestId,
      registration_answers: [
        { label: LUMA_QUESTIONS.role, answer: profile.role },
        { label: LUMA_QUESTIONS.company, answer: profile.company },
        { label: LUMA_QUESTIONS.industry, answer: profile.industry },
        { label: LUMA_QUESTIONS.companySize, answer: profile.companySize },
        { label: LUMA_QUESTIONS.country, answer: profile.country },
        { label: LUMA_QUESTIONS.goal, answer: profile.signupAnswer },
      ],
    },
  };
}
