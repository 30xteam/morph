import type { JevQuestions } from '@/core/jev/jev.types';

export const SEGMENTATION_QUESTIONS = {
  segment: {
    type: 'choice',
    instructions: 'Which segment best describes this person, based on `role` and `signupAnswer`?',
    criteria: {
      founder: 'Founder, co-founder, CEO, owner or managing director who runs the company',
      team_lead: 'Manager, head, director or team lead who leads a team or area inside a company',
      individual_contributor:
        'Individual contributor: engineer, designer, analyst, marketer or specialist without a team',
      student: 'Student, intern, bootcamp learner or recent graduate looking for a first job',
      investor: 'Investor, venture capital partner, angel or fund manager',
      other: null,
    },
  },
  companyStage: {
    type: 'choice',
    instructions: 'What stage is the company in `company` at, given `companySize` and context?',
    criteria: {
      idea: 'Idea or side project, no product or revenue yet, solo founder, freelance',
      early_stage:
        'Early stage startup or small agency with first customers, pre-seed or seed, small team of 2-10 or 11-50',
      scale_up:
        'Scale-up growing fast after product market fit, raised a round, series A or later, hiring, 51-200 people',
      corporate:
        'Established corporate, enterprise, bank or large company with 201-1000 or 1000+ employees',
      other: null,
    },
  },
  aiMaturity: {
    type: 'score',
    instructions: 'How mature is AI adoption in this person’s company?',
    criteria: [
      'Low: exploring, curious, no AI in use, wants to start or understand basics',
      'Medium: some AI tools or pilots in use by a few people or teams',
      'High: AI agents, models or automation in production, integrated in core workflows',
    ],
  },
  salesReady: {
    type: 'noul',
    instructions: 'Is this person ready for a commercial conversation about a paid program now?',
    criteria: {
      true: 'Has budget, a concrete need, a deadline, wants to implement or train their team now, attended several events, keeps visiting the program page',
      false: 'Only curious, browsing, networking, learning alone, student, no budget, inactive',
    },
  },
  wantsLearning: {
    type: 'noul',
    instructions: 'Is this person mainly looking to learn or train skills rather than to network?',
    criteria: {
      true: 'Wants to learn, course, program, training, upskill, skills, certification, bootcamp',
      false: 'Wants networking, meet people, investors, deal flow, partners',
    },
  },
  decisionPower: {
    type: 'noul',
    instructions: 'Can this person decide or approve a purchase for their team or company?',
    criteria: {
      true: 'Founder, CEO, owner, director, head, manager who leads a team and has budget',
      false: 'Student, intern, graduate, engineer, designer, analyst or specialist without a team',
    },
  },
  urgency: {
    type: 'score',
    instructions: 'How urgent is this person’s need?',
    criteria: [
      'Low: curious, exploring, someday, no timeline, browsing',
      'Medium: planning this year, comparing options, some interest',
      'High: now, this quarter, deadline, budget assigned, raised a round, changed role, new position',
    ],
  },
  fitsOffer: {
    type: 'noul',
    instructions:
      'Does this person fit what 30X offers: AI events, programs and content for professionals and teams?',
    criteria: {
      true: 'Wants to learn or apply AI, implement automation or AI agents, train a team, adopt AI at work, attended several events, keeps visiting the program page',
      false: 'Unrelated need, friend told me, no interest in AI, only selling something',
    },
  },
} satisfies JevQuestions;
