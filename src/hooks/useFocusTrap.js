/**
 * Custom React hook
 * useFocusTrap
 */
import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab and Shift+Tab inside a dialog while it is open, and returns focus to
 * the element that opened it on close.
 *
 * Every overlay in this app declared aria-modal="true" and none of them actually
 * trapped focus: tabbing from the command palette walked straight out into the
 * page behind it, so a keyboard user could operate controls they could not see.
 * That is not a theoretical defect, it is what the failing a11y tests measured.
 */
export const useFocusTrap = (isOpen, containerRef, { onClose } = {}) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const previouslyFocused = document.activeElement;
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    // Wrapping Tab only helps once focus is inside. Without this, opening the
    // dialog left focus on the page behind it, so the first Tab landed on a
    // control the user could not see -- measured, not assumed: the add-concept
    // dialog parked focus on the "Graph" mode button behind the overlay.
    const firstItem = container.querySelector(FOCUSABLE);
    if (firstItem) firstItem.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, containerRef, onClose]);
};

export default useFocusTrap;
