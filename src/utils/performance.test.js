import { measurePerformance, measureAsync } from './performance';

describe('Performance utilities', () => {
  test('measurePerformance returns the function result', () => {
    const result = measurePerformance('test_op', () => 42);
    expect(result).toBe(42);
  });

  test('measureAsync returns the async result', async () => {
    const result = await measureAsync('async_op', async () => 'hello');
    expect(result).toBe('hello');
  });

  test('records and rethrows async operation failures', async () => {
    localStorage.clear();
    await expect(measureAsync('failing_op', async () => { throw new Error('network unavailable'); })).rejects.toThrow('network unavailable');
    expect(JSON.parse(localStorage.getItem('velora_last_operation_error')).name).toBe('failing_op');
  });

  test('measurePerformance works with side-effect functions', () => {
    const arr = [];
    measurePerformance('push_op', () => arr.push(1));
    expect(arr).toContain(1);
  });
});
