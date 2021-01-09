import InstanceContext from '../internals/instance-context';
import ServiceProvider from './service-provider';
import { DataModelClass } from '../internals/metadata/metadata';

@DataModelClass({
    className: 'DataModel',
    parent: ServiceProvider,
    attributes: [],
    properties: {}
})
export default class DataModel extends ServiceProvider
{    
    //
    // Constructor
    //

    constructor(context: InstanceContext, refId?: string) {
        super(context, refId);
        this.finishConstruction(refId);
    }
}