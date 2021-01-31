import { Observable } from 'rxjs';
import { useState, useLayoutEffect } from 'react';

export default function useObservable<T>(observable: Observable<T>, initalValue: T) {
    const [ value, setValue ] = useState<T>(initalValue);

    useLayoutEffect(() => {
        const subscription = observable.subscribe(setValue);
        return () => {
            subscription.unsubscribe();
        }
    }, [ observable ]);

    return value;
}