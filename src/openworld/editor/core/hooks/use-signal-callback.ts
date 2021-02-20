import { Signal } from "typed-signals";
import { useEffect, useCallback } from "react";

export default function useSignalCallback<TArgs extends any[], TRet>(
    signal: Signal<(...args: TArgs) => TRet>, 
    callbackFn: (...args: TArgs) => TRet,
    callbackFnDeps: any[]
): void {
    const callback = useCallback(callbackFn, callbackFnDeps);

    useEffect(() => {
        const connection = signal.connect(callback);
        return () => {
            connection.disconnect();
        };
    }, [ signal, callback ]);
}