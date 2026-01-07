/** Wrap data in Svelte $state for reactivity */
export function convertToState<T>(data: T): T {
  const converedToState = $state(data);
  return converedToState;
}
