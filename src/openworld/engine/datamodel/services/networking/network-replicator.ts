import { Instance } from '../../elements/core/instance';
import { DataModelClass } from "../../internals/metadata/metadata";

@DataModelClass({
    className: 'NetworkReplicator',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated' ],
    properties: {}
})
export abstract class NetworkReplicator extends Instance
{
}