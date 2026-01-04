export type ExactlyOne<T> = {
  [K in keyof T]: { [P in K]: T[K] } & { [P in Exclude<keyof T, K>]?: undefined };
}[keyof T];

export type PromiseResolvedType<T> = T extends Promise<infer R> ? R : never;
export type ReturnResolvedType<T extends (...args: any[]) => any> = PromiseResolvedType<ReturnType<T>>;
