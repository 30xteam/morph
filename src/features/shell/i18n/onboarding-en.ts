export const onboardingEn = {
  label: 'Welcome to Morph',
  skip: 'Skip',
  next: 'Next',
  back: 'Back',
  start: 'Start',
  step: (current: number, total: number) => `${current} of ${total}`,
  signup: {
    title: 'A sign-up arrives',
    body: 'Luma sends every new guest. Name and email never reach Jev, only categories.',
    event: 'New Luma sign-up',
    country: 'Peru',
    hidden: 'Name and email hidden',
    toJev: 'Sent to Jev',
  },
  decide: {
    title: 'Jev decides in milliseconds',
    body: 'Five typed questions in a single call: program, affinity, role and intent.',
    latency: '406 ms',
    questions: [
      { label: 'Program', answer: 'AI Sales · 71%' },
      { label: 'Affinity', answer: 'High' },
      { label: 'Role', answer: 'Sales leader' },
      { label: 'Ready to buy', answer: 'Yes · 82%' },
      { label: 'Here to learn', answer: 'No · 31%' },
    ],
  },
  lights: {
    title: 'A light for every person',
    body: 'Each profile gets a color that tells you what to do next.',
  },
  review: {
    title: 'You decide the doubtful ones',
    body: 'When Jev is not sure, a person confirms. Every correction improves the next calibration.',
    guess: 'Jev: Sales Machine 48%. Not enough to decide alone.',
    confirmed: 'Confirmed',
  },
};
