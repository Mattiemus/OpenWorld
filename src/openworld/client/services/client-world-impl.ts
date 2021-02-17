import BrowserContentProviderImpl from '../../client-shared/services/browser/browser-content-provider';
import BrowserWorldImpl from '../../client-shared/services/browser/browser-world-impl';
import PerspectiveCameraProxy from '../../client-shared/services/browser/graphics/proxies/perspective-camera-proxy';
import RenderCanvas from '../../client-shared/services/browser/graphics/render-canvas';
import World from '../../engine/datamodel/services/world';
import { inject, injectable } from 'inversify';
import { SignalConnection } from 'typed-signals';

@injectable()
export default class ClientWorldImpl extends BrowserWorldImpl
{
    private _currentCameraProxy: PerspectiveCameraProxy | null = null;

    private _currentCameraChangedConnection: SignalConnection | null = null;

    //
    // Constructor
    //

    constructor(
        @inject('RenderCanvas') renderCanvas: RenderCanvas,
        @inject('BrowserContentProviderImpl') browserContentProviderImpl: BrowserContentProviderImpl
    ) {
        super(renderCanvas, browserContentProviderImpl);
    }

    //
    // Methods
    //

    protected onAttatch(dataModel: World): void {
        super.onAttatch(dataModel);

        // TODO: Do we need to initialise any existing descendent proxies?

        this._currentCameraChangedConnection =
            dataModel.getPropertyChangedSignal('currentCamera')!.connect(this.onWorldCurrentCameraChanged.bind(this));
    }

    protected onDetatch(): void {
        super.onDetatch();

        if (this._currentCameraChangedConnection !== null) {
            this._currentCameraChangedConnection.disconnect();
            this._currentCameraChangedConnection = null;
        }
    }

    private onWorldCurrentCameraChanged(): void {
        const newCamera = this.currentDataModel!.currentCamera;

        if (this._currentCameraProxy !== null && newCamera === this._currentCameraProxy.dataModel) {
            return;
        }

        if (this._currentCameraProxy !== null) {
            this.renderCanvas.camera = null;

            this._currentCameraProxy.destroy();
            this._currentCameraProxy = null;
        }

        if (newCamera !== null) {
            this._currentCameraProxy = new PerspectiveCameraProxy(newCamera, this.renderCanvas);
            this.renderCanvas.camera = this._currentCameraProxy;
        }
    }
}