import { ServiceBase } from '../service-base';
import { Signal } from 'typed-signals';

export abstract class RunServiceImpl extends ServiceBase
{
    //
    // Signals
    //

    public abstract get preRender(): Signal<(deltaTime: number, elapsedTime: number) => void>;
    public abstract get postRender(): Signal<(deltaTime: number, elapsedTime: number) => void>;
    public abstract get preSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void>;
    public abstract get postSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void>;
}