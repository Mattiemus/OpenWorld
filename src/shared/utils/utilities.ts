export function defaultOptions<T>(options: Partial<T>, defaults: T): T {
    let result = options as T;

    for (const key in defaults) {
        if (!(key in options)) {
            result[key] = defaults[key];
        }
    }

    return result;
}
