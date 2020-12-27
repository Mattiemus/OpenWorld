import { DataModelClass } from '../../internals/metadata/metadata';
import { Instance } from '../../elements/core/instance';
import { getService } from '../../internals/service-locator';
import { TaskSchedulerImpl } from './impl/task-scheduler-impl';
import { ForwardingSignal } from '../../internals/forwarding-signal';

import { Signal } from 'typed-signals';

@DataModelClass({
    className: 'RunService',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated' ],
    properties: {}
})
export class RunService extends Instance
{
    private _taskScheduler: TaskSchedulerImpl;

    private _preRender: ForwardingSignal<(deltaTime: number, elapsedTime: number) => void>;
    private _postRender: ForwardingSignal<(deltaTime: number, elapsedTime: number) => void>;
    private _preSimulation: ForwardingSignal<(deltaTime: number, elapsedTime: number) => void>;
    private _postSimulation: ForwardingSignal<(deltaTime: number, elapsedTime: number) => void>;
 
    constructor() {
        super();

        this._taskScheduler = getService(TaskSchedulerImpl);
        
        this._preRender = new ForwardingSignal(this._taskScheduler.preRender);
        this._postRender = new ForwardingSignal(this._taskScheduler.postRender);
        this._preSimulation = new ForwardingSignal(this._taskScheduler.preSimulation);
        this._postSimulation = new ForwardingSignal(this._taskScheduler.postSimulation);
    }

    //
    // Events
    //

    public get preRender(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        return this._preRender.signal;
    }

    public get postRender(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        return this._postRender.signal;
    }

    public get preSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        return this._preSimulation.signal;
    }

    public get postSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        return this._postSimulation.signal;
    }

    //
    // Methods
    //    

    protected onDestroy(): void {
        super.onDestroy();

        this._preRender.destroy();
        this._postRender.destroy();
        this._preSimulation.destroy();
        this._postSimulation.destroy();
    }
}