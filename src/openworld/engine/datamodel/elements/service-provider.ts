import Instance from './instance';
import { DataModelClass } from '../internals/metadata/metadata';
import { Class } from '../../utils/types';

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

    public findService<TInstance extends Instance>(className: string | Class<TInstance>): TInstance | undefined {
        this.throwIfDestroyed();
        return this._context.findServiceInstance(className);
    }

    public getService<TInstance extends Instance>(className: string | Class<TInstance>): TInstance {
        this.throwIfDestroyed();        
        return this._context.findOrCreateServiceInstance(this, className);
    }
}