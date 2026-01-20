/**
 * Generate a random 7-digit integer
 * Useful for generating temporary IDs or test data
 * @returns Random integer between 1000000 and 9999999
 * @example randomInt() // 5438271
 */
export let randomInt = () => Math.floor(Math.random() * 9000000) + 1000000;

/**
 * Calculate percentage of partial value relative to total
 * @param partialValue - The subset value
 * @param totalValue - The total value
 * @returns Percentage as a number (0-100)
 * @example percentage(25, 100) // 25
 * @example percentage(3, 12) // 25
 */
export function percentage(partialValue: number, totalValue: number) {
  return (100 * partialValue) / totalValue;
}

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
