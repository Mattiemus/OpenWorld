import { DataModelClass } from '../../internals/metadata/metadata';
import { NetworkReplicator } from './network-replicator';
import { ClientReplicatorImpl } from './impl/client-replicator-impl';
import { getServiceFor } from '../../internals/services/service-locator';

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

        this._clientReplicator = getServiceFor(ClientReplicatorImpl, this);
    }
}