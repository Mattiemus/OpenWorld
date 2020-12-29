import WorldImpl from "../../../engine/services/world-impl";
import WorldDataModelProxy from "./graphics/data-model-proxies/world-data-model-proxy";
import World from "../../../engine/datamodel/services/world";
import RenderCanvas from "./graphics/render-canvas";

export default class BrowserWorldImpl extends WorldImpl
{
    private _worldDataModelWatcher: WorldDataModelProxy | undefined = undefined;

    //
    // Constructor
    //

    constructor(private _renderCanvas: RenderCanvas) {
        super();
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        if (this._worldDataModelWatcher !== undefined) {
            this._worldDataModelWatcher.destroy();
            this._worldDataModelWatcher = undefined;
        }
    }

    protected onAttatch(dataModel: World): void {        
        this._worldDataModelWatcher = new WorldDataModelProxy(dataModel, this._renderCanvas);
    }

    protected onDetatch(_dataModel: World): void {
        if (this._worldDataModelWatcher !== undefined) {
            this._worldDataModelWatcher.destroy();
            this._worldDataModelWatcher = undefined;
        }
    }
}