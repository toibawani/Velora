/**
 * VELORA utility module
 * download
 *
 * Handing a string to the browser as a file.
 *
 * There is no server to serve a download, so the file is built in the page as a
 * Blob, given a temporary object URL, clicked through an anchor the browser
 * never sees, and revoked. The revoke matters: an object URL holds the data in
 * memory until it is released, and without it a second export of the same data
 * leaves the first one resident.
 */

/** A dated filename, e.g. `velora-backup-2026-10-28.json`. */
export const backupFileName = (now = new Date()) => {
  const date = now instanceof Date && !Number.isNaN(now.getTime()) ? now : new Date();
  const stamp = date.toISOString().slice(0, 10);
  return `velora-backup-${stamp}.json`;
};

/**
 * Downloads `text` as `fileName`.
 *
 * Returns true when the click was dispatched. It cannot know whether the
 * browser kept the file - no API reports that - so callers word their
 * confirmation as "the file was prepared", not "it is saved".
 */
export function downloadText(fileName, text, mimeType = 'application/json') {
  if (typeof document === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) {
    return false;
  }

  let url;
  try {
    url = URL.createObjectURL(new Blob([text], { type: mimeType }));
  } catch {
    return false;
  }

  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return true;
  } catch {
    return false;
  } finally {
    // A tick later, so the click has started before the URL goes away.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
