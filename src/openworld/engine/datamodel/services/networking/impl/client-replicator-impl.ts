import { IDestroyable } from '../../../../utils/interfaces';
import { Instance } from '../../../elements/core/instance';

import { injectable } from 'inversify';

@injectable()
export abstract class ClientReplicatorImpl implements IDestroyable
{
    //
    // Methods
    //

    public abstract onInstanceAdded(instance: Instance): void;
    public abstract onInstanceRemoving(instance: Instance): void;
    public abstract onInstancePropertyChanged(instance: Instance, propertyName: string): void;
    public abstract destroy(): void;
}