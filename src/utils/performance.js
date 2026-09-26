import { safeGet, safeSet } from './storage';

const MAX_LOGGED_SLOW_OPERATIONS = 50;
const PERFORMANCE_KEY = 'velora_performance_log';

const recordSlowOperation = (name, duration, threshold) => {
  if (duration <= threshold) return;
  const current = safeGet(PERFORMANCE_KEY, []);
  current.push({ name, duration: Number(duration.toFixed(2)), timestamp: new Date().toISOString() });
  safeSet(PERFORMANCE_KEY, current.slice(-MAX_LOGGED_SLOW_OPERATIONS));
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
  try {
    const result = await fn();
    const duration = performance.now() - start;
    recordSlowOperation(name, duration, 200);
    if (duration > 200) console.warn(`[perf] Slow async operation: ${name} took ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    safeSet('velora_last_operation_error', { name, message: error.message, timestamp: new Date().toISOString() });
    throw error;
  }
};

export const getPerformanceLog = () => {
  return safeGet(PERFORMANCE_KEY, []);
};
