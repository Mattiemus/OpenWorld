import { IDestroyable } from '../../../../../../shared/utils/interfaces';
import { injectable } from 'inversify';

@injectable()
export abstract class WorldRenderSystemImpl implements IDestroyable
{
    public abstract get scene(): THREE.Scene;

    public abstract get camera(): THREE.Camera | undefined;
    public abstract set camera(newCamera: THREE.Camera | undefined);

    public abstract render(): void;

    public abstract destroy(): void;
}