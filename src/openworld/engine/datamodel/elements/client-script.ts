import InstanceContext from '../context/instance-context';
import { DataModelClass } from '../metadata/metadata';
import BaseScript from './base-script';

@DataModelClass({
    className: 'ClientScript',
    parent: BaseScript,
    attributes: [],
    properties: {}
})
export default class ClientScript extends BaseScript
{
    //
    // Constructor
    //

    constructor(context: InstanceContext, refId?: string) {
        super(context, refId);
        this.finishConstruction(refId);
    }
}