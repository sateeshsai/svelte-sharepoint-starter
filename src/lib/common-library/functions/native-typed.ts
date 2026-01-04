// Typed variant of Object.keys()
export const getObjectKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

// Typed variant of Object.entries()
type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];
export const getObjectEntries = <T extends object>(obj: T) => Object.entries(obj) as Entries<T>;
