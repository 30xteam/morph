import type { Profile, SegmentKey } from '../types/segmentation.types';

const ROLE_KEYS: Record<string, SegmentKey> = {
  'Fundador, socio o CEO': 'founder',
  'Director, VP o C-level (no dueño)': 'executive',
  'Líder comercial o de ventas': 'sales_leader',
  'Gerente o jefe de área': 'manager',
  'Perfil técnico (ingeniería, datos, producto)': 'technical',
};

export function roleKey(profile: Profile): SegmentKey {
  return ROLE_KEYS[profile.role] ?? 'unknown';
}
