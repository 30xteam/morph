'use client';

import { createContext } from 'react';

import type { User } from '../types/auth.types';

export interface AuthContextValue {
  user: User | null;
  /** Updates the in-memory cache only — the cookie stays the source of truth. */
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
