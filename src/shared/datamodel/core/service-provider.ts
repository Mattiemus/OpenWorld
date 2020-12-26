import { Instance } from './instance';
import { DataModelClass, getMetaData, getConstructor } from '../internals/metadata/metadata';
import { Class, Constructor } from '../../utils/types';

import * as _ from "lodash";

@DataModelClass({
    className: 'ServiceProvider',
    parent: Instance,
    attributes: [ 'NotCreatable' ],
    properties: {}
})
export abstract class ServiceProvider extends Instance
{
    //
    // Methods
    //

    public findService<T extends Instance>(className: string | Class<T>): T | undefined {
        // TODO: Improve this

        const service = this.findFirstChildOfClass(className) as T;
        return service;
    }

    public getService<T extends Instance>(className: string | Class<T>): T {
        const foundService = this.findService(className);
        if (foundService !== undefined) {
            return foundService;
        }

        const metadata = getMetaData(className);
        if (!metadata.hasAttribute('Service')) {
            throw new Error(`Requested service class "${metadata.className}" is not a service`);
        }
        
        // TODO: Ensure not already under another object
        // TODO: Ensure Service instances can only be created from here

        const constructor = _.isString(className) ? getConstructor(className) : className as Constructor<T>;

        const instance = new constructor();
        instance.parent = this;

        return instance;
    }
}