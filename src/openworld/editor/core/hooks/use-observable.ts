import { Observable } from 'rxjs';
import { useState, useLayoutEffect } from 'react';

export default function useObservable<T>(observable: Observable<T>) {
    const [ value, setValue ] = useState<T>(undefined as unknown as T);

    useLayoutEffect(() => {
        const subscription = observable.subscribe(setValue);
        return () => {
            subscription.unsubscribe();
        }
    }, [ observable ]);

    return value;
}