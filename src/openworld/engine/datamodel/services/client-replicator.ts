import { DataModelClass } from "../internals/metadata/metadata";
import NetworkReplicator from './network-replicator';
import ClientReplicatorImpl from '../../services/client-replicator-impl';
import InstanceContext from '../internals/instance-context';

@DataModelClass({
    className: 'ClientReplicator',
    parent: NetworkReplicator,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated' ],
    properties: {}
})
export default abstract class ClientReplicator extends NetworkReplicator
{
    private _impl: ClientReplicatorImpl;

    //
    // Constructor
    //

    constructor(context: InstanceContext) {
        super(context);

        this._impl = context.getServiceImpl(ClientReplicatorImpl);
        this._impl.attatch(this);
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();
        this._impl.detatch(this);
    }
}