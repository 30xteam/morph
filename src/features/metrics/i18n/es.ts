import { sharedEs } from '@/libs/segmentation';

import type { Messages } from './en';

const percent = (p: number) => `${Math.round(p * 100)} %`;

export const es: Messages = {
  ...sharedEs,
  metrics: {
    title: 'Métricas',
    subtitle: (count) => `Medido en ${count} perfiles contra las etiquetas de los organizadores`,
    run: (count) => `Medir en ${count} perfiles`,
    running: 'Midiendo…',
    runningCount: (count) => `Midiendo ${count} perfiles…`,
    updating: 'Mostrando la medición anterior mientras llega la nueva.',
    comparedPrevious: 'Comparado con la medición anterior.',
    runAgain: (count) => `Medir de nuevo en ${count} perfiles`,
    emptyTitle: 'Aún no hay mediciones',
    emptyBody: (count) =>
      `Corre Jev en ${count} perfiles etiquetados por 30X para ver latencia, costo, acierto y cómo se comporta cada umbral.`,
    measuredWith: (provider, calibrated) =>
      `Proveedor: ${provider}${calibrated ? '' : ' · sin calibrar'}`,
    notRealJev: 'No es Jev real',
    chartLabel: (threshold, decided, accuracy) =>
      `Con el umbral actual ${threshold.toFixed(2)}, Jev decide solo el ${decided} con ${accuracy} de acierto.`,
    failed: 'La medición falló. Vuelve a intentarlo.',
    medianLatency: 'Latencia mediana',
    questions: (count) => `${count} preguntas en 1 llamada`,
    cost: 'Costo',
    perThousand: 'por cada 1.000 perfiles',
    accuracy: 'Acierto de programa',
    baseline: (p, program) => `línea base ${percent(p)} (siempre ${program})`,
    profiles: 'Perfiles',
    tested: (count) => `${count} probados con Jev`,
    pending: 'Pendiente',
    thresholdPending: (count) => `Pendiente: mide en ${count} perfiles para llenar esta tabla.`,
    thresholdTitle: 'Umbral: cuándo Jev decide solo',
    thresholdHint:
      'Confianza de programa necesaria para actuar sin una persona. Los perfiles sin información nunca actúan solos.',
    threshold: 'Umbral',
    decidesAlone: 'Decide solo',
    accuracyAlone: 'Acierto cuando decide solo',
    current: 'actual',
    honest: 'Lectura honesta',
    filterTitle: (aboveBaseline) =>
      aboveBaseline ? 'Jev es un primer filtro, no el juez' : 'Jev todavía no supera la línea base',
    filterBody: (accuracy, baseline) =>
      `${percent(accuracy)} de acierto en programa frente a una línea base de ${percent(baseline)}. Sirve para ordenar, no para actuar solo con todos.`,
    lowInfoTitle: 'Poca información es afinidad baja',
    lowInfoBody: (lowInfo, alsoLow) =>
      `${alsoLow} de ${lowInfo} perfiles sin información también tienen afinidad baja para 30X: la etiqueta refleja sobre todo cuántos datos hay.`,
    policyTitle: 'Política',
    policyBody: 'Poca información o poca confianza va a una persona. El resto es automático.',
  },
};
