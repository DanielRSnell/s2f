import { useEffect, useCallback } from 'react';

type KeyboardShortcutHandler = () => void;

interface UseKeyboardShortcutOptions {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export const useKeyboardShortcut = (
  options: UseKeyboardShortcutOptions,
  handler: KeyboardShortcutHandler
) => {
  const { key, metaKey = false, ctrlKey = false, shiftKey = false, altKey = false } = options;

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        event.metaKey === metaKey &&
        event.ctrlKey === ctrlKey &&
        event.shiftKey === shiftKey &&
        event.altKey === altKey
      ) {
        event.preventDefault();
        handler();
      }
    },
    [key, metaKey, ctrlKey, shiftKey, altKey, handler]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
};