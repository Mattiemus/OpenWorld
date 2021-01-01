export type Class<T> = Function & { prototype: T };
export type Constructor<T, TArgs extends any[]> = { new(...args: TArgs): T };
