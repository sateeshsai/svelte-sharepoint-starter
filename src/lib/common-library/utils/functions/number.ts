export let randomInt = () => Math.floor(Math.random() * 9000000) + 1000000;

export function percentage(partialValue: number, totalValue: number) {
  return (100 * partialValue) / totalValue;
}
