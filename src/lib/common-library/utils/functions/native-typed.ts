/** Type-safe Object.keys() that preserves key types */
export const getObjectKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

/** Type-safe Object.entries() that preserves key-value types */
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
export const getObjectEntries = <T extends object>(obj: T) => Object.entries(obj) as Entries<T>;
