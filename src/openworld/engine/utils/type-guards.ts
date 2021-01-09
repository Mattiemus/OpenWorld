export function isString(value: unknown): value is string {
    return (typeof value === 'string');
}

export function isNumber(value: unknown): value is number {
    return (typeof value === 'number');
}

export function isBoolean(value: unknown): value is boolean {
    return (typeof value === 'boolean');
}

export function isObject(value: unknown): value is object {
    return (typeof value === 'object');
}

export function isArray(value: unknown): value is Array<unknown> {
    return Array.isArray(value);
}

export function isArrayOf<TType>(value: unknown, elementGuard: (e: unknown) => e is TType, minLength?: 0): value is [];
export function isArrayOf<TType>(value: unknown, elementGuard: (e: unknown) => e is TType, minLength?: 1): value is [TType];
export function isArrayOf<TType>(value: unknown, elementGuard: (e: unknown) => e is TType, minLength?: 2): value is [TType, TType];
export function isArrayOf<TType>(value: unknown, elementGuard: (e: unknown) => e is TType, minLength?: 3): value is [TType, TType, TType];
export function isArrayOf<TType>(value: unknown, elementGuard: (e: unknown) => e is TType, minLength?: 4): value is [TType, TType, TType, TType];
export function isArrayOf<TType>(value: unknown, elementGuard: (e: unknown) => e is TType, minLength?: 5): value is [TType, TType, TType, TType, TType];
export function isArrayOf<TType>(value: unknown, elementGuard: (e: unknown) => e is TType, minLength?: 6): value is [TType, TType, TType, TType, TType, TType];
export function isArrayOf<TType>(value: unknown, elementGuard: (e: unknown) => e is TType, minLength?: 7): value is [TType, TType, TType, TType, TType, TType, TType];
export function isArrayOf<TType>(value: unknown, elementGuard: (e: unknown) => e is TType, minLength?: number): value is Array<TType> {
    if (!Array.isArray(value)) {
        return false;
    }

    if (minLength !== undefined && value.length < minLength) {
        return false;
    }

    for (const element of value) {
        if (!elementGuard(element)) {
            return false;
        }
    }

    return true;
}

export function isFunction(value: unknown): value is Function {
    return (typeof value === 'function');
}

export function hasField<TField extends string>(
    fieldName: TField,
    obj: object
): obj is { [ K in TField ]: unknown; } {
    const unsafeObj = obj as any;
    if (unsafeObj[fieldName] !== undefined) {
        return true;
    }

    return false;
}

export function hasFieldOfType<TField extends string, TType>(
    fieldName: TField,
    obj: object,
    fieldGuard: (f: unknown) => f is TType
): obj is { [ K in TField ]: TType; } {
    const unsafeObj = obj as any;
    if (unsafeObj[fieldName] !== undefined && fieldGuard(unsafeObj[fieldName])) {
        return true;
    }

    return false;
}