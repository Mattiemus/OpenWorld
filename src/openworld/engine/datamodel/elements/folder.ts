import InstanceContext from '../context/instance-context';
import { DataModelClass } from '../metadata/metadata';
import Instance from './instance';

@DataModelClass({
    className: 'Folder',
    parent: Instance,
    attributes: [],
    properties: {}
})
export default class Folder extends Instance
{    
    //
    // Constructor
    //

    constructor(context: InstanceContext, refId?: string) {
        super(context, refId);
        this.finishConstruction(refId);
    }
}