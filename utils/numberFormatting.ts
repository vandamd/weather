/**
 * Format a number to a string with specified decimal places,
 * avoiding the "-0" display issue that occurs with .toFixed()
 *
 * @param value - The number to format
 * @param decimals - Number of decimal places (0, 1, or 2)
 * @returns Formatted number as string
 *
 * @example
 * formatNumber(-0.3, 0) // "0" instead of "-0"
 * formatNumber(23.456, 1) // "23.5"
 * formatNumber(5.123, 2) // "5.12"
 */
export function formatNumber(value: number, decimals: number = 0): string {
	const multiplier = Math.pow(10, decimals);
	const rounded = Math.round(value * multiplier) / multiplier;

	if (decimals === 0) {
		return rounded.toString();
	}

	return rounded.toFixed(decimals);
}
