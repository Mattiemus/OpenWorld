import Destroyable from '../utils/destroyable';

import { Signal, SignalConnection } from 'typed-signals';
import { injectable } from 'inversify';

export type SafeInterThreadType =
    null |
    boolean |
    number | 
    string |
    Array<null | boolean | number | string> |
    { [key: string]: SafeInterThreadType; };

export type InterThreadMessageType = 'Signal' | 'Request' | 'Response';

export type InterThreadMessage =
    InterThreadSignalMessage |
    InterThreadRequestMessage |
    InterThreadResponseMessage;

export type InterThreadSignalMessage = {
    type: 'Signal';
    action: string;
    payload: SafeInterThreadType;
};

export type InterThreadRequestMessage = {
    type: 'Request';    
    action: string;
    payload: SafeInterThreadType;
    requestId: number;
};

export type InterThreadResponseMessage = {
    type: 'Response';
    action: string;
    payload: SafeInterThreadType;
    requestId: number;
};

export interface RawThreadCommunicationObject
{
    addEventListener(type: 'message', listener: (this: RawThreadCommunicationObject, e: MessageEvent) => any): void;
    removeEventListener(type: 'message', listener: (this: RawThreadCommunicationObject, e: MessageEvent) => any): void;
    postMessage(message: any): void;
}

@injectable()
export default class InterThreadCommunication extends Destroyable
{
    private _requestIdCounter: number = 0;

    private _signalReceived = new Signal<(message: InterThreadSignalMessage) => void>();
    private _requestReceived = new Signal<(message: InterThreadRequestMessage) => void>();
    private _responseReceived = new Signal<(message: InterThreadResponseMessage) => void>();

    private _namedSignalReceived = new Map<string, Signal<(message: InterThreadSignalMessage) => void>>();
    private _namedRequestReceived = new Map<string, Signal<(message: InterThreadRequestMessage) => void>>();

    //
    // Constructor
    //

    constructor(private _threadCommunicationObject: RawThreadCommunicationObject) {
        super();
        _threadCommunicationObject.addEventListener('message', this.onMessage);        
    }

    //
    // Methods
    //

    public addRequestHandler(
        action: string,
        handler: (payload: SafeInterThreadType) => SafeInterThreadType | undefined,
        order?: number
    ): SignalConnection {
        let namedRequest = this._namedRequestReceived.get(action);
        if (namedRequest === undefined) {
            namedRequest = new Signal<(message: InterThreadRequestMessage) => void>();
            this._namedRequestReceived.set(action, namedRequest);
        }

        return namedRequest.connect(payload => {
            const result = handler(payload);
            if (result === undefined) {
                return;
            }

            this.sendMessage({
                type: 'Response',
                action: payload.action,
                payload: result,
                requestId: payload.requestId
            });
        }, order);
    }

    public addSignalHandler<THandlerParam extends SafeInterThreadType>(
        action: string,
        handler: (payload: THandlerParam) => void,
        order?: number
    ): SignalConnection {
        let namedSignal = this._namedSignalReceived.get(action);
        if (namedSignal === undefined) {
            namedSignal = new Signal<(message: InterThreadSignalMessage) => void>();
            this._namedSignalReceived.set(action, namedSignal);
        }

        return namedSignal.connect(handler as any, order);
    }

    public fireSignal(action: string, payload: SafeInterThreadType): void {
        this.sendMessage({
            type: 'Signal',    
            action,
            payload
        });
    }

    public callAction(action: string, payload: SafeInterThreadType): Promise<SafeInterThreadType> {
        return new Promise(resolve => {
            const requestId = this._requestIdCounter++;

            const connection =
                this._responseReceived.connect(potentialResponse => {
                    if (potentialResponse.requestId !== requestId) {
                        return;
                    }
                    
                    connection.disconnect();

                    resolve(potentialResponse.payload);
                });

            this._threadCommunicationObject.postMessage({
                type: 'Request',
                action,
                payload,
                requestId
            });
        });
    }

    protected onDestroy(): void {
        super.onDestroy();

        this._threadCommunicationObject.removeEventListener('message', this.onMessage);

        this._signalReceived.disconnectAll();
        this._requestReceived.disconnectAll();
        this._responseReceived.disconnectAll();

        for (const [, value] of this._namedSignalReceived) {
            value.disconnectAll();
        }
        this._namedRequestReceived.clear();

        for (const [, value] of this._namedRequestReceived) {
            value.disconnectAll();
        }
        this._namedRequestReceived.clear();
    }

    private sendMessage(msg: InterThreadMessage): void {
        this._threadCommunicationObject.postMessage(msg);
    }

    private onMessage = (e: MessageEvent): void => {
        const messagePayload: InterThreadMessage = e.data;

        switch (messagePayload.type) {
            case 'Signal': {
                this._signalReceived.emit(messagePayload);      
                                
                const namedSignal = this._namedSignalReceived.get(messagePayload.action);
                if (namedSignal !== undefined) {
                    namedSignal.emit(messagePayload.payload as any);
                }

                break;
            }

            case 'Request': {
                this._requestReceived.emit(messagePayload);
                                                
                const namedRequest = this._namedRequestReceived.get(messagePayload.action);
                if (namedRequest !== undefined) {
                    namedRequest.emit(messagePayload.payload as any);
                }

                break;
            }

            case 'Response':
                this._responseReceived.emit(messagePayload.payload as any);
                break;
        }
    };
}