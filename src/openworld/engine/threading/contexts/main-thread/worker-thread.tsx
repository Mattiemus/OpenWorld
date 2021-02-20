import Destroyable from '../../../utils/destroyable';
import Instance from '../../../datamodel/elements/instance';
import InstanceContext from '../../../datamodel/context/instance-context';
import InterThreadCommunication from '../../inter-thread-communication';
import JsonInstanceSerializer, { InstanceJson } from '../../../datamodel/serialization/json/json-instance-serializer';
import MouseImpl from '../../../datamodel/services/impl/mouse-impl';
import RunServiceImpl from '../../../datamodel/services/impl/run-service-impl';
import WorkerMouseImplProxy from './proxies/worker-mouse-impl-proxy';
import WorkerRunServiceImplProxy from './proxies/worker-run-service-impl-proxy';
import { SignalConnection } from 'typed-signals';
import { getMetaData } from '../../../datamodel/metadata/metadata';
import JsonInstancePropertySerializer, { InstanceJsonProperty } from '../../../datamodel/serialization/json/json-instance-property-serializer';
import InstanceUtils from '../../../datamodel/utils/instance-utils';

export class WorkerThread extends Destroyable {
    private _ignoreChanges = false;

    private _comms: InterThreadCommunication;

    private _runServiceImplProxy: WorkerRunServiceImplProxy;
    private _mouseImplProxy: WorkerMouseImplProxy;

    private _contextCreateInstanceConnection: SignalConnection;
    private _contextInstancePropertyChangedConnection: SignalConnection;
    private _contextDestroyInstanceConnection: SignalConnection;

    private _instanceRegisteredConnection: SignalConnection;
    private _instanceUnregisteredConnection: SignalConnection;
    private _instancePropertyChangedConnections = new Map<Instance, SignalConnection>();

    //
    // Constructor
    //

    constructor(private _parentContext: InstanceContext, private _webWorker: Worker) {
        super();

        this._comms = new InterThreadCommunication(this._webWorker);

        this._runServiceImplProxy =
            new WorkerRunServiceImplProxy(
                this._comms,
                _parentContext.getServiceImpl(RunServiceImpl));

        this._mouseImplProxy =
            new WorkerMouseImplProxy(
                this._comms,
                _parentContext.getServiceImpl(MouseImpl));

        this._contextCreateInstanceConnection =
            this._comms.addSignalHandler('Context:CreateInstance', this.onContextCreateInstance.bind(this));

        this._contextInstancePropertyChangedConnection =
            this._comms.addSignalHandler('Context:InstancePropertyChanged', this.onContextInstancePropertyChanged.bind(this));

        this._contextDestroyInstanceConnection =
            this._comms.addSignalHandler('Context:DestroyInstance', this.onContextDestroyInstance.bind(this));

        this.sendCreateInstanceRecursive(_parentContext.dataModel);
        this.registerInstancePropertyChangedConnectionRecursive(_parentContext.dataModel);

        this._instanceRegisteredConnection =
            _parentContext.instanceRegistered.connect(this.onInstanceRegistered.bind(this));
        
        this._instanceUnregisteredConnection =
            _parentContext.instanceUnregistered.connect(this.onInstanceUnregistered.bind(this));

        this.sendFinishSynchronize();
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        this._runServiceImplProxy.destroy();
        this._mouseImplProxy.destroy();

        this._contextCreateInstanceConnection.disconnect();
        this._contextInstancePropertyChangedConnection.disconnect();
        this._contextDestroyInstanceConnection.disconnect();

        this._instanceRegisteredConnection.disconnect();
        this._instanceUnregisteredConnection.disconnect();

        for (const [, value] of this._instancePropertyChangedConnections) {
            value.disconnect();
        }
        this._instancePropertyChangedConnections.clear();

        this._comms.destroy();        
        this._webWorker.terminate();
    }

    protected sendFinishSynchronize(): void {
        this._comms.fireSignal(
            'Context:FinishSynchronize',
            true);
    }

    protected sendCreateInstanceRecursive(instance: Instance): void {
        this._comms.fireSignal(
            'Context:CreateInstance',
            JsonInstanceSerializer.serializeToObject(instance));

        for (const child of instance.getChildren()) {
            this.sendCreateInstanceRecursive(child);
        }
    }

    protected sendDestroyInstanceRecursive(instance: Instance): void {
        for (const child of instance.getChildren()) {
            this.sendDestroyInstanceRecursive(child);
        }
        
        this._comms.fireSignal(
            'Context:DestroyInstance',
            InstanceUtils.getRefId(instance));
    }

    protected onInstanceRegistered(instance: Instance): void {
        this.sendCreateInstanceRecursive(instance);
        this.registerInstancePropertyChangedConnection(instance);
    }

    protected onInstanceUnregistered(instance: Instance): void {
        this.sendDestroyInstanceRecursive(instance);

        const propertyChangedConnection = this._instancePropertyChangedConnections.get(instance);
        if (propertyChangedConnection !== undefined) {
            propertyChangedConnection.disconnect();
            this._instancePropertyChangedConnections.delete(instance);
        }
    }

    protected onInstancePropertyChanged(instance: Instance, propertyName: string): void {
        if (this._ignoreChanges) {
            return;
        }

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
                refId: InstanceUtils.getRefId(instance),
                propertyName,
                value: JsonInstancePropertySerializer.serializeToObject(instance, propertyName)
            });
    }

    private onContextCreateInstance(instanceJson: InstanceJson): void {
        const instance = JsonInstanceSerializer.deserializeObject(instanceJson, this._parentContext, true, false);

        const propertyChangedConnection =
            instance.propertyChanged.connect(propertyName => this.onInstancePropertyChanged(instance, propertyName));
        this._instancePropertyChangedConnections.set(instance, propertyChangedConnection);
    }

    private onContextInstancePropertyChanged(payload: { refId: string, propertyName: string, value: InstanceJsonProperty }): void {
        const instance = this._parentContext.findInstance(payload.refId);
        if (instance === undefined) {
            return;
        }

        try {
            this._ignoreChanges = true;
            
            JsonInstancePropertySerializer.deserializeObject(
                payload.value,
                payload.propertyName,
                instance,
                this._parentContext);
        } finally {
            this._ignoreChanges = false;
        }
    }

    private onContextDestroyInstance(refId: string): void {
        const instance = this._parentContext.findInstance(refId);
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

    private registerInstancePropertyChangedConnection(instance: Instance): void {
        if (!this._instancePropertyChangedConnections.has(instance)) {
            const propertyChangedConnection =
                instance.propertyChanged.connect(propertyName => this.onInstancePropertyChanged(instance, propertyName));
            this._instancePropertyChangedConnections.set(instance, propertyChangedConnection);
        }
    }

    private registerInstancePropertyChangedConnectionRecursive(instance: Instance): void {
        this.registerInstancePropertyChangedConnection(instance);

        for (const child of instance.getChildren()) {
            this.registerInstancePropertyChangedConnectionRecursive(child);
        }
    }
}
