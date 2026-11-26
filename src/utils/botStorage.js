/**
 * VELORA Conversation Bots Storage Adapter
 *
 * Saves and retrieves multi-turn dialogue histories scoped to the active profile.
 * Leverages secureUserStorage with RLS checking.
 */

import { secureUserStorage } from './security';
import { sanitizeText } from './sanitize';
import { KEYS } from './storage';

const STORAGE_PREFIX = KEYS.DIALOGUE_PREFIX;

/**
 * Returns the conversation transcript for a specific figure.
 */
export const getBotConversation = (figureId, authUid = 'local_scholar') => {
  if (!figureId) return [];
  try {
    const key = `${STORAGE_PREFIX}_${figureId}`;
    const data = secureUserStorage.getItem(key, authUid);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

/**
 * Appends or saves the conversation transcript for a specific figure.
 */
export const saveBotConversation = (figureId, messages, authUid = 'local_scholar') => {
  if (!figureId || !Array.isArray(messages)) return false;
  try {
    const key = `${STORAGE_PREFIX}_${figureId}`;
    // Sanitize message content before persisting. The provenance fields are
    // kept: a reply's position, citation and mode are what make it checkable
    // after a reload, and dropping them turned a sourced answer into an
    // unattributed paragraph the next time the screen opened.
    const cleaned = messages.slice(-50).map((msg) => ({
      sender: msg.sender === 'user' ? 'user' : 'bot',
      text: sanitizeText(msg.text || '', 6000),
      timestamp: msg.timestamp || new Date().toISOString(),
      positionId: msg.positionId || null,
      positionTitle: sanitizeText(msg.positionTitle || '', 200),
      note: sanitizeText(msg.note || '', 400),
      mode: msg.mode || null,
      matched: typeof msg.matched === 'boolean' ? msg.matched : undefined,
      citation: msg.citation && msg.citation.url
        ? { label: sanitizeText(msg.citation.label || '', 300), url: msg.citation.url }
        : null,
    }));
    return secureUserStorage.setItem(key, cleaned, authUid);
  } catch {
    return false;
  }
};

/**
 * Clears the conversation history for a specific figure.
 */
export const clearBotConversation = (figureId, authUid = 'local_scholar') => {
  if (!figureId) return false;
  try {
    const key = `${STORAGE_PREFIX}_${figureId}`;
    return secureUserStorage.removeItem(key, authUid);
  } catch {
    return false;
  }
};
