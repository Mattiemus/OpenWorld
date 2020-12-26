export type Class<T> = Function & { prototype: T };
export type Constructor<T> = { new(...args: any[]): T };
