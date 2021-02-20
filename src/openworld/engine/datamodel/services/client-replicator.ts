import { DataModelClass } from "../metadata/metadata";
import NetworkReplicator from './network-replicator';
import ClientReplicatorImpl from './impl/client-replicator-impl';
import InstanceContext from '../context/instance-context';

@DataModelClass({
    className: 'ClientReplicator',
    parent: NetworkReplicator,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated', 'EditorHidden' ],
    properties: {}
})
export default abstract class ClientReplicator extends NetworkReplicator
{
    private _impl: ClientReplicatorImpl;

    //
    // Constructor
    //

    constructor(context: InstanceContext, refId?: string) {
        super(context, refId);

        this._impl = context.getServiceImpl(ClientReplicatorImpl);
        this._impl.attatch(this);

        this.finishConstruction(refId);
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();
        this._impl.detatch(this);
    }
}