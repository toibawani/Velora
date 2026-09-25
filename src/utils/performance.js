const MAX_LOGGED_SLOW_OPERATIONS = 50;
const PERFORMANCE_KEY = 'velora_performance_log';

const recordSlowOperation = (name, duration, threshold) => {
  if (duration <= threshold) return;
  try {
    const current = JSON.parse(localStorage.getItem(PERFORMANCE_KEY) || '[]');
    current.push({ name, duration: Number(duration.toFixed(2)), timestamp: new Date().toISOString() });
    localStorage.setItem(PERFORMANCE_KEY, JSON.stringify(current.slice(-MAX_LOGGED_SLOW_OPERATIONS)));
  } catch {
    // Telemetry must never interrupt a learner.
  }
};

export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  recordSlowOperation(name, duration, 100);
  if (duration > 100) console.warn(`[perf] Slow operation: ${name} took ${duration.toFixed(2)}ms`);
  return result;
};

export const measureAsync = async (name, fn) => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  recordSlowOperation(name, duration, 200);
  if (duration > 200) console.warn(`[perf] Slow async operation: ${name} took ${duration.toFixed(2)}ms`);
  return result;
};

export const getPerformanceLog = () => {
  try { return JSON.parse(localStorage.getItem(PERFORMANCE_KEY) || '[]'); } catch { return []; }
};
