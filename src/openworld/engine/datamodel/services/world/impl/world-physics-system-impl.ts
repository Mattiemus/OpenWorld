import { IDestroyable } from '../../../../utils/interfaces';
import { World } from '../world';

import { injectable } from 'inversify';

@injectable()
export abstract class WorldPhysicsSystemImpl implements IDestroyable
{
    //
    // Methods
    //

    public abstract destroy(): void;
}