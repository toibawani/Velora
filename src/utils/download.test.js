import { backupFileName, downloadText } from './download';

describe('backupFileName', () => {
  test('dates the file so two exports are distinguishable', () => {
    expect(backupFileName(new Date('2026-10-28T23:30:00.000Z'))).toBe('velora-backup-2026-10-28.json');
  });

  test('falls back to today rather than writing an invalid date', () => {
    expect(backupFileName(new Date('nonsense'))).toMatch(/^velora-backup-\d{4}-\d{2}-\d{2}\.json$/);
  });
});

describe('downloadText', () => {
  const click = jest.spyOn(HTMLAnchorElement.prototype, 'click');

  beforeEach(() => click.mockClear());
  afterAll(() => click.mockRestore());

  test('reports that it could not download when the browser has no object URLs', () => {
    const original = URL.createObjectURL;
    // jsdom does not implement it at all, which is the case this covers.
    URL.createObjectURL = undefined;
    expect(downloadText('x.json', '{}')).toBe(false);
    URL.createObjectURL = original;
  });

  test('hands the file to an anchor and releases the object URL', () => {
    jest.useFakeTimers();
    const createObjectURL = jest.fn(() => 'blob:test');
    const revokeObjectURL = jest.fn();
    const originalCreate = URL.createObjectURL;
    const originalRevoke = URL.revokeObjectURL;
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    expect(downloadText('velora-backup.json', '{"a":1}')).toBe(true);
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalledTimes(1);
    expect(document.querySelector('a[download]')).toBeNull();

    jest.runAllTimers();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');

    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
    jest.useRealTimers();
  });

  test('returns false rather than throwing when the blob cannot be built', () => {
    const originalCreate = URL.createObjectURL;
    URL.createObjectURL = () => {
      throw new Error('nope');
    };
    expect(downloadText('x.json', '{}')).toBe(false);
    URL.createObjectURL = originalCreate;
  });
});
