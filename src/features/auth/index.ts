// Client-safe public API. Server-only `getSessionUser` is imported from '@/features/auth/server'.
export { AuthProvider } from './context/auth-provider';
export { useAuth } from './hooks/use-auth';
export type { Session, User } from './types/auth.types';
