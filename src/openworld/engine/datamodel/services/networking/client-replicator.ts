import { DataModelClass } from '../../internals/metadata/metadata';
import { NetworkReplicator } from './network-replicator';
import { Instance } from '../../elements/core/instance';
import { ClientReplicatorImpl } from './impl/client-replicator-impl';
import { getService } from '../../internals/service-locator';

@DataModelClass({
    className: 'ClientReplicator',
    parent: NetworkReplicator,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated' ],
    properties: {}
})
export abstract class ClientReplicator extends NetworkReplicator
{
    private _clientReplicator: ClientReplicatorImpl;

    //
    // Constructor
    //

    constructor() {
        super();

        this._clientReplicator = getService(ClientReplicatorImpl);
    }
    
    //
    // Methods
    //

    protected onParentDescendentAdded(instance: Instance): void {
        super.onParentDescendentAdded(instance);
        this._clientReplicator.onInstanceAdded(instance);
    }

    protected onParentDescendentRemoving(instance: Instance): void {
        super.onParentDescendentRemoving(instance);
        this._clientReplicator.onInstanceRemoving(instance);
    }

    protected onParentDescendentPropertyChanged(instance: Instance, propertyName: string): void {
        super.onParentDescendentPropertyChanged(instance, propertyName);
        this._clientReplicator.onInstancePropertyChanged(instance, propertyName);
    }
}