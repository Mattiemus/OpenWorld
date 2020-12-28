import { TaskSchedulerImpl } from '../../../openworld/engine/datamodel/services/scheduling/impl/task-scheduler-impl';
import { WorldRenderSystemImpl } from '../../../openworld/engine/datamodel/services/world/impl/world-render-system-impl';
import { getService } from '../../../openworld/engine/datamodel/internals/services/service-locator';

import * as THREE from 'three';
import { Signal } from "typed-signals";
import { injectable } from 'inversify';

@injectable()
export class BrowserTaskScheduler extends TaskSchedulerImpl
{
    private _isRunning: boolean = true;
    private _clock = new THREE.Clock(false);
    private _renderSystem: WorldRenderSystemImpl;

    private _preRender = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _postRender = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _preSimulation = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _postSimulation = new Signal<(deltaTime: number, elapsedTime: number) => void>();

    //
    // Constructor
    //

    constructor() {
        super();

        this._renderSystem = getService(WorldRenderSystemImpl);

        this._clock.start();
        requestAnimationFrame(this.renderLoop);
    }

    //
    // Signals
    //

    public get preRender(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        return this._preRender;
    }

    public get postRender(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        return this._postRender;
    }

    public get preSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        return this._preSimulation;
    }

    public get postSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        return this._postSimulation;
    }

    //
    // Methods
    //

    public destroy(): void {
        this._isRunning = false;
        this._preRender.disconnectAll();
        this._postRender.disconnectAll();
        this._preSimulation.disconnectAll();
        this._postSimulation.disconnectAll();
    }

    private renderLoop = (): void => {
        if (!this._isRunning) {
            return;
        }
        
        this.firePreSimulation();
        // TODO: Simulate
        this.firePostSimulation();

        this.firePreRender();
        this._renderSystem.render();
        this.firePostRender();

        if (this._isRunning) {
            requestAnimationFrame(this.renderLoop);
        }
    }

    private firePreSimulation(): void {

        const dt = this._clock.getDelta();
        const elapsed = this._clock.getElapsedTime();
        this._preSimulation.emit(dt, elapsed);
    }

    private firePostSimulation(): void {

        const dt = this._clock.getDelta();
        const elapsed = this._clock.getElapsedTime();
        this._postSimulation.emit(dt, elapsed);
    }

    private firePreRender(): void {

        const dt = this._clock.getDelta();
        const elapsed = this._clock.getElapsedTime();
        this._preRender.emit(dt, elapsed);
    }

    private firePostRender(): void {

        const dt = this._clock.getDelta();
        const elapsed = this._clock.getElapsedTime();
        this._postRender.emit(dt, elapsed);
    }
}