import WorldImpl from "../../../engine/services/world-impl";
import World from "../../../engine/datamodel/services/world";
import RenderCanvas from "./graphics/render-canvas";
import BrowserContentProviderImpl from "./browser-content-provider";
import { SignalConnection } from "typed-signals";
import Instance from "../../../engine/datamodel/elements/instance";
import Camera from "../../../engine/datamodel/elements/camera";
import Primitive from "../../../engine/datamodel/elements/primitive";
import PointLight from "../../../engine/datamodel/elements/point-light";
import PointLightProxy from './graphics/proxies/point-light-proxy';
import PerspectiveCameraProxy from "./graphics/proxies/perspective-camera-proxy";
import PrimitiveRenderer from "./graphics/primitive-renderer";
import { InstanceProxy } from "./graphics/proxies/instance-proxy";

export default class BrowserWorldImpl extends WorldImpl
{
    private _currentCameraProxy: PerspectiveCameraProxy | null = null;
    private _instanceProxies = new Map<Instance, InstanceProxy<Instance>>();
    private _primitiveRenderer: PrimitiveRenderer | null = null;

    private _currentCameraChangedConnection: SignalConnection | null = null;
    private _descendantAddedConnection: SignalConnection | null = null;
    private _descendantRemovingConnection: SignalConnection | null = null;

    //
    // Constructor
    //

    constructor(private _renderCanvas: RenderCanvas, private _browserContentProviderImpl: BrowserContentProviderImpl) {
        super();
    }

    //
    // Methods
    //

    protected onAttatch(dataModel: World): void {
        super.onAttatch(dataModel);

        this._primitiveRenderer = new PrimitiveRenderer(this._renderCanvas, this._browserContentProviderImpl);

        this._currentCameraChangedConnection =
            dataModel.getPropertyChangedSignal('currentCamera')!.connect(this.onWorldCurrentCameraChanged.bind(this));

        this._descendantAddedConnection =
            dataModel.descendantAdded.connect(this.onDescendantAdded.bind(this));

        this._descendantRemovingConnection =
            dataModel.descendantRemoving.connect(this.onDescendantRemoving.bind(this));
    }

    protected onDetatch(): void {
        super.onDetatch();

        // TODO: Full cleanup       

        if (this._currentCameraChangedConnection !== null) {
            this._currentCameraChangedConnection.disconnect();
            this._currentCameraChangedConnection = null;
        }

        if (this._descendantAddedConnection !== null) {
            this._descendantAddedConnection.disconnect();
            this._descendantAddedConnection = null;
        }

        if (this._descendantRemovingConnection !== null) {
            this._descendantRemovingConnection.disconnect();
            this._descendantRemovingConnection = null;
        }
    }

    private onWorldCurrentCameraChanged(): void {
        const newCamera = this.currentDataModel!.currentCamera;

        if (this._currentCameraProxy !== null && newCamera === this._currentCameraProxy.dataModel) {
            return;
        }

        if (this._currentCameraProxy !== null) {
            this._renderCanvas.camera = null;

            this._currentCameraProxy.destroy();
            this._currentCameraProxy = null;
        }

        if (newCamera !== null) {
            this._currentCameraProxy = new PerspectiveCameraProxy(newCamera, this._renderCanvas);
            this._renderCanvas.camera = this._currentCameraProxy;
        }
    }

    private onDescendantAdded(descendant: Instance): void {
        if (descendant instanceof Camera) {
            // No-op: We only care about the current camera
            return;
        }

        if (descendant instanceof Primitive) {  
            if (this._primitiveRenderer !== null) {          
                this._primitiveRenderer.addPrimitive(descendant);
            }

            return;
        }

        if (descendant instanceof PointLight) {
            const proxy = new PointLightProxy(descendant);
            this._instanceProxies.set(descendant, proxy);
            this._renderCanvas.scene.add(proxy);  
            return;      
        }
    }

    private onDescendantRemoving(descendant: Instance): void {
        if (descendant instanceof Camera) {
            // No-op: We only care about the current camera
            return;
        }

        if (descendant instanceof Primitive) {
            if (this._primitiveRenderer !== null) {
                this._primitiveRenderer.removePrimitive(descendant);
            }

            return;
        }

        if (descendant instanceof PointLight) {
            const proxy = this._instanceProxies.get(descendant);
            if (proxy !== undefined) {
                proxy.destroy();
                this._instanceProxies.delete(descendant);
            }
        }
    }
}