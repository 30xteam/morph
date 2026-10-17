'use client';

import { useMemo, useState, type ReactNode } from 'react';

import type { User } from '../types/auth.types';
import { AuthContext } from './auth-context';

interface AuthProviderProps {
  /** Resolved on the server with `getSessionUser()` (inside <Suspense> under Cache Components). */
  initialUser: User | null;
  children: ReactNode;
}

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const [user, setUser] = useState(initialUser);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AuthContext value={value}>{children}</AuthContext>;
}
