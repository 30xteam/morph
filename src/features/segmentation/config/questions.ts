import type { JevQuestions } from '@/core/jev/jev.types';

export const SEGMENTATION_QUESTIONS = {
  segment: {
    type: 'choice',
    instructions: 'The role is not in the CRM. Infer it from `goal`, `pain` and `topics`.',
    criteria: {
      founder: 'Fundador, socio o CEO: founder, co-founder, owner or CEO who runs the company',
      executive: 'Director, VP o C-level (no dueño): director, vice president or C-level executive',
      sales_leader: 'Líder comercial o de ventas: head of sales, commercial leader, sales manager',
      manager: 'Gerente o jefe de área: manager or head of an area or department',
      technical: 'Perfil técnico: engineer, data, product, developer, technical profile',
      unknown: 'Sin dato de rol: no information about the role',
    },
  },
  program: {
    type: 'choice',
    instructions: 'Which 30X program fits this person best?',
    criteria: {
      ai_sales:
        'AI Sales: vender más con IA, automatizar con IA el proceso comercial; topics sales and ai together; sales leaders and founders',
      inmersion_ejecutiva:
        'Inmersión Ejecutiva: founders, CEOs and executives who want leadership, strategy, escalar, expandirse a otros países, levantar capital, red de pares; topics leadership, gtm, finance, hiring',
      sales_machine:
        'Sales Machine: construir una máquina de ventas, proceso comercial estructurado, vive de referidos, prospecta a mano, vender más; topics sales, ops, gtm; not centered on artificial intelligence',
      hardcore_ai:
        'Hardcore AI: technical builders who automate with AI and build products; topics ai and product; perfil técnico, ingeniería, datos',
      achievers:
        'Achievers: business owners with a declared pain (ventas estancadas, flujo de caja, equipo, modelo de negocio) who want to transform and grow; topics gtm, leadership, ops',
      none: 'No program fits yet: sin información, no declared need, only general curiosity about AI',
    },
  },
  affinity: {
    type: 'score',
    instructions: 'How well does this person fit the program you chose?',
    criteria: [
      'Low (0-3): sin información, sin temas declarados, generic curiosity, no clear goal',
      'Medium (4-6): solo interés declarado, lead sin oportunidad, partial match with the program',
      'High (7-8): perfil con contexto (dolor u objetivo), clear goal that matches the program topics, attended several events',
      'Very high (9-10): deal en el CRM, fundador, socio o CEO, perfil con contexto, keeps visiting the program page, changed role, new position, raised a round',
    ],
  },
  salesReady: {
    type: 'noul',
    instructions:
      'Is this person ready for a commercial conversation about a paid 30X program now?',
    criteria: {
      true: 'Deal en el CRM, en proceso, calificado, clear pain and goal, attended several events, keeps visiting the program page',
      false: 'Lead sin oportunidad, sin información, only curiosity, no declared need, inactive',
    },
  },
  decisionPower: {
    type: 'noul',
    instructions:
      'Can this person decide or approve buying a program for themselves or their team?',
    criteria: {
      true: 'Fundador, socio o CEO, director, VP, C-level, líder comercial or gerente with a team',
      false: 'Sin dato de rol, perfil técnico without a team, student, no information',
    },
  },
  wantsLearning: {
    type: 'noul',
    instructions:
      'Is this person mainly looking to learn or train (formarse) rather than to buy a solution?',
    criteria: {
      true: 'Formarse (sobre todo en IA), learn, course, training, skills',
      false: 'Vender más, levantar capital, expandirse, wants business results now',
    },
  },
} satisfies JevQuestions;
