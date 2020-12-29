import { IDestroyable } from '../../utils/interfaces';
import { Signal, SignalConnection } from 'typed-signals';

export default class ForwardingSignal<THandler extends (...args: any[]) => void> implements IDestroyable
{
    private _connection: SignalConnection;
    private _signal = new Signal<THandler>();

    constructor(parentSignal: Signal<THandler>, order?: number) {
        // TODO: Fix this type deduction
        this._connection = parentSignal.connect(((...args: Parameters<THandler>): void => {
            this._signal.emit(...args);
        }) as any, order);
    }

    public get signal(): Signal<THandler> {
        return this._signal;
    }
    
    public destroy(): void {
        this._connection.disconnect();
    }
}
