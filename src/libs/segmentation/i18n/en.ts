export const sharedEn = {
  nav: {
    segments: 'Segments',
    allProfiles: 'All profiles',
    workflow: 'Workflow',
    review: 'Review queue',
    metrics: 'Metrics',
    graph: 'Graph',
    label: 'Console',
  },
  programs: {
    ai_sales: 'AI Sales',
    inmersion_ejecutiva: 'Inmersión Ejecutiva',
    sales_machine: 'Sales Machine',
    hardcore_ai: 'Hardcore AI',
    achievers: 'Achievers',
    none: 'No program',
  },
  affinity: {
    low: 'Low affinity',
    medium: 'Medium affinity',
    high: 'High affinity',
    very_high: 'Very high affinity',
  },
  match: {
    low: 'Low match',
    medium: 'Medium match',
    high: 'High match',
    very_high: 'Very high match',
  },
  roles: {
    founder: 'Founder / CEO',
    executive: 'Executive',
    sales_leader: 'Sales leader',
    manager: 'Manager',
    technical: 'Technical profile',
    unknown: 'No data',
  },
  status: {
    green: 'Green',
    yellow: 'Yellow',
    red: 'Red',
    review: 'Review',
    pending: 'Not evaluated',
    deciding: 'Deciding',
  },
  lightMeanings: {
    green: { meaning: 'Strong potential client', action: 'Write to them soon' },
    yellow: { meaning: 'Possible client', action: 'Follow up' },
    red: { meaning: 'Unlikely', action: 'Passive contact for now' },
    review: {
      meaning: 'Needs a person',
      action: 'Jev is not sure: confirm it in the review queue',
    },
    pending: { meaning: 'Not through Jev yet', action: 'Decide it with Jev to give it a color' },
  },
  reasons: {
    lowConfidence: 'Low confidence',
    lowInfo: 'Missing fields',
  },
};

export type SharedMessages = typeof sharedEn;
