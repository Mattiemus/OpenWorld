import { DataModelClass } from "../../internals/metadata/metadata";
import { NetworkReplicator } from './network-replicator';
import { ClientReplicatorImpl } from '../../../services/networking/client-replicator-impl';

@DataModelClass({
    className: 'ClientReplicator',
    parent: NetworkReplicator,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated' ],
    properties: {}
})
export abstract class ClientReplicator extends NetworkReplicator
{
    private _impl: ClientReplicatorImpl;

    //
    // Constructor
    //

    constructor() {
        super();

        this._impl = ClientReplicator._getServiceImpl(ClientReplicatorImpl);
    }
}