import { IDestroyable } from '../../../../utils/interfaces';
import { injectable } from 'inversify';

@injectable()
export abstract class WorldPhysicsSystemImpl implements IDestroyable
{
    public abstract destroy(): void;
}