import type { Locale } from '@/core/preferences';

type Translations = Record<string, string>;

const EN: Translations = {
  'Sin dato de rol': 'No role data',
  'Fundador, socio o CEO': 'Founder, partner or CEO',
  'Director, VP o C-level (no dueño)': 'Director, VP or C-level',
  'Líder comercial o de ventas': 'Sales leader',
  'Gerente o jefe de área': 'Manager or head of area',
  'Perfil técnico (ingeniería, datos, producto)': 'Technical (engineering, data, product)',
  'No declaró ningún dolor': 'No pain declared',
  'Procesos manuales y rezago tecnológico': 'Manual processes, outdated tech',
  'Falta de claridad estratégica para escalar': 'No clear strategy to scale',
  'No tiene proceso comercial estructurado': 'No structured sales process',
  'Vive de referidos y prospecta a mano': 'Lives on referrals, prospects by hand',
  'El dueño es el cuello de botella y no delega': 'The owner is the bottleneck',
  'Ventas estancadas o cayendo': 'Sales stalled or falling',
  'Capital y flujo de caja para crecer': 'Capital and cash flow to grow',
  'Expansión internacional sin método': 'International expansion without a method',
  'Equipo: contratar, retener y vencer la resistencia al cambio': 'Hiring, retention and change',
  'Automatizar con IA': 'Automate with AI',
  'Vender más': 'Sell more',
  'Formarse (sobre todo en IA)': 'Learn (mostly AI)',
  'Expandirse a otros países': 'Expand to other countries',
  'Construir una máquina de ventas': 'Build a sales machine',
  'Levantar capital': 'Raise capital',
  'Entrar a una red de pares': 'Join a peer network',
  'Desarrollar liderazgo y equipo': 'Grow leadership and team',
  'Delegar y pasar a un rol estratégico': 'Delegate, move to a strategic role',
  'Transformar el modelo de negocio': 'Transform the business model',
  'Sin etapa': 'No stage',
  Calificado: 'Qualified',
  'Cierre perdido': 'Closed lost',
  Contactado: 'Contacted',
  'En gestión': 'In progress',
  'Ganado Pagado Completo': 'Won, fully paid',
  'Ganado Pago Parcial': 'Won, partly paid',
  Perdido: 'Lost',
  Potencial: 'Potential',
  Registrado: 'Registered',
  'Sin programa': 'No program',
  Negociacion: 'Negotiation',
  sales: 'Sales',
  ai: 'AI',
  ops: 'Operations',
  gtm: 'Go to market',
  leadership: 'Leadership',
  marketing: 'Marketing',
  fundraising: 'Fundraising',
  finance: 'Finance',
  product: 'Product',
  pricing: 'Pricing',
  hiring: 'Hiring',
  negotiation: 'Negotiation',
  retention: 'Retention',
};

const ES: Translations = {
  Negociacion: 'Negociación',
  sales: 'Ventas',
  ai: 'IA',
  ops: 'Operaciones',
  gtm: 'Go to market',
  leadership: 'Liderazgo',
  marketing: 'Marketing',
  fundraising: 'Levantar capital',
  finance: 'Finanzas',
  product: 'Producto',
  pricing: 'Precios',
  hiring: 'Contratación',
  negotiation: 'Negociación',
  retention: 'Retención',
};

const COUNTRY_CODES: Record<string, string> = {
  Colombia: 'CO',
  'Estados Unidos': 'US',
  Venezuela: 'VE',
  España: 'ES',
  Argentina: 'AR',
  Perú: 'PE',
  México: 'MX',
  Chile: 'CL',
  Ecuador: 'EC',
  Bolivia: 'BO',
};

export function translateValue(value: string, locale: Locale) {
  return (locale === 'en' ? EN : ES)[value] ?? value;
}

export function countryCode(country: string) {
  return COUNTRY_CODES[country] ?? null;
}

export function countryName(country: string, locale: Locale) {
  const code = countryCode(country);
  if (!code) return null;
  return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? country;
}
