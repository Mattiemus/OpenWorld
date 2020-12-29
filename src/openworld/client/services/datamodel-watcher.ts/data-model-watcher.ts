import { DataModel } from "../../../engine/datamodel/elements/core/datamodel";
import { ServiceBase } from '../../../engine/services/service-base';
import { Instance } from "../../../engine/datamodel/elements/core/instance";
import { WorldDataModelWatcher } from './world-data-model-watcher';
import { World } from "../../../engine/datamodel/services/world/world";
import { RenderCanvas } from '../rendering/render-canvas';

import { SignalConnection } from "typed-signals";

export class DataModelWatcher extends ServiceBase
{
    private _worldDataModelWatcher: WorldDataModelWatcher | undefined = undefined;

    private _descendentAddedConnection: SignalConnection;
    private _descendentRemovingConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(dataModel: DataModel, private _renderCanvas: RenderCanvas) {
        super();

        this._descendentAddedConnection =
            dataModel.descendantAdded.connect(this.onDescendentAdded.bind(this));

        this._descendentRemovingConnection =
            dataModel.descendantRemoving.connect(this.onDescendentRemoving.bind(this));
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        this._descendentAddedConnection.disconnect();
        this._descendentRemovingConnection.disconnect();
    }

    private onDescendentAdded(descendent: Instance): void {
        if (descendent instanceof World) {
            this._worldDataModelWatcher = new WorldDataModelWatcher(descendent, this._renderCanvas);
        }
    }

    private onDescendentRemoving(descendent: Instance): void {
        if (descendent instanceof World && this._worldDataModelWatcher !== undefined) {
            this._worldDataModelWatcher.destroy();
            this._worldDataModelWatcher = undefined;
        }
    }
}