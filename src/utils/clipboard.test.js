import { copyText, clipboardAvailable, COPY_OK, COPY_UNSUPPORTED, COPY_DENIED } from './clipboard';

describe('copyText', () => {
  const original = navigator.clipboard;
  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', { value: original, configurable: true, writable: true });
  });

  const setClipboard = (value) => {
    Object.defineProperty(navigator, 'clipboard', { value, configurable: true, writable: true });
  };

  test('reports success when the write works', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    await expect(copyText('hello')).resolves.toBe(COPY_OK);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  // The case that made the button lie: no clipboard API at all, which is
  // every plain http:// deployment that is not localhost.
  test('reports unsupported rather than success when there is no clipboard API', async () => {
    setClipboard(undefined);
    await expect(copyText('hello')).resolves.toBe(COPY_UNSUPPORTED);
    expect(clipboardAvailable()).toBe(false);
  });

  test('reports denied when the browser rejects the write', async () => {
    setClipboard({ writeText: jest.fn().mockRejectedValue(new Error('denied')) });
    await expect(copyText('hello')).resolves.toBe(COPY_DENIED);
  });

  test('a clipboard object with no writeText counts as unsupported', async () => {
    setClipboard({});
    await expect(copyText('hello')).resolves.toBe(COPY_UNSUPPORTED);
  });
});
