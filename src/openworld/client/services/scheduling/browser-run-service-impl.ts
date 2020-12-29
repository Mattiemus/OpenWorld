import { RunServiceImpl } from '../../../engine/services/scheduling/run-service-impl';
import { RenderCanvas } from '../rendering/render-canvas';

import * as THREE from 'three';
import { Signal } from "typed-signals";

export class BrowserRunServiceImpl extends RunServiceImpl
{
    private _isRunning: boolean = true;
    private _clock = new THREE.Clock(false);

    private _preRender = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _postRender = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _preSimulation = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _postSimulation = new Signal<(deltaTime: number, elapsedTime: number) => void>();

    //
    // Constructor
    //

    constructor(private _renderCanvas: RenderCanvas) {
        super();

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

    protected onDestroy(): void {
        super.onDestroy();
        
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
        this._renderCanvas.render();
        this.firePostRender();
        
        requestAnimationFrame(this.renderLoop);
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