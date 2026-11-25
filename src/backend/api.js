import { supabase, backendEnabled } from './supabaseClient';
import { BackendError, mapError } from './errors';
import {
  validateEmail,
  validateDisplayName,
  validateExplanation,
  validateTopicId,
  validateReason,
} from './validate';

/**
 * Every call VELORA makes to the server, in one file.
 *
 * The rules for this module:
 *  - No component talks to `supabase` directly. A screen that imports the client
 *    can forget a validation, and the failure then arrives as a PostgREST string
 *    in a toast.
 *  - Every call throws a BackendError, never a raw provider object, so a screen
 *    shows `error.message` and nothing else.
 *  - Nothing here runs when `backendEnabled` is false. The throw is a programming
 *    error, not a user-facing state: the UI is supposed to hide the account
 *    controls entirely in that build.
 *  - No call asks for or uses a service-role key. The session token of the
 *    signed-in person is the only authority, and Row Level Security decides what
 *    it can reach.
 */

function requireBackend() {
  if (!backendEnabled) {
    throw new BackendError('disabled', 'Accounts are not available in this build.');
  }
}

async function currentUserId() {
  const { data } = await supabase.auth.getSession();
  const id = data && data.session && data.session.user && data.session.user.id;
  if (!id) throw new BackendError('session', 'Sign in first.');
  return id;
}

/** The URL a magic link returns to: the app root, under the Pages subpath. */
const redirectTo = () => `${window.location.origin}${process.env.PUBLIC_URL || ''}/`;

export async function sendMagicLink(email) {
  requireBackend();
  if (!validateEmail(email)) {
    throw new BackendError('invalid', 'That email address does not look right.');
  }
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: { emailRedirectTo: redirectTo(), shouldCreateUser: true },
  });
  if (error) throw mapError(error);
}

export async function signOut() {
  requireBackend();
  const { error } = await supabase.auth.signOut();
  if (error) throw mapError(error);
}

export async function getSessionUser() {
  if (!backendEnabled) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return (data && data.session && data.session.user) || null;
  } catch {
    return null;
  }
}

/** Returns an unsubscribe function, or a no-op when there is no backend. */
export function onAuthChange(callback) {
  if (!backendEnabled) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) =>
    callback((session && session.user) || null),
  );
  return () => data.subscription.unsubscribe();
}

export async function saveDisplayName(name) {
  requireBackend();
  if (!validateDisplayName(name)) {
    throw new BackendError('invalid', 'Names need 2 to 30 characters.');
  }
  const id = await currentUserId();
  const { error } = await supabase
    .from('profiles')
    .upsert({ id, display_name: name.trim() }, { onConflict: 'id' });
  if (error) throw mapError(error);
}

export async function fetchProgress() {
  requireBackend();
  const { data, error } = await supabase
    .from('progress_events')
    .select('topic_id, kind, day')
    .limit(5000);
  if (error) throw mapError(error);
  return data || [];
}

/**
 * Writes the events the server does not have.
 *
 * Batched because a first sync can be a few hundred rows and PostgREST takes the
 * batch as one request. `ignoreDuplicates` makes the write idempotent, so a
 * retry after a timeout cannot fail on the rows that did land.
 */
export async function pushProgress(events) {
  requireBackend();
  if (!events.length) return 0;
  const user_id = await currentUserId();
  const rows = events
    .filter((event) => validateTopicId(event.topic_id))
    .map((event) => ({
      user_id,
      topic_id: event.topic_id,
      kind: event.kind,
      day: event.day,
    }));

  for (let index = 0; index < rows.length; index += 200) {
    const { error } = await supabase.from('progress_events').upsert(
      rows.slice(index, index + 200),
      { onConflict: 'user_id,topic_id,kind,day', ignoreDuplicates: true },
    );
    if (error) throw mapError(error);
  }
  return rows.length;
}

export async function submitExplanation(topicId, body) {
  requireBackend();
  if (!validateTopicId(topicId)) throw new BackendError('invalid', 'Unknown topic.');
  if (!validateExplanation(body)) {
    throw new BackendError(
      'invalid',
      'Explanations need 20 to 600 characters so they can be reviewed.',
    );
  }
  const user_id = await currentUserId();
  const { error } = await supabase
    .from('explanations')
    .insert({ user_id, topic_id: topicId, body: body.trim() });
  if (error) throw mapError(error);
}

export async function fetchApprovedExplanations(topicId) {
  requireBackend();
  if (!validateTopicId(topicId)) return [];
  const { data, error } = await supabase
    .from('explanations')
    .select('id, body, created_at')
    .eq('topic_id', topicId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw mapError(error);
  return data || [];
}

export async function reportExplanation(explanationId, reason) {
  requireBackend();
  if (!validateReason(reason)) {
    throw new BackendError('invalid', 'Give a short reason, 3 to 300 characters.');
  }
  const reporter_id = await currentUserId();
  const { error } = await supabase
    .from('reports')
    .insert({ explanation_id: explanationId, reporter_id, reason: reason.trim() });
  if (error) throw mapError(error);
}

export async function countApprovedExplanations() {
  requireBackend();
  const { count, error } = await supabase
    .from('explanations')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'approved');
  if (error) throw mapError(error);
  return count || 0;
}
