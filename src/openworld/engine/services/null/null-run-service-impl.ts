import RunServiceImpl from "../run-service-impl";

import { Signal } from "typed-signals";
import { injectable } from "inversify";

@injectable()
export default class NullRunServiceImpl extends RunServiceImpl
{
    private _preRender = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _postRender = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _preSimulation = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _postSimulation = new Signal<(deltaTime: number, elapsedTime: number) => void>();

    //
    // Signals
    //

    public get preRender(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._preRender;
    }

    public get postRender(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._postRender;
    }
    public get preSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._preSimulation;
    }
    public get postSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._postSimulation;
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();
        
        this._preRender.disconnectAll();
        this._postRender.disconnectAll();
        this._preSimulation.disconnectAll();
        this._postSimulation.disconnectAll();
    }
}