import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K = open search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        shortcuts['cmd+k']?.();
      }

      // Cmd/Ctrl + / = open help
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        shortcuts['cmd+/']?.();
      }

      // Escape = close modals
      if (e.key === 'Escape') {
        shortcuts['escape']?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export default useKeyboardShortcuts;
