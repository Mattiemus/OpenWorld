import { IDestroyable } from '../../../../utils/interfaces';
import { injectable } from 'inversify';
import { Camera } from '../../../elements/world/camera';
import { Instance } from '../../../elements/core/instance';

import { Signal } from 'typed-signals';

@injectable()
export abstract class WorldRenderSystemImpl implements IDestroyable
{
    //
    // Events
    //

    public abstract get currentCameraChanged(): Signal<() => void>;

    //
    // Properties
    //

    public abstract get currentCamera(): Camera;
    public abstract set currentCamera(newCamera: Camera);

    //
    // Methods
    //

    public abstract onInstanceRemovedFromWorld(child: Instance): void;
    public abstract onInstanceAddedToWorld(child: Instance): void;
    public abstract render(): void;
    public abstract destroy(): void;
}