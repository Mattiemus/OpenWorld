import Instance from '../../../engine/datamodel/elements/instance';
import DataModel from '../../../engine/datamodel/elements/datamodel';
import ClientReplicatorImpl from '../../../engine/services/client-replicator-impl';
import { getMetaData } from '../../../engine/datamodel/internals/metadata/metadata';

import { SignalConnection } from 'typed-signals';

export default class BrowserClientReplicatorImpl extends ClientReplicatorImpl
{
    private _descendentAddedConnection: SignalConnection | null = null;
    private _descendentRemovingConnection: SignalConnection | null = null;
    private _descendentPropertyChangedConnections = new Map<Instance, SignalConnection>();

    //
    // Constructor
    //

    constructor(dataModel: DataModel) {
        super();

        this.hookDataModelSignals(dataModel);
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();
        this.unhookDataModelSignals();
    }

    private onRootDataModelDescendantAdded(instance: Instance): void {       
        const metadata = getMetaData(instance);
        if (metadata.hasAttribute('NotReplicated')) {    
            return;
        }

        // TODO: Do something proper here

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

        // TODO: Do something proper here
    }

    private onInstancePropertyChanged(_instance: Instance, _propertyName: string): void {
        // TODO: Do something proper here
    }

    private hookDataModelSignals(dataModel: DataModel): void {
        this._descendentAddedConnection =
            dataModel.descendantAdded.connect(this.onRootDataModelDescendantAdded.bind(this));

        this._descendentRemovingConnection =
            dataModel.descendantRemoving.connect(this.onRootDataModelDescendantRemoving.bind(this));
    }

    private unhookDataModelSignals(): void {
        if (this._descendentAddedConnection !== null) {
            this._descendentAddedConnection.disconnect();
            this._descendentAddedConnection = null;
        }

        if (this._descendentRemovingConnection !== null) {
            this._descendentRemovingConnection.disconnect();
            this._descendentRemovingConnection = null;
        }

        this._descendentPropertyChangedConnections.forEach((v, _) => {
            v.disconnect();
        });

        this._descendentPropertyChangedConnections.clear();
    }
}