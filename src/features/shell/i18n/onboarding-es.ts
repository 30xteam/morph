import type { onboardingEn } from './onboarding-en';

export const onboardingEs: typeof onboardingEn = {
  label: 'Bienvenido a Morph',
  skip: 'Saltar',
  next: 'Siguiente',
  back: 'Atrás',
  start: 'Empezar',
  step: (current, total) => `${current} de ${total}`,
  signup: {
    title: 'Llega una inscripción',
    body: 'Luma envía cada invitado nuevo. Nombre y correo nunca llegan a Jev, solo categorías.',
    event: 'Nueva inscripción de Luma',
    country: 'Perú',
    hidden: 'Nombre y correo ocultos',
    toJev: 'Enviado a Jev',
  },
  decide: {
    title: 'Jev decide en milisegundos',
    body: 'Cinco preguntas tipadas en una sola llamada: programa, afinidad, rol e intención.',
    latency: '406 ms',
    questions: [
      { label: 'Programa', answer: 'AI Sales · 71 %' },
      { label: 'Afinidad', answer: 'Alta' },
      { label: 'Rol', answer: 'Líder comercial' },
      { label: 'Listo para comprar', answer: 'Sí · 82 %' },
      { label: 'Viene a aprender', answer: 'No · 31 %' },
    ],
  },
  lights: {
    title: 'Un semáforo por persona',
    body: 'Cada perfil recibe un color que te dice qué hacer después.',
  },
  review: {
    title: 'Tú decides lo dudoso',
    body: 'Cuando Jev no está seguro, una persona confirma. Cada corrección mejora la próxima calibración.',
    guess: 'Jev: Sales Machine 48 %. No basta para decidir solo.',
    confirmed: 'Confirmado',
  },
};
