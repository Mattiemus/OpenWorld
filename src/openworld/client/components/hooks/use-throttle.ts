import { useState, useRef, useEffect } from "react";

export default function useThrottle<T>(value: T, limit: number): T {
    const [ throttledValue, setThrottleValue ] = useState(value);
    const lastRan = useRef(Date.now());

    useEffect(() => {
        const handler = setTimeout(() => {
            const now = Date.now();
            if (now - lastRan.current >= limit) {
                setThrottleValue(value);
                lastRan.current = now;
            }
        }, limit - (Date.now() - lastRan.current));

        return () => {
            clearTimeout(handler);
        }
    }, [ value, limit ]);

    return throttledValue;
}