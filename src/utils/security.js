/**
 * VELORA Security & Data Access Layer
 *
 * Implements:
 * 1. Row Level Security (RLS) enforcement ensuring records are scoped to auth.uid() == user_id
 * 2. Explicit server-side / API authorization checks
 * 3. Schema validation against injection and untrusted input
 * 4. Error response sanitization preventing internal trace leakage
 */

import { sanitizeText, sanitizeObject } from './sanitize';

export const SecurityErrorCode = {
  UNAUTHORIZED: 'SEC_UNAUTHORIZED',
  FORBIDDEN: 'SEC_FORBIDDEN',
  VALIDATION_FAILED: 'SEC_VALIDATION_FAILED',
  INJECTION_DETECTED: 'SEC_INJECTION_DETECTED',
  STORAGE_ERROR: 'SEC_STORAGE_ERROR',
};

export class SecurityError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'SecurityError';
    this.code = code;
    this.details = details;
    this.userMessage = getSafeUserMessage(code);
  }
}

/**
 * Returns safe, generic user-facing message, never exposing stack traces or internals.
 */
export const getSafeUserMessage = (code) => {
  switch (code) {
    case SecurityErrorCode.UNAUTHORIZED:
      return 'Please establish a valid identity before accessing this resource.';
    case SecurityErrorCode.FORBIDDEN:
      return 'You do not have permission to access or modify this record.';
    case SecurityErrorCode.VALIDATION_FAILED:
      return 'The submitted data did not pass validation checks. Please verify your input.';
    case SecurityErrorCode.INJECTION_DETECTED:
      return 'Invalid characters or malformed input pattern detected.';
    default:
      return 'A security restriction prevented this operation.';
  }
};

/**
 * Enforces Row Level Security (RLS) principle:
 * Reads, updates, and deletes are permitted ONLY when authUid === resourceUserId.
 */
export const enforceRLS = (authUid, resourceUserId, action = 'access') => {
  if (!authUid) {
    throw new SecurityError(
      SecurityErrorCode.UNAUTHORIZED,
      `Unauthenticated access attempt for action: ${action}`,
      { action }
    );
  }

  if (resourceUserId && authUid !== resourceUserId) {
    throw new SecurityError(
      SecurityErrorCode.FORBIDDEN,
      `RLS violation: user ${authUid} cannot ${action} record belonging to ${resourceUserId}`,
      { authUid, resourceUserId, action }
    );
  }

  return true;
};

/**
 * Pattern detector for SQL/NoSQL injection and dangerous payload characters.
 */
const SQL_INJECTION_PATTERN = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|UNION|INTO|FROM|WHERE)\b.*[=;\-])|(--[^\r\n]*)|(\/\*[\w\W]*?(?:\*\/|$))/i;

export const containsInjection = (value) => {
  if (typeof value !== 'string') return false;
  return SQL_INJECTION_PATTERN.test(value);
};

/**
 * Strict schema validator for incoming payloads.
 * @param {Object} schema - Field constraints { [fieldName]: { type, required, min, max, allowedValues } }
 * @param {Object} data - Payload to validate
 */
export const validatePayload = (schema, data) => {
  if (!data || typeof data !== 'object') {
    throw new SecurityError(
      SecurityErrorCode.VALIDATION_FAILED,
      'Payload must be a non-null object'
    );
  }

  const validated = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    if (rules.required && (value === undefined || value === null || value === '')) {
      throw new SecurityError(
        SecurityErrorCode.VALIDATION_FAILED,
        `Field "${field}" is required`,
        { field }
      );
    }

    if (value === undefined || value === null) {
      continue;
    }

    // Type check
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (rules.type && actualType !== rules.type) {
      throw new SecurityError(
        SecurityErrorCode.VALIDATION_FAILED,
        `Field "${field}" must be of type ${rules.type}, received ${actualType}`,
        { field, expected: rules.type, actual: actualType }
      );
    }

    // String length & injection check
    if (typeof value === 'string') {
      if (containsInjection(value)) {
        throw new SecurityError(
          SecurityErrorCode.INJECTION_DETECTED,
          `Injection sequence detected in field "${field}"`,
          { field }
        );
      }

      if (rules.min && value.trim().length < rules.min) {
        throw new SecurityError(
          SecurityErrorCode.VALIDATION_FAILED,
          `Field "${field}" must be at least ${rules.min} characters`,
          { field, min: rules.min }
        );
      }

      if (rules.max && value.length > rules.max) {
        throw new SecurityError(
          SecurityErrorCode.VALIDATION_FAILED,
          `Field "${field}" must not exceed ${rules.max} characters`,
          { field, max: rules.max }
        );
      }

      validated[field] = sanitizeText(value, rules.max || 2000);
    } else if (typeof value === 'object') {
      validated[field] = sanitizeObject(value);
    } else {
      validated[field] = value;
    }

    // Allowed values (enum check)
    if (rules.allowedValues && !rules.allowedValues.includes(value)) {
      throw new SecurityError(
        SecurityErrorCode.VALIDATION_FAILED,
        `Field "${field}" contains invalid option: ${value}`,
        { field, allowed: rules.allowedValues }
      );
    }
  }

  return validated;
};

/**
 * Storage adapter enforcing RLS scoping on all local operations.
 */
export const secureUserStorage = {
  getItem: (key, authUid, targetUserId = authUid) => {
    enforceRLS(authUid, targetUserId, 'read');
    try {
      const raw = localStorage.getItem(`${key}_${targetUserId}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.userId && parsed.userId !== authUid) {
        throw new SecurityError(SecurityErrorCode.FORBIDDEN, 'Stored record user_id mismatch');
      }
      return parsed?.data ?? parsed;
    } catch (e) {
      if (e instanceof SecurityError) throw e;
      return null;
    }
  },

  setItem: (key, data, authUid, targetUserId = authUid) => {
    enforceRLS(authUid, targetUserId, 'write');
    const record = {
      userId: authUid,
      data: sanitizeObject(data),
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(`${key}_${authUid}`, JSON.stringify(record));
      return true;
    } catch {
      return false;
    }
  },

  removeItem: (key, authUid, targetUserId = authUid) => {
    enforceRLS(authUid, targetUserId, 'delete');
    try {
      localStorage.removeItem(`${key}_${authUid}`);
      return true;
    } catch {
      return false;
    }
  },
};
