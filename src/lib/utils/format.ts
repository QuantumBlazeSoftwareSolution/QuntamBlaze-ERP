/**
 * Formats a number as a currency string.
 * e.g. 1245000 -> $1,245,000
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats large numbers into compact strings.
 * e.g. 1245000 -> $1.2M
 */
export function formatCompactCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Capitalizes payment method for display.
 */
export function formatPaymentMethod(method: string): string {
  return method.charAt(0).toUpperCase() + method.slice(1);
}
