import DataModel from '../elements/datamodel';
import Destroyable from '../../utils/destroyable';
import Instance from '../elements/instance';
import ServiceBase from '../../services/base/service-base';
import ServiceProvider from '../elements/service-provider';
import Uuid from '../../utils/uuid';
import { Class, Constructor } from '../../utils/types';
import { Container } from 'inversify';
import { getConstructor, getMetaData } from './metadata/metadata';
import { isString } from '../../utils/type-guards';
import { Signal } from 'typed-signals';
import InstanceUtils from '../utils/InstanceUtils';

export default abstract class InstanceContext extends Destroyable
{
    private _container = new Container();
    private _allInstances = new Map<string, Instance>();
    private _serviceInstances = new Map<string, Instance>();
    private _dataModel: DataModel | null = null;

    private _instanceRegistered = new Signal<(instance: Instance) => void>();
    private _instanceUnregistered = new Signal<(instance: Instance) => void>();

    //
    // Signals
    //

    public get instanceRegistered(): Signal<(instance: Instance) => void> {
        this.throwIfDestroyed();
        return this._instanceRegistered;
    }

    public get instanceUnregistered(): Signal<(instance: Instance) => void> {
        this.throwIfDestroyed();
        return this._instanceUnregistered;
    }

    //
    // Properties
    //

    public get dataModel(): DataModel {
        this.throwIfDestroyed();

        if (this._dataModel === null) {
            this._dataModel = this.createDataModel();
        }

        return this._dataModel;
    }

    //
    // Methods
    //
    
    public registerInstance(instance: Instance, refId?: string): string {
        this.throwIfDestroyed();

        const metadata = getMetaData(instance);

        let id = refId;
        if (id === undefined) {
            id = this.generateIdForInstance(instance);
        }

        InstanceUtils.unsafeSetRefId(instance, id);

        this._allInstances.set(id, instance);

        if (metadata.hasAttribute('Service')) {
            this._serviceInstances.set(instance.className, instance);
        }

        this._instanceRegistered.emit(instance);

        return id;
    }

    public unregisterInstance(instance: Instance): void {
        this.throwIfDestroyed();

        const instanceRefId = InstanceUtils.getRefId(instance);

        this._instanceUnregistered.emit(instance);

        this._allInstances.delete(instanceRefId);        
        this._serviceInstances.delete(instance.className);
    }

    public getActiveInstances(): Instance[] {
        return [ ...this._allInstances.values() ];
    }

    public hasInstance(referenceId: string): boolean {
        this.throwIfDestroyed();
        return this._allInstances.has(referenceId);
    }

    public hasServiceInstance(className: string | Class<Instance>): boolean {
        this.throwIfDestroyed();

        if (!isString(className)) {
            const metadata = getMetaData(className);
            className = metadata.className;
        }

        return this._serviceInstances.has(className);
    }

    public findInstance(referenceId: string): Instance | undefined {
        this.throwIfDestroyed();
        return this._allInstances.get(referenceId);
    }

    public findServiceInstance<TInstance extends Instance>(
        className: string | Class<TInstance>
    ): TInstance | undefined {
        this.throwIfDestroyed();

        if (!isString(className)) {
            const metadata = getMetaData(className);
            className = metadata.className;
        }
        
        const service = this._serviceInstances.get(className) as TInstance | undefined;
        return service;
    }

    public findOrCreateServiceInstance<TInstance extends Instance>(
        parent: ServiceProvider,
        className: string | Class<TInstance>
    ): TInstance {
        this.throwIfDestroyed();

        if (!isString(className)) {
            const metadata = getMetaData(className);
            className = metadata.className;
        }

        const existingService = this.findServiceInstance<TInstance>(className);
        if (existingService !== undefined) {
            return existingService;
        }

        const metadata = getMetaData(className);
        if (!metadata.hasAttribute('Service')) {
            throw new Error(`Requested service class "${metadata.className}" is not a service`);
        }
        
        const constructor: Constructor<TInstance, [InstanceContext, string?]> =
            isString(className) 
                ? getConstructor(className)
                : className as Constructor<TInstance, [InstanceContext, string?]>;

        try {
            Instance['_allowCreateService'] = true;

            const serviceInstance = new constructor(this);
            serviceInstance.parent = parent;
    
            return serviceInstance;
        } finally { 
            Instance['_allowCreateService'] = false;
        }
    }

    public getServiceImpl<TService extends ServiceBase>(serviceBase: Class<TService> | string): TService {
        this.throwIfDestroyed();
        return this._container.get(serviceBase);
    }

    protected finishConstruction(): void {
        this.setupContainer(this._container);

        if (this._dataModel === null) {
            this._dataModel = this.createDataModel();
        }
    }

    protected abstract setupContainer(container: Container): void;

    protected abstract createDataModel(): DataModel;

    private generateIdForInstance(instance: Instance): string {
        const metadata = getMetaData(instance);

        if (instance instanceof DataModel || metadata.hasAttribute('Service')) {
            return `$${metadata.className}`;
        }

        const id = new Uuid();
        return id.toString();
    }
}