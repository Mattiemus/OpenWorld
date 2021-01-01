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
    return isObject(value) && hasFieldOfType('length', value, isNumber);
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