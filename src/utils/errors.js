const PRIVATE_DETAIL_KEYS = /^(email|password|token|secret|authorization)$/i;
const redactDetails = (details) => {
  if (!details || typeof details !== 'object') return {};
  return Object.fromEntries(Object.entries(details).filter(([key]) => !PRIVATE_DETAIL_KEYS.test(key)).map(([key, value]) => [key, ['string', 'number', 'boolean'].includes(typeof value) ? value : '[omitted]']));
};

export class VeloraError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
    this.userMessage = getVeloraErrorMessage(code);
  }
}

export const getVeloraErrorMessage = (code) => {
  const messages = {
    NETWORK_ERROR: 'Connection lost. Check your internet.',
    AUTH_FAILED: 'Login failed. Check email and password.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    DATA_NOT_FOUND: 'This content is no longer available.',
    RATE_LIMITED: 'Too many requests. Wait a moment and try again.',
    UNKNOWN: 'Something went wrong. Try again or refresh.',
  };

  return messages[code] || messages.UNKNOWN;
};

export const logError = (error) => {
  console.error({
    message: error.message,
    code: error.code,
    details: redactDetails(error.details),
    timestamp: new Date().toISOString(),
  });
};
