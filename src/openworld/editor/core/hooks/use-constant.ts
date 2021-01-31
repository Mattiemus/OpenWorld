import React, { useRef } from 'react'

type ResultBox<T> = {
    value: T
};

export default function useConstant<T>(fn: () => T): T {
    const ref = useRef<ResultBox<T>>();

    if (!ref.current) {
        ref.current = { 
            value: fn()
        };
    }

    return ref.current.value;
}