import { Instance } from '../core/instance';
import { DataModelClass } from '../internals/metadata/metadata';
import { SignalConnection } from 'typed-signals';

@DataModelClass({
    className: 'NetworkReplicator',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated' ],
    properties: {}
})
export abstract class NetworkReplicator extends Instance
{    
    private _descendantAddedConnection: SignalConnection | undefined = undefined;
    private _descendantRemovingConnection: SignalConnection | undefined = undefined;
    private _descendentPropertyChangedConnections = new Map<Instance, SignalConnection>();

    //
    // Methods
    //

    protected onParentDescendentAdded(instance: Instance): void {
        const propChangedConnection =
            instance.propertyChanged.connect(p => {
                // TODO: Ensure property replicatable
                this.onParentDescendentPropertyChanged(instance, p);
            });

        this._descendentPropertyChangedConnections.set(instance, propChangedConnection);
    }

    protected onParentDescendentRemoving(instance: Instance): void {
        const handler = this._descendentPropertyChangedConnections.get(instance);
        if (handler !== undefined) { 
            handler.disconnect();
            this._descendentPropertyChangedConnections.delete(instance);
        }
    }

    protected onParentDescendentPropertyChanged(instance: Instance, propertyName: string): void {
        // No-op
    }

    protected onParentChanged(newParent: Instance | null): void {
        super.onParentChanged(newParent);

        this.disconnectSignalHandlers();

        if (newParent !== null) {
            this.connectSignalHandlers(newParent);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.disconnectSignalHandlers();
    }

    private disconnectSignalHandlers(): void {
        if (this._descendantAddedConnection !== undefined) {
            this._descendantAddedConnection.disconnect();
            this._descendantAddedConnection = undefined;
        }
        
        if (this._descendantRemovingConnection !== undefined) {
            this._descendantRemovingConnection.disconnect();
            this._descendantRemovingConnection = undefined;
        }
        
        this._descendentPropertyChangedConnections.forEach((v, _) => {
            v.disconnect();
        });

        this._descendentPropertyChangedConnections.clear();
    }

    private connectSignalHandlers(instance: Instance): void {
        this._descendantAddedConnection =
            instance.descendantAdded.connect(i => {
                // TODO: Ensure replicatable
                this.onParentDescendentAdded(i);
            });

        this._descendantRemovingConnection =
            instance.descendantRemoving.connect(i => {
                // TODO: Ensure replicatable
                this.onParentDescendentRemoving(i);
            });
    }
}