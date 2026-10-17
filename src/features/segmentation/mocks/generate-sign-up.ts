import type { Profile } from '../types/segmentation.types';
import { NO_ACTIVITY } from './profiles.mock';

type Archetype = Pick<Profile, 'role' | 'companySize' | 'signupAnswer'>;

const ARCHETYPES: Archetype[] = [
  {
    role: 'Founder & CEO',
    companySize: '11-50',
    signupAnswer: 'We have budget to implement AI this quarter and need to train my team now.',
  },
  {
    role: 'Head of Operations',
    companySize: '201-1000',
    signupAnswer: 'I lead a team and we are planning AI automation this year. Comparing options.',
  },
  {
    role: 'Marketing Specialist',
    companySize: '51-200',
    signupAnswer: 'I use some AI tools and want to upskill with a course on content workflows.',
  },
  {
    role: 'Engineering Student',
    companySize: '1',
    signupAnswer:
      'Student curious about AI agents, want to learn the basics and find an internship.',
  },
  {
    role: 'Angel investor',
    companySize: '2-10',
    signupAnswer: 'Looking to meet founders building AI startups. Networking and deal flow.',
  },
  {
    role: 'Software Engineer',
    companySize: '201-1000',
    signupAnswer: 'We have AI agents in production. Want to learn evaluation and new tools.',
  },
  {
    role: 'Owner',
    companySize: '2-10',
    signupAnswer: 'Small business, no AI in use yet. Exploring how it could help someday.',
  },
];

const COMPANIES = [
  'Andes Foods',
  'Vela Health',
  'Kora Pay',
  'Lumen Retail',
  'Pampa Logistics',
  'Brisa Media',
];
const INDUSTRIES = ['Food', 'Healthcare', 'Fintech', 'Retail', 'Logistics', 'Media'];
const COUNTRIES = ['Colombia', 'Mexico', 'Peru', 'Chile', 'Argentina', 'Venezuela'];
const EVENTS = ['AI for Founders Meetup', 'AI in Operations', 'Building with LLM APIs'];

function pick<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length] as T;
}

/** Builds a synthetic sign-up; `seed` keeps the demo reproducible. */
export function generateSignUp(seed: number): Omit<Profile, 'id' | 'alias'> {
  const archetype = pick(ARCHETYPES, seed);
  const index = pick([0, 1, 2, 3, 4, 5], seed * 7 + 3);
  return {
    ...archetype,
    company: pick(COMPANIES, index),
    industry: pick(INDUSTRIES, index),
    country: pick(COUNTRIES, seed * 5 + 1),
    event: pick(EVENTS, seed),
    signals: NO_ACTIVITY,
  };
}
