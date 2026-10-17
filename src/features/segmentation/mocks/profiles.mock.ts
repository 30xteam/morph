import type { Profile, Signals } from '../types/segmentation.types';

type Seed = Omit<Profile, 'id' | 'alias' | 'signals'> & { signals?: Partial<Signals> };

export const NO_ACTIVITY: Signals = {
  eventsAttended: 0,
  emailsOpened: 0,
  emailsClicked: 0,
  programPageVisits: 0,
  roleChangedRecently: false,
  companyRaisedRound: false,
  daysSinceLastActivity: 0,
};

const SEEDS: Seed[] = [
  {
    role: 'Founder & CEO',
    company: 'Nubelia Logistics',
    industry: 'Logistics',
    companySize: '11-50',
    country: 'Colombia',
    event: 'AI for Founders Meetup',
    signupAnswer:
      'We closed our seed round and have budget to implement AI agents in operations this quarter. Want to train my team now.',
    signals: { eventsAttended: 3, emailsOpened: 5, emailsClicked: 3, programPageVisits: 4 },
  },
  {
    role: 'Head of Marketing',
    company: 'Verdemar Retail',
    industry: 'Retail',
    companySize: '1000+',
    country: 'Mexico',
    event: 'Generative AI for Marketing',
    signupAnswer:
      'Our corporate team uses some AI tools in a pilot. I lead a team of 12 and need to train them on content workflows this year.',
    signals: { eventsAttended: 1, emailsOpened: 3, emailsClicked: 1, programPageVisits: 2 },
  },
  {
    role: 'Computer Science Student',
    company: 'Universidad Andina',
    industry: 'Education',
    companySize: '1',
    country: 'Peru',
    event: 'Intro to AI Agents',
    signupAnswer:
      'I am a student and want to learn AI basics, take a course and find my first job as an intern.',
  },
  {
    role: 'Partner',
    company: 'Altura Ventures',
    industry: 'Venture capital',
    companySize: '2-10',
    country: 'Chile',
    event: 'AI for Founders Meetup',
    signupAnswer:
      'Investor looking for deal flow and to meet founders building AI startups. Networking with partners.',
    signals: { eventsAttended: 2, emailsOpened: 2 },
  },
  {
    role: 'Backend Engineer',
    company: 'Pagora Fintech',
    industry: 'Fintech',
    companySize: '201-1000',
    country: 'Argentina',
    event: 'Building with LLM APIs',
    signupAnswer:
      'Engineer shipping AI models in production. We have agents and automation integrated in core workflows. Curious about new tools.',
    signals: { emailsOpened: 1 },
  },
  {
    role: 'Co-founder',
    company: 'Huerta Labs',
    industry: 'Agritech',
    companySize: '1',
    country: 'Ecuador',
    event: 'AI for Founders Meetup',
    signupAnswer:
      'Side project idea, no product yet. Exploring and curious about how AI could help, want to understand the basics.',
  },
  {
    role: 'Operations Director',
    company: 'Clínica Sanar',
    industry: 'Healthcare',
    companySize: '201-1000',
    country: 'Venezuela',
    event: 'AI in Operations',
    signupAnswer:
      'I lead the operations area. We have no AI in use. Need to implement automation this year and have budget assigned.',
    signals: { eventsAttended: 2, emailsOpened: 4, emailsClicked: 2, programPageVisits: 3 },
  },
  {
    role: 'Product Designer',
    company: 'Lumo Studio',
    industry: 'Design agency',
    companySize: '2-10',
    country: 'Uruguay',
    event: 'Generative AI for Designers',
    signupAnswer: 'Designer using a few AI tools. Want to upskill and learn new design skills.',
    signals: { emailsOpened: 2, emailsClicked: 1 },
  },
  {
    role: 'CEO',
    company: 'Rutafy',
    industry: 'Mobility',
    companySize: '51-200',
    country: 'Colombia',
    event: 'Scaling with AI',
    signupAnswer:
      'Series A scale-up hiring fast. Some teams run AI pilots. Want to meet people and partners, maybe later talk about training.',
    signals: { eventsAttended: 1, emailsOpened: 2 },
  },
  {
    role: 'Community volunteer',
    company: 'Freelance',
    industry: 'Nonprofit',
    companySize: '1',
    country: 'Bolivia',
    event: 'Intro to AI Agents',
    signupAnswer: 'A friend told me about it.',
    signals: { daysSinceLastActivity: 45 },
  },
  {
    role: 'Data Analyst',
    company: 'Banco Austral',
    industry: 'Banking',
    companySize: '1000+',
    country: 'Peru',
    event: 'AI in Operations',
    signupAnswer:
      'Analyst at a large bank, some AI pilots in my team. Want a certification program to learn applied AI skills.',
    signals: { eventsAttended: 1, emailsOpened: 3, emailsClicked: 2, programPageVisits: 3 },
  },
  {
    role: 'Engineering Manager',
    company: 'Kobra Software',
    industry: 'Software',
    companySize: '51-200',
    country: 'Mexico',
    event: 'Building with LLM APIs',
    signupAnswer:
      'I lead a team of 8 engineers. AI agents are in production. Need to train my team on evaluation now, we have budget.',
    signals: { eventsAttended: 2, emailsOpened: 4, emailsClicked: 2, programPageVisits: 2 },
  },
  {
    role: 'Angel investor and founder',
    company: 'Semilla Club',
    industry: 'Investment',
    companySize: '2-10',
    country: 'Spain',
    event: 'Scaling with AI',
    signupAnswer: 'I invest in early stage startups and also run a small company. Networking.',
  },
  {
    role: 'Recent graduate',
    company: 'Bootcamp Norte',
    industry: 'Education',
    companySize: '11-50',
    country: 'Venezuela',
    event: 'Generative AI for Marketing',
    signupAnswer:
      'Just finished a bootcamp. Looking for a first job and want to learn marketing skills with AI.',
    signals: { eventsAttended: 1 },
  },
  {
    role: 'Founder',
    company: 'Tinta Media',
    industry: 'Media',
    companySize: '2-10',
    country: 'Argentina',
    event: 'Generative AI for Marketing',
    signupAnswer:
      'Early stage media startup with first customers. Using some AI tools for content. Curious, browsing options.',
    signals: { emailsOpened: 1 },
  },
  {
    role: 'Sales Manager',
    company: 'Ferrocon Industrial',
    industry: 'Manufacturing',
    companySize: '1000+',
    country: 'Chile',
    event: 'AI in Operations',
    signupAnswer:
      'Corporate manufacturer, no AI in use. I lead the sales team and want to understand basics before proposing a budget.',
    signals: { eventsAttended: 1, emailsOpened: 2 },
  },
];

export const PROFILES_MOCK: Profile[] = SEEDS.map((seed, index) => {
  const number = String(index + 1).padStart(3, '0');
  return Object.assign({}, seed, {
    id: `p-${number}`,
    alias: `Attendee #${number}`,
    signals: Object.assign({}, NO_ACTIVITY, seed.signals),
  });
});
