import { DataModelClass, getMetaData } from '../internals/metadata/metadata';
import { NetworkReplicator } from './network-replicator';
import { Instance } from '../core/instance';
import { ReplicationActionBuilder } from '../../../openworld/engine/systems/replication/replication-action-builder';

@DataModelClass({
    className: 'ClientReplicator',
    parent: NetworkReplicator,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated' ],
    properties: {}
})
export abstract class ClientReplicator extends NetworkReplicator
{
    //
    // Methods
    //

    protected onParentDescendentAdded(instance: Instance): void {
        super.onParentDescendentAdded(instance);

        const metadata = getMetaData(instance);
        if (metadata.hasAttribute('NotReplicated')) {    
            return;
        }

        // TODO: Do something proper here
        const action = ReplicationActionBuilder.toCreateAction(instance);
        console.log(action);
    }

    protected onParentDescendentRemoving(instance: Instance): void {
        super.onParentDescendentRemoving(instance);

        console.log(`Removing "${instance.className}" "${instance.getFullName()}"`);
    }

    protected onParentDescendentPropertyChanged(instance: Instance, propertyName: string): void {
        super.onParentDescendentPropertyChanged(instance, propertyName);

        console.log(`Property "${propertyName}" changed on "${instance.getFullName()}", new value is "${(instance as any)[propertyName]}"`);
    }
}