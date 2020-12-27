import { IDestroyable } from '../../../../utils/interfaces';

import { injectable } from 'inversify';
import { Signal } from 'typed-signals';

@injectable()
export abstract class TaskSchedulerImpl implements IDestroyable
{
    //
    // Events
    //

    public abstract get preRender(): Signal<(deltaTime: number, elapsedTime: number) => void>;
    public abstract get postRender(): Signal<(deltaTime: number, elapsedTime: number) => void>;
    public abstract get preSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void>;
    public abstract get postSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void>;

    //
    // Methods
    //

    public abstract destroy(): void;
}