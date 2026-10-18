import type { SharedMessages } from './en';

export const sharedEs: SharedMessages = {
  nav: {
    segments: 'Segmentos',
    allProfiles: 'Todos los perfiles',
    workflow: 'Flujo de trabajo',
    review: 'Cola de revisión',
    metrics: 'Métricas',
    graph: 'Grafo',
    label: 'Consola',
  },
  programs: {
    ai_sales: 'AI Sales',
    inmersion_ejecutiva: 'Inmersión Ejecutiva',
    sales_machine: 'Sales Machine',
    hardcore_ai: 'Hardcore AI',
    achievers: 'Achievers',
    none: 'Sin programa',
  },
  affinity: {
    low: 'Afinidad baja',
    medium: 'Afinidad media',
    high: 'Afinidad alta',
    very_high: 'Afinidad muy alta',
  },
  match: {
    low: 'Coincidencia baja',
    medium: 'Coincidencia media',
    high: 'Coincidencia alta',
    very_high: 'Coincidencia muy alta',
  },
  roles: {
    founder: 'Fundador / CEO',
    executive: 'Directivo',
    sales_leader: 'Líder comercial',
    manager: 'Gerente',
    technical: 'Perfil técnico',
    unknown: 'Sin dato',
  },
  status: {
    green: 'Verde',
    yellow: 'Amarillo',
    red: 'Rojo',
    review: 'Revisión',
    pending: 'Sin evaluar',
    deciding: 'Decidiendo',
  },
  lightMeanings: {
    green: { meaning: 'Cliente potencial fuerte', action: 'Escríbele pronto' },
    yellow: { meaning: 'Posible cliente', action: 'Dale seguimiento' },
    red: { meaning: 'Poco probable', action: 'Contacto pasivo por ahora' },
    review: {
      meaning: 'Necesita una persona',
      action: 'Jev no está seguro: confírmalo en la cola de revisión',
    },
    pending: {
      meaning: 'Todavía no pasa por Jev',
      action: 'Decídelo con Jev para darle un color',
    },
  },
  reasons: {
    lowConfidence: 'Poca confianza',
    lowInfo: 'Faltan campos',
  },
};
