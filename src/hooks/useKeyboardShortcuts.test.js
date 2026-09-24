import { renderHook, act } from '@testing-library/react';
import useKeyboardShortcuts from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  test('invokes escape handler when Escape key is pressed', () => {
    const onEscape = jest.fn();
    renderHook(() => useKeyboardShortcuts({ escape: onEscape }));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  test('invokes cmd+k handler when Meta+k is pressed', () => {
    const onCmdK = jest.fn();
    renderHook(() => useKeyboardShortcuts({ 'cmd+k': onCmdK }));

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true })
      );
    });

    expect(onCmdK).toHaveBeenCalledTimes(1);
  });

  test('removes event listener on unmount', () => {
    const onEscape = jest.fn();
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({ escape: onEscape })
    );

    unmount();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(onEscape).not.toHaveBeenCalled();
  });
});
