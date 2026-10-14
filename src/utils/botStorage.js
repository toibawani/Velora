/**
 * VELORA Conversation Bots Storage Adapter
 *
 * Saves and retrieves multi-turn dialogue histories scoped to the active profile.
 * Leverages secureUserStorage with RLS checking.
 */

import { secureUserStorage } from './security';
import { sanitizeText } from './sanitize';

const STORAGE_PREFIX = 'velora_dialogue';

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
    // Sanitize message content before persisting
    const cleaned = messages.slice(-50).map((msg) => ({
      sender: msg.sender === 'user' ? 'user' : 'bot',
      text: sanitizeText(msg.text || '', 3000),
      timestamp: msg.timestamp || new Date().toISOString(),
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
