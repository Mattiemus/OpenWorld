import { Instance } from '../../../openworld/engine/datamodel/elements/core/instance';
import { DataModel } from '../../../openworld/engine/datamodel/elements/core/datamodel';
import { ClientReplicatorImpl } from '../../../openworld/engine/datamodel/services/networking/impl/client-replicator-impl';
import { getMetaData } from '../../../openworld/engine/datamodel/internals/metadata/metadata';

import { injectable } from 'inversify';
import { SignalConnection } from 'typed-signals';
import { ServiceInstance, InjectInstance } from '../../../openworld/engine/datamodel/internals/services/service-instance';

@injectable()
export class BrowserClientReplicator extends ClientReplicatorImpl
{
    private _dataModel: DataModel;
    private _descendentAddedConnection: SignalConnection | undefined = undefined;
    private _descendentRemovingConnection: SignalConnection | undefined = undefined;
    private _descendentPropertyChangedConnections = new Map<Instance, SignalConnection>();

    constructor(@InjectInstance(DataModel) dataModel: ServiceInstance<DataModel>) {
        super();

        this._dataModel = dataModel.instance;
        this.hookDataModelSignals(dataModel.instance);
    }

    //
    // Methods
    //

    public destroy(): void {
        this.unhookDataModelSignals();
    }

    private onRootDataModelDescendantAdded(instance: Instance): void {       
        const metadata = getMetaData(instance);
        if (metadata.hasAttribute('NotReplicated')) {    
            return;
        }

        // TODO: Do something proper here
        //const action = ReplicationActionBuilder.toCreateAction(instance);
        //console.log(action);

        const propChangedConnection =
            instance.propertyChanged.connect(p => {
                // TODO: Ensure property replicatable
                this.onInstancePropertyChanged(instance, p);
            });

        this._descendentPropertyChangedConnections.set(instance, propChangedConnection);
    }

    private onRootDataModelDescendantRemoving(instance: Instance): void {
        const handler = this._descendentPropertyChangedConnections.get(instance);
        if (handler !== undefined) { 
            handler.disconnect();
            this._descendentPropertyChangedConnections.delete(instance);
        }

        console.log(`Removing "${instance.className}" "${instance.getFullName()}"`);
    }

    private onInstancePropertyChanged(instance: Instance, propertyName: string): void {
        console.log(`Property "${propertyName}" changed on "${instance.getFullName()}", new value is "${(instance as any)[propertyName]}"`);
    }

    private hookDataModelSignals(dataModel: DataModel): void {
        this._descendentAddedConnection =
            dataModel.descendantAdded.connect(this.onRootDataModelDescendantAdded.bind(this));

        this._descendentRemovingConnection =
            dataModel.descendantRemoving.connect(this.onRootDataModelDescendantRemoving.bind(this));
    }

    private unhookDataModelSignals(): void {
        if (this._descendentAddedConnection !== undefined) {
            this._descendentAddedConnection.disconnect();
            this._descendentAddedConnection = undefined;
        }

        if (this._descendentRemovingConnection !== undefined) {
            this._descendentRemovingConnection.disconnect();
            this._descendentRemovingConnection = undefined;
        }

        this._descendentPropertyChangedConnections.forEach((v, _) => {
            v.disconnect();
        });

        this._descendentPropertyChangedConnections.clear();
    }
}