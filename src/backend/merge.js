/**
 * Merging progress between a device and the server.
 *
 * An event is { topic_id, kind, day } where day is 'YYYY-MM-DD'. That triple is
 * the whole identity of an event: reading the same lesson on the same day on a
 * phone and on a laptop is one fact, not two, so the key is the triple and the
 * union is a set union.
 *
 * Two properties matter more than speed here, because the input is someone's
 * progress:
 *   1. Nothing is lost. Merge is a union, never "whichever side is newer".
 *   2. Running it twice changes nothing. That is what makes a retry safe, and a
 *      retry is what happens every time a phone loses signal mid-sync.
 */

export const eventKey = (event) => `${event.topic_id}|${event.kind}|${event.day}`;

/** Only the three fields the server stores, so a local extra cannot be uploaded. */
const clean = (event) => ({
  topic_id: event.topic_id,
  kind: event.kind,
  day: event.day,
});

/** True only for a complete event, so a half-written row cannot break a sync. */
export const isEvent = (event) =>
  Boolean(event) &&
  typeof event.topic_id === 'string' &&
  event.topic_id.length > 0 &&
  typeof event.kind === 'string' &&
  event.kind.length > 0 &&
  typeof event.day === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(event.day);

export function dedupe(events) {
  const map = new Map();
  for (const event of events) {
    if (isEvent(event)) map.set(eventKey(event), clean(event));
  }
  return [...map.values()];
}

/** Union of local and remote. Never loses data, never duplicates. */
export function mergeEvents(local, remote) {
  return dedupe([...(remote || []), ...(local || [])]);
}

/**
 * What the server does not have yet. Empty after a successful sync, which is
 * why syncing twice sends nothing the second time.
 */
export function missingOnServer(local, remote) {
  const have = new Set((remote || []).filter(isEvent).map(eventKey));
  return dedupe(local).filter((event) => !have.has(eventKey(event)));
}
