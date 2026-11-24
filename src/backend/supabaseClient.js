import { createClient } from '@supabase/supabase-js';

/**
 * The only place a Supabase client is created.
 *
 * The two values are the project URL and the publishable ("anon") key. Both are
 * public by design and both are baked into the bundle at build time by Create
 * React App, which is why they are read from REACT_APP_* and not from a secret
 * store. The key can read what Row Level Security allows an anonymous visitor to
 * read and nothing else; see docs/SECURITY.md for what that means and what it
 * does not.
 *
 * When either value is missing the app is exactly what it was before accounts
 * existed: no client, no network calls, everything in localStorage. That is not
 * a degraded mode, it is the default build, and every caller checks
 * `backendEnabled` before offering an account control.
 */
const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const backendEnabled = Boolean(url && key);

export const supabase = backendEnabled
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
