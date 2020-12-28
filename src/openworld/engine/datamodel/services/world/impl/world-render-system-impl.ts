import { IDestroyable } from '../../../../utils/interfaces';
import { injectable } from 'inversify';

@injectable()
export abstract class WorldRenderSystemImpl implements IDestroyable
{
    //
    // Methods
    //

    public abstract render(): void;
    public abstract destroy(): void;
}