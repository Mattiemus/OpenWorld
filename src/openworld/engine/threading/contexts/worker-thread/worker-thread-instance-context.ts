import ContentProviderImpl from '../../../services/content-provider-impl';
import DataModel from '../../../datamodel/elements/datamodel';
import InstanceContext from '../../../datamodel/internals/instance-context';
import InterThreadCommunication from '../../inter-thread-communication';
import JsonInstanceSerializer from '../../../datamodel/serialization/json/json-instance-serializer';
import LightingImpl from '../../../services/lighting-impl';
import MouseImpl from '../../../services/mouse-impl';
import NullContentProviderImpl from '../../../services/null/null-content-provider-impl';
import NullLightingImpl from '../../../services/null/null-lighting-impl';
import NullWorldImpl from '../../../services/null/null-world-impl';
import RunServiceImpl from '../../../services/run-service-impl';
import WorkerThreadMouseImpl from './services/worker-thread-mouse-impl';
import WorkerThreadRunServiceImpl from './services/worker-thread-run-service-impl';
import WorldImpl from '../../../services/world-impl';
import { Container } from 'inversify';
import { InstanceJson } from '../../../datamodel/serialization/json/json-instance-serializer';
import { SignalConnection } from 'typed-signals';
import Instance from '../../../datamodel/elements/instance';
import { getMetaData } from '../../../datamodel/internals/metadata/metadata';
import JsonInstancePropertySerializer, { InstanceJsonProperty } from '../../../datamodel/serialization/json/json-instance-property-serializer';

export default class WorkerThreadInstanceContext extends InstanceContext
{
    private _ignoreChanges = false;

    private _synchronizedPromise: Promise<void>;
    private _synchronizedPromiseResolve: (() => void) | undefined = undefined;
    
    private _contextCreateInstanceConnection: SignalConnection;
    private _contextInstancePropertyChangedConnection: SignalConnection;
    private _contextDestroyInstanceConnection: SignalConnection;
    private _contextFinishSynchronizeConnection: SignalConnection;
    
    private _instancePropertyChangedConnections = new Map<Instance, SignalConnection>();

    //
    // Constructor
    //

    constructor(private _comms: InterThreadCommunication) {
        super();
        this.finishConstruction();

        this._synchronizedPromise =
            new Promise(resolve => { 
                this._synchronizedPromiseResolve = resolve;
            });

        this._contextCreateInstanceConnection =
            _comms.addSignalHandler('Context:CreateInstance', this.onContextCreateInstance.bind(this));
        
        this._contextInstancePropertyChangedConnection =
            this._comms.addSignalHandler('Context:InstancePropertyChanged', this.onContextInstancePropertyChanged.bind(this));

        this._contextDestroyInstanceConnection =
            _comms.addSignalHandler('Context:DestroyInstance', this.onContextDestroyInstance.bind(this));

        this._contextFinishSynchronizeConnection =
            _comms.addSignalHandler('Context:FinishSynchronize', this.onContextFinishSynchronize.bind(this));
    }

    //
    // Methods
    //

    public whenSynchronized(): Promise<void> {
        this.throwIfDestroyed();
        return this._synchronizedPromise;
    }

    protected onDestroy(): void {
        super.onDestroy();

        for (const [, value] of this._instancePropertyChangedConnections) {
            value.disconnect();
        }
        this._instancePropertyChangedConnections.clear();

        this._contextCreateInstanceConnection.disconnect();
        this._contextInstancePropertyChangedConnection.disconnect();
        this._contextDestroyInstanceConnection.disconnect();
        this._contextFinishSynchronizeConnection.disconnect();
    }

    protected setupContainer(container: Container): void {
        container.bind(InterThreadCommunication).toConstantValue(this._comms);

        container.bind('NullWorldImpl').to(NullWorldImpl).inSingletonScope();
        container.bind(WorldImpl).toService('NullWorldImpl');

        container.bind('NullContentProviderImpl').to(NullContentProviderImpl).inSingletonScope();
        container.bind(ContentProviderImpl).toService('NullContentProviderImpl');

        container.bind('NullLightingImpl').to(NullLightingImpl).inSingletonScope();
        container.bind(LightingImpl).toService('NullLightingImpl');

        // TODO: client replicator

        container.bind('WorkerThreadMouseImpl').to(WorkerThreadMouseImpl).inSingletonScope();
        container.bind(MouseImpl).toService('WorkerThreadMouseImpl');

        container.bind('WorkerThreadRunServiceImpl').to(WorkerThreadRunServiceImpl).inSingletonScope();
        container.bind(RunServiceImpl).toService('WorkerThreadRunServiceImpl');
    }

    protected createDataModel(): DataModel {
        const dataModel = new DataModel(this);

        // TODO

        return dataModel;
    }

    private onContextCreateInstance(instanceJson: InstanceJson): void {
        const instance = JsonInstanceSerializer.deserializeObject(instanceJson, this, true);

        const propertyChangedConnection =
            instance.propertyChanged.connect(propertyName => this.onInstancePropertyChanged(instance, propertyName));
        this._instancePropertyChangedConnections.set(instance, propertyChangedConnection);
    }

    private onContextDestroyInstance(refId: string): void {
        const instance = this.findInstance(refId);
        if (instance === undefined) {
            return;
        }

        const propertyChangedConnection = this._instancePropertyChangedConnections.get(instance);
        if (propertyChangedConnection !== undefined) {
            propertyChangedConnection.disconnect();
            this._instancePropertyChangedConnections.delete(instance);
        }

        instance.destroy();
    }

    private onContextInstancePropertyChanged(payload: { refId: string, propertyName: string, value: InstanceJsonProperty }): void {
        if (this._ignoreChanges) {
            return;
        }

        const instance = this.findInstance(payload.refId);
        if (instance === undefined) {
            return;
        }

        try {
            this._ignoreChanges = true;
            
            JsonInstancePropertySerializer.deserializeObject(
                payload.value,
                payload.propertyName,
                instance,
                this);
        } finally {
            this._ignoreChanges = false;
        }
    }

    private onContextFinishSynchronize(): void {
        if (this._synchronizedPromiseResolve !== undefined) {
            this._synchronizedPromiseResolve();
            this._synchronizedPromiseResolve = undefined;
        }
    }

    protected onInstancePropertyChanged(instance: Instance, propertyName: string): void {
        const metadata = getMetaData(instance);
        const propertyMetadata = metadata.properties.get(propertyName);
        if (propertyMetadata === undefined) {
            return;
        }

        if (propertyMetadata.hasAttribute('ReadOnly')) {
            return;
        }

        this._comms.fireSignal(
            'Context:InstancePropertyChanged',
            {
                refId: instance['_refId'],
                propertyName,
                value: JsonInstancePropertySerializer.serializeToObject(instance, propertyName)
            });
    }
}