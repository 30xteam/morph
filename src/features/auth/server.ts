// Server-only public API (kept apart so client bundles never pull in `next/headers`).
export { getSessionUser } from './services/auth.service';
