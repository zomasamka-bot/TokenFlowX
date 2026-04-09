/**
 * Pi Wallet Validation Utilities
 * Validates Pi Network wallet addresses for Testnet
 */

/**
 * Validates a Pi wallet address format
 * Pi addresses can be in various formats:
 * - 0xPi[...] format (blockchain style)
 * - Pi[...] format (simple)
 * - User ID format
 */
export function isValidPiWallet(address: string): {
  valid: boolean;
  error?: string;
} {
  if (!address || typeof address !== "string") {
    return { valid: false, error: "Wallet address is required" };
  }

  const trimmed = address.trim();

  // Check minimum length
  if (trimmed.length < 5) {
    return { valid: false, error: "Wallet address is too short" };
  }

  // Check maximum length
  if (trimmed.length > 255) {
    return { valid: false, error: "Wallet address is too long" };
  }

  // Check for valid Pi address patterns
  const piAddressPatterns = [
    /^0x[pP]i[a-zA-Z0-9]+$/, // 0xPi format
    /^[pP]i[a-zA-Z0-9]+$/, // Pi format
    /^[a-zA-Z0-9._-]+$/, // Username/ID format
  ];

  const isValidPattern = piAddressPatterns.some(pattern => pattern.test(trimmed));

  if (!isValidPattern) {
    return {
      valid: false,
      error: "Invalid wallet address format. Use Pi address format (e.g., 0xPi... or Pi...)",
    };
  }

  return { valid: true };
}

/**
 * Formats a Pi wallet address for display
 * Truncates long addresses and adds ellipsis
 */
export function formatPiWallet(address: string, maxLength: number = 20): string {
  if (address.length <= maxLength) {
    return address;
  }
  return `${address.substring(0, maxLength - 3)}...`;
}

/**
 * Normalizes a Pi wallet address
 * Ensures consistent formatting
 */
export function normalizePiWallet(address: string): string {
  return address.trim();
}
