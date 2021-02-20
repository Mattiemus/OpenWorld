import Instance from '../../../../engine/datamodel/elements/instance';
import World from '../../../../engine/datamodel/services/world';
import WorldImpl from '../../../../engine/datamodel/services/impl/world-impl';
import { injectable } from 'inversify';
import { SignalConnection } from 'typed-signals';
import ClientScript from '../../../../engine/datamodel/elements/client-script';
import ClientScriptProxy from '../../../services/scripts/client-script-proxy';

@injectable()
export default class ScriptThreadWorldImpl extends WorldImpl
{
    private _clientScriptProxies = new Map<ClientScript, ClientScriptProxy>();

    private _descendantAddedConnection: SignalConnection | null = null;
    private _descendantRemovingConnection: SignalConnection | null = null;

    //
    // Methods
    //

    protected onAttatch(dataModel: World): void {
        super.onAttatch(dataModel);

        this._descendantAddedConnection =
            dataModel.descendantAdded.connect(this.onDescendantAdded.bind(this));

        this._descendantRemovingConnection =
            dataModel.descendantRemoving.connect(this.onDescendantRemoving.bind(this));
    }

    protected onDetatch(): void {
        super.onDetatch();

        if (this._descendantAddedConnection !== null) {
            this._descendantAddedConnection.disconnect();
            this._descendantAddedConnection = null;
        }

        if (this._descendantRemovingConnection !== null) {
            this._descendantRemovingConnection.disconnect();
            this._descendantRemovingConnection = null;
        }
    }

    private onDescendantAdded(descendant: Instance): void {
        if (descendant instanceof ClientScript) {
            const scriptProxy = new ClientScriptProxy(descendant);
            this._clientScriptProxies.set(descendant, scriptProxy);
        }
    }

    private onDescendantRemoving(descendant: Instance): void {        
        if (descendant instanceof ClientScript) {
            const proxy = this._clientScriptProxies.get(descendant);
            if (proxy !== undefined) {
                proxy.destroy();
                this._clientScriptProxies.delete(descendant);
            }
        }
    }
}