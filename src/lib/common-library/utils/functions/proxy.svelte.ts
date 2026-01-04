export function convertToState<T>(data: T): T {
	const converedToState = $state(data);
	return converedToState;
}
