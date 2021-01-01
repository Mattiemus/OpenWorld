import Instance from './instance';
import { getMetaData, getConstructor } from '../internals/metadata/metadata';
import { DataModelClass } from '../internals/metadata/metadata';
import { Class, Constructor } from '../../utils/types';
import InstanceContext from '../internals/instance-context';
import { isString } from '../../utils/type-guards';

@DataModelClass({
    className: 'ServiceProvider',
    parent: Instance,
    attributes: [ 'NotCreatable' ],
    properties: {}
})
export default abstract class ServiceProvider extends Instance
{
    //
    // Methods
    //

    public findService<T extends Instance>(className: string | Class<T>): T | undefined {
        this.throwIfDestroyed();

        const service = this.findFirstChildOfClass(className, false) as T;
        return service;
    }

    public getService<T extends Instance>(className: string | Class<T>): T {
        this.throwIfDestroyed();
        
        const foundService = this.findService(className);
        if (foundService !== undefined) {
            return foundService;
        }
        
        const metadata = getMetaData(className);
        if (!metadata.hasAttribute('Service')) {
            throw new Error(`Requested service class "${metadata.className}" is not a service`);
        }
        
        // TODO: Ensure not already under another object

        const constructor: Constructor<Instance, [InstanceContext]> =
            isString(className) 
                ? getConstructor(className)
                : className as Constructor<Instance, [InstanceContext]>;

        const serviceInstance = this.constructService(constructor);
        serviceInstance.parent = this;

        return serviceInstance as T;
    }

    private constructService<T extends Instance>(constructor: Constructor<T, [InstanceContext]>): T {
        try {
            Instance['_allowCreateService'] = true;

            const instance = new constructor(this._context);
            return instance;
        } catch (e) { 
            Instance['_allowCreateService'] = false;
            throw e;
        }
    }
}