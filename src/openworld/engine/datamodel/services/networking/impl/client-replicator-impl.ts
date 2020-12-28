import { IDestroyable } from '../../../../utils/interfaces';
import { DataModel } from '../../../elements/core/datamodel';

import { injectable } from 'inversify';

@injectable()
export abstract class ClientReplicatorImpl implements IDestroyable
{
    //
    // Methods
    //

    public abstract destroy(): void;
}