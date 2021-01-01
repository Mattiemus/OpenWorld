import { DataModelClass } from "../internals/metadata/metadata";
import Instance from '../elements/instance';
import RunServiceImpl from '../../services/run-service-impl';
import ForwardingSignal from '../internals/forwarding-signal';

import { Signal } from 'typed-signals';

@DataModelClass({
    className: 'RunService',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated' ],
    properties: {}
})
export default class RunService extends Instance
{
    private _impl: RunServiceImpl;

    private _preRender: ForwardingSignal<(deltaTime: number, elapsedTime: number) => void>;
    private _postRender: ForwardingSignal<(deltaTime: number, elapsedTime: number) => void>;
    private _preSimulation: ForwardingSignal<(deltaTime: number, elapsedTime: number) => void>;
    private _postSimulation: ForwardingSignal<(deltaTime: number, elapsedTime: number) => void>;
 
    constructor() {
        super();

        this._impl = RunService._getServiceImpl(RunServiceImpl);
        this._impl.attatch(this);
        
        this._preRender = new ForwardingSignal(this._impl.preRender);
        this._postRender = new ForwardingSignal(this._impl.postRender);
        this._preSimulation = new ForwardingSignal(this._impl.preSimulation);
        this._postSimulation = new ForwardingSignal(this._impl.postSimulation);
    }

    //
    // Signals
    //

    public get preRender(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._preRender.signal;
    }

    public get postRender(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._postRender.signal;
    }

    public get preSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._preSimulation.signal;
    }

    public get postSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._postSimulation.signal;
    }

    //
    // Methods
    //    

    protected onDestroy(): void {
        super.onDestroy();
        
        this._impl.detatch(this);

        this._preRender.destroy();
        this._postRender.destroy();
        this._preSimulation.destroy();
        this._postSimulation.destroy();
    }
}