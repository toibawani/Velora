/**
 * Text cleanup for anything a person typed.
 *
 * The important thing to be clear about: React escapes text when it renders
 * it, so `{userText}` in JSX cannot become markup. Nothing in this app renders
 * user text with dangerouslySetInnerHTML, and that is the real protection.
 *
 * This function is the layer underneath that, for the case where someone
 * eventually does pipe stored text into innerHTML, a share sheet, or an export.
 * It is deliberately NOT a tag stripper. The previous version deleted anything
 * between angle brackets, which meant a physics explanation containing
 * "if x < y then" or "5 < 10" came out mangled, and "a > b" survived only by
 * luck. Destroying what someone wrote is a worse bug than the one it guards
 * against.
 *
 * So: remove whole script and style blocks, drop null bytes and other control
 * characters that break rendering, and cap the length. Leave the punctuation
 * alone.
 */

// A whole <script>...</script> or <style>...</style>, contents included.
const SCRIPT_BLOCK = /<\s*(script|style|iframe|object|embed)\b[\s\S]*?<\s*\/\s*\1\s*>/gi;
// A dangerous tag that never got closed, which is what a truncated or
// hand-edited stored value looks like. Everything from the tag onwards goes.
const UNCLOSED_BLOCK = /<\s*(script|style|iframe|object|embed)\b[^>]*>[\s\S]*$/i;
// A lone opening or closing tag with nothing to pair it with.
const ORPHAN_TAG = /<\s*\/?\s*[a-z][^>\n]{0,120}>/gi;
// Control characters, keeping tab (\t) and newline (\n). Built from a string
// rather than written as a literal so the eslint no-control-regex rule does not
// fire on something that is deliberately matching control characters.
// eslint-disable-next-line no-control-regex -- matching control characters is the entire point of this pattern
const CONTROL_CHARS = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g');

export const MAX_TEXT_LENGTH = 2000;

export const sanitizeText = (input, maxLength = MAX_TEXT_LENGTH) => {
  if (typeof input !== 'string') return '';

  return input
    .replace(SCRIPT_BLOCK, '')
    .replace(UNCLOSED_BLOCK, '')
    .replace(ORPHAN_TAG, '')
    .replace(CONTROL_CHARS, '')
    .trim()
    .slice(0, maxLength);
};

/**
 * Walks an object and cleans every string it finds. Used before anything is
 * written to storage, so a corrupted or hand-edited value cannot carry a
 * payload into a later render.
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skipping __proto__ and constructor keeps a hostile key from reaching the
    // prototype chain through a plain object merge.
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    if (typeof value === 'string') {
      clean[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};
