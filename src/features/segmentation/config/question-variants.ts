import type { JevQuestions } from '@/core/jev/jev.types';

import { SEGMENTATION_QUESTIONS } from './questions';

const SECOND_PHRASING = {
  segment: {
    type: 'choice',
    instructions: 'What is this person’s position in their organization?',
    criteria: {
      founder: 'Runs or owns the business: founder, co-founder, CEO, owner, managing partner',
      team_lead: 'Manages people inside a company: head of an area, director, manager, team lead',
      individual_contributor:
        'Hands-on professional without direct reports: engineer, analyst, designer, specialist, sales rep',
      student:
        'Still studying or starting a career: student, intern, bootcamp learner, new graduate',
      investor: 'Invests money in companies: angel, venture capital partner, fund associate',
      other: null,
    },
  },
  companyStage: {
    type: 'choice',
    instructions: 'How far along is this person’s company?',
    criteria: {
      idea: 'Only an idea or side project, no customers, one person',
      early_stage:
        'Young or small business with its first customers, fewer than 50 people, seed money',
      scale_up: 'Growing quickly with funding (series A or later), 50 to 200 people, hiring',
      corporate: 'Large and established organization, hundreds or thousands of employees',
      other: null,
    },
  },
  aiMaturity: {
    type: 'score',
    instructions: 'How much does this person’s company already use AI?',
    criteria: [
      'Not at all yet, does things by hand, just starting to look at AI',
      'A few tools or pilots used by some people',
      'AI runs in production as part of how the company works every day',
    ],
  },
  urgency: {
    type: 'score',
    instructions: 'When does this person need a solution?',
    criteria: [
      'No timeline, maybe someday, just curious',
      'Within the next months or next year, still comparing',
      'Right now or this quarter, with a deadline or approved budget',
    ],
  },
  salesReady: {
    type: 'noul',
    instructions: 'Would a sales call with this person today be welcome and productive?',
    criteria: {
      true: 'Approved budget, a concrete project and a deadline, asks for training for the team',
      false: 'No budget or project, only learning alone, networking or browsing',
    },
  },
  wantsLearning: {
    type: 'noul',
    instructions: 'Is learning or training the main reason this person signed up?',
    criteria: {
      true: 'Wants a course, a program, a certification or to train skills',
      false: 'Came to network, find deals, find clients or meet founders',
    },
  },
  decisionPower: {
    type: 'noul',
    instructions: 'Does this person control a budget to buy training for others?',
    criteria: {
      true: 'Owner, founder, executive or manager with a team and budget',
      false: 'Works without a team, studies, invests or sells to others',
    },
  },
  fitsOffer: {
    type: 'noul',
    instructions: 'Is this person a good match for AI events, programs and content?',
    criteria: {
      true: 'Wants to use, learn or adopt AI personally or with a team',
      false: 'Only wants to sell to attendees, or gave no real reason to attend',
    },
  },
} satisfies JevQuestions;

const THIRD_PHRASING = {
  segment: {
    type: 'choice',
    instructions: 'Classify the sign-up by role.',
    criteria: {
      founder: 'Top decision maker of the business (founder, CEO, owner)',
      team_lead: 'Middle management that leads a team or department',
      individual_contributor: 'Individual professional who does the work directly',
      student: 'Learner at the start of their career',
      investor: 'Capital provider looking at startups',
      other: null,
    },
  },
  companyStage: {
    type: 'choice',
    instructions: 'Classify the company by maturity.',
    criteria: {
      idea: 'Not a company yet',
      early_stage: 'Small company with its first clients',
      scale_up: 'Funded company growing fast',
      corporate: 'Large established company',
      other: null,
    },
  },
  aiMaturity: {
    type: 'score',
    instructions: 'Rate the company’s AI adoption.',
    criteria: ['None', 'Pilots', 'Production'],
  },
  urgency: {
    type: 'score',
    instructions: 'Rate how soon they need help.',
    criteria: ['Someday', 'This year', 'Now'],
  },
  salesReady: {
    type: 'noul',
    instructions: 'Is this a qualified sales lead right now?',
  },
  wantsLearning: {
    type: 'noul',
    instructions: 'Is the person mainly here to learn?',
  },
  decisionPower: {
    type: 'noul',
    instructions: 'Can this person sign off on a purchase?',
  },
  fitsOffer: {
    type: 'noul',
    instructions: 'Does this person want AI learning or AI adoption at work?',
  },
} satisfies JevQuestions;

export const QUESTION_VARIANTS: JevQuestions[] = [
  SEGMENTATION_QUESTIONS,
  SECOND_PHRASING,
  THIRD_PHRASING,
];
