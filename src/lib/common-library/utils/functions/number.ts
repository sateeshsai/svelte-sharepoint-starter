/** Generate random 7-digit integer */
export let randomInt = () => Math.floor(Math.random() * 9000000) + 1000000;

/** Calculate percentage of partial value from total */
export function percentage(partialValue: number, totalValue: number) {
  return (100 * partialValue) / totalValue;
}
