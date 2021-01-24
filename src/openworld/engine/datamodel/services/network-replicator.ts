import Instance from '../elements/instance';
import { DataModelClass } from "../internals/metadata/metadata";

@DataModelClass({
    className: 'NetworkReplicator',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated', 'EditorHidden' ],
    properties: {}
})
export default abstract class NetworkReplicator extends Instance
{
}