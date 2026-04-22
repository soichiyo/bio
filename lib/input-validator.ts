// lib/input-validator.ts

const MAX_MESSAGE_LENGTH = 1000;

const BLOCKED_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above/i,
  /system\s*prompt/i,
  /you\s+are\s+(now|a)\s/i,
  /act\s+as\s/i,
  /pretend\s+(to\s+be|you('?re|are))/i,
  /reveal\s+(your|the)\s+(system|instructions|prompt)/i,
  /forget\s+(all|everything|your)/i,
];

export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: string };

export function validateInput(message: string): ValidationResult {
  if (!message || message.trim().length === 0) {
    return { valid: false, reason: "empty" };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, reason: "too_long" };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(message)) {
      return { valid: false, reason: "blocked_pattern" };
    }
  }

  return { valid: true };
}
