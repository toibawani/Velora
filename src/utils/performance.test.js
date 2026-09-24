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

  test('measurePerformance works with side-effect functions', () => {
    const arr = [];
    measurePerformance('push_op', () => arr.push(1));
    expect(arr).toContain(1);
  });
});
