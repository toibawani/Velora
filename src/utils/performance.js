export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  const duration = end - start;

  console.log(`[perf] ${name}: ${duration.toFixed(2)}ms`);

  if (duration > 100) {
    console.warn(`[perf] Slow operation: ${name} took ${duration.toFixed(2)}ms`);
  }

  return result;
};

export const measureAsync = async (name, fn) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;

  console.log(`[perf] ${name}: ${duration.toFixed(2)}ms`);

  if (duration > 200) {
    console.warn(`[perf] Slow async operation: ${name} took ${duration.toFixed(2)}ms`);
  }

  return result;
};
