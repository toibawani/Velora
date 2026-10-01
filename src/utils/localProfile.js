/**
 * The local profile.
 *
 * This app has no backend. It cannot verify an email, cannot store a password
 * safely, and cannot tell one person from another. The version it used to ship
 * asked for a phone number and a username it never read, then offered a "Log
 * out" for a session that had never existed. That is a trust problem, not a
 * polish item, so the identity model is now honest about what it is: a chosen
 * display name, held on this device, used only to greet you.
 *
 * Stored shape: { name: string, createdAt: string }
 */

import { KEYS, FAILURE, readValue, writeValue, removeValue } from './storage';

const STORAGE_KEY = KEYS.LOCAL_PROFILE;

const MAX_NAME_LENGTH = 40;

export const normalizeName = (value) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME_LENGTH);

export const isValidName = (value) => normalizeName(value).length >= 2;

export const getProfile = () => {
  const parsed = readValue(STORAGE_KEY, null);
  if (!parsed || typeof parsed !== 'object') return null;
  const name = normalizeName(parsed.name);
  if (!isValidName(name)) return null;
  return { name, createdAt: typeof parsed.createdAt === 'string' ? parsed.createdAt : null };
};

/**
 * Returns the stored profile, or null when storage refused the write. Callers
 * must report the null case: silently dropping the write would leave the user
 * believing their name was saved when it was not.
 */
export const saveProfile = (name) => {
  const clean = normalizeName(name);
  if (!isValidName(clean)) return null;
  const profile = { name: clean, createdAt: new Date().toISOString() };
  return writeValue(STORAGE_KEY, profile) === FAILURE.NONE ? profile : null;
};

export const clearProfile = () => removeValue(STORAGE_KEY);
