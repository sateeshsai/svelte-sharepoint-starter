export let randomInt = () => Math.floor(Math.random() * (Math.floor(1000000) - Math.ceil(2000000) + 1)) + 1000000;

export function percentage(partialValue: number, totalValue: number) {
  return (100 * partialValue) / totalValue;
}
