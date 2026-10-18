import type { JevQuestions } from '@/core/jev/jev.types';

import { SEGMENTATION_QUESTIONS } from './questions';

const SECOND_PHRASING = {
  segment: {
    type: 'choice',
    instructions: 'What is this person’s position in their organization?',
    criteria: {
      founder: 'Owns or runs the business: founder, partner, CEO',
      executive: 'Senior executive who is not the owner: director, VP, C-level',
      sales_leader: 'Leads the commercial or sales team',
      manager: 'Manages an area or department',
      technical: 'Hands-on technical profile: engineering, data or product',
      unknown: 'The role is not known',
    },
  },
  program: {
    type: 'choice',
    instructions: 'Which program should 30X offer this person?',
    criteria: {
      ai_sales: 'Wants to sell more using AI and automate the sales process',
      inmersion_ejecutiva:
        'Leader who wants strategy, leadership, international expansion, capital or a peer network',
      sales_machine: 'Needs a structured sales process instead of referrals and manual prospecting',
      hardcore_ai: 'Technical person who wants to build and automate with AI',
      achievers: 'Owner with a concrete business pain who wants to transform the company',
      none: 'Not enough information or need to recommend any program',
    },
  },
  affinity: {
    type: 'score',
    instructions: 'How strong is the match between this person and that program?',
    criteria: [
      'Weak or unknown',
      'Partial',
      'Clear',
      'Excellent, with pain, goal and decision power',
    ],
  },
  salesReady: {
    type: 'noul',
    instructions: 'Would a sales call with this person today be welcome and productive?',
    criteria: {
      true: 'Active opportunity, clear need and recent engagement',
      false: 'Cold lead, no stated need or no recent engagement',
    },
  },
  decisionPower: {
    type: 'noul',
    instructions: 'Does this person control the budget to buy the program?',
    criteria: {
      true: 'Owner, executive or team leader',
      false: 'Role unknown or individual contributor',
    },
  },
  wantsLearning: {
    type: 'noul',
    instructions: 'Is learning the main reason this person came to 30X?',
    criteria: {
      true: 'Wants to train, study or learn AI',
      false: 'Wants business results: sales, capital, expansion',
    },
  },
} satisfies JevQuestions;

const THIRD_PHRASING = {
  segment: {
    type: 'choice',
    instructions: 'Classify the person by role.',
    criteria: {
      founder: 'Founder or CEO',
      executive: 'Executive',
      sales_leader: 'Sales leader',
      manager: 'Manager',
      technical: 'Technical',
      unknown: 'Unknown',
    },
  },
  program: {
    type: 'choice',
    instructions: 'Pick the 30X program.',
    criteria: {
      ai_sales: 'AI Sales',
      inmersion_ejecutiva: 'Inmersión Ejecutiva',
      sales_machine: 'Sales Machine',
      hardcore_ai: 'Hardcore AI',
      achievers: 'Achievers',
      none: 'None',
    },
  },
  affinity: {
    type: 'score',
    instructions: 'Rate the fit.',
    criteria: ['0-3', '4-6', '7-8', '9-10'],
  },
  salesReady: { type: 'noul', instructions: 'Is this a qualified sales lead right now?' },
  decisionPower: { type: 'noul', instructions: 'Can this person sign off on the purchase?' },
  wantsLearning: { type: 'noul', instructions: 'Is the person mainly here to learn?' },
} satisfies JevQuestions;

export const QUESTION_VARIANTS: JevQuestions[] = [
  SEGMENTATION_QUESTIONS,
  SECOND_PHRASING,
  THIRD_PHRASING,
];
