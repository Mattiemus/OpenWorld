import { Instance } from '../../../openworld/engine/datamodel/elements/core/instance';
import { ClientReplicatorImpl } from '../../../openworld/engine/datamodel/services/networking/impl/client-replicator-impl';
import { getMetaData } from '../../../openworld/engine/datamodel/internals/metadata/metadata';
import { ReplicationActionBuilder } from '../../../openworld/engine/datamodel/services/networking/impl/replication-action-builder';

import { injectable } from 'inversify';

@injectable()
export class BrowserClientReplicator extends ClientReplicatorImpl
{
    //
    // Methods
    //

    public onInstanceAdded(instance: Instance): void {
        const metadata = getMetaData(instance);
        if (metadata.hasAttribute('NotReplicated')) {    
            return;
        }

        // TODO: Do something proper here
        //const action = ReplicationActionBuilder.toCreateAction(instance);
        //console.log(action);
    }

    public onInstanceRemoving(instance: Instance): void {
        console.log(`Removing "${instance.className}" "${instance.getFullName()}"`);
    }

    public onInstancePropertyChanged(instance: Instance, propertyName: string): void {
        console.log(`Property "${propertyName}" changed on "${instance.getFullName()}", new value is "${(instance as any)[propertyName]}"`);
    }

    public destroy(): void {
        // No-op
    }
}