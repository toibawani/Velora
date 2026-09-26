/**
 * Copying text, with the failure cases handled.
 *
 * navigator.clipboard does not exist at all on a plain http:// origin, and
 * that includes anything not served from localhost. The old code used `?.`
 * and then claimed success regardless, so the button said "Copied" on exactly
 * the deployments where nothing had been copied. A rejected write, which is
 * what a browser does when permission is denied, was the same.
 *
 * Returns a result rather than throwing, so callers can say what happened
 * instead of guessing.
 */

export const COPY_OK = 'ok';
export const COPY_UNSUPPORTED = 'unsupported';
export const COPY_DENIED = 'denied';

export const clipboardAvailable = () =>
  typeof navigator !== 'undefined' &&
  Boolean(navigator.clipboard && navigator.clipboard.writeText);

/**
 * @returns {Promise<'ok' | 'unsupported' | 'denied'>}
 */
export const copyText = async (text) => {
  if (!clipboardAvailable()) return COPY_UNSUPPORTED;

  try {
    await navigator.clipboard.writeText(text);
    return COPY_OK;
  } catch {
    // Permission denied, or a document that is not focused.
    return COPY_DENIED;
  }
};
