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
import { IDestroyable } from "../../../engine/utils/interfaces";
import PerspectiveCameraProxy from "./graphics/proxies/perspective-camera-proxy";
import WorldPrimitiveRenderer from "./graphics/world-primitive-renderer";

import * as THREE from 'three';

export default class BrowserWorldImpl extends WorldImpl
{
    private _currentCameraProxy: PerspectiveCameraProxy | null = null;
    private _instanceProxies = new Map<Instance, THREE.Object3D & IDestroyable>();
    private _primitiveRenderer: WorldPrimitiveRenderer;

    private _currentCameraChangedConnection: SignalConnection | null = null;
    private _descendentAddedConnection: SignalConnection | null = null;
    private _descendantRemovingConnection: SignalConnection | null = null;

    //
    // Constructor
    //

    constructor(private _renderCanvas: RenderCanvas, private _browserContentProviderImpl: BrowserContentProviderImpl) {
        super();

        // TODO
        this._primitiveRenderer = new WorldPrimitiveRenderer(this._renderCanvas, this._browserContentProviderImpl);
    }

    //
    // Methods
    //

    protected onAttatch(dataModel: World): void {
        super.onAttatch(dataModel);

        this.addThreeSceneToWorld(dataModel, this._renderCanvas.scene);

        this._currentCameraChangedConnection =
            dataModel.getPropertyChangedSignal('currentCamera')!.connect(this.onWorldCurrentCameraChanged.bind(this));

        this._descendentAddedConnection =
            dataModel.descendantAdded.connect(this.onWorldDataModelDescendantAdded.bind(this));

        this._descendantRemovingConnection =
            dataModel.descendantRemoving.connect(this.onWorldDataModelDescendantRemoving.bind(this));
    }

    protected onDetatch(): void {
        super.onDetatch();

        if (this._currentCameraChangedConnection !== null) {
            this._currentCameraChangedConnection.disconnect();
            this._currentCameraChangedConnection = null;
        }

        if (this._descendentAddedConnection !== null) {
            this._descendentAddedConnection.disconnect();
            this._descendentAddedConnection = null;
        }

        if (this._descendantRemovingConnection !== null) {
            this._descendantRemovingConnection.disconnect();
            this._descendantRemovingConnection = null;
        }

        this.removeThreeSceneFromWorld(this.currentDataModel!);
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

    private onWorldDataModelDescendantAdded(child: Instance): void {
        if (child instanceof Camera) {
            // No-op: We only care about the current camera
            return;
        }

        if (child instanceof Primitive) {            
            this._primitiveRenderer.addPrimitive(child);
            return;
        }

        if (child instanceof PointLight) {
            const proxy = new PointLightProxy(child);
            this._instanceProxies.set(child, proxy);
            this._renderCanvas.scene.add(proxy);  
            return;      
        }
    }

    private onWorldDataModelDescendantRemoving(child: Instance): void {
        if (child instanceof Camera) {
            // No-op: We only care about the current camera
            return;
        }

        if (child instanceof Primitive) {
            this._primitiveRenderer.removePrimitive(child);
            return;
        }

        if (child instanceof PointLight) {
            const proxy = this._instanceProxies.get(child);
            if (proxy !== undefined) {
                proxy.destroy();
                this._instanceProxies.delete(child);
            }
        }
    }

    private addThreeSceneToWorld(dataModel: World, threeScene: THREE.Scene): void {
        const unsafeDataModel = dataModel as any;
        unsafeDataModel.__cachedThreeObject = threeScene;     
    }
    
    private removeThreeSceneFromWorld(dataModel: World): boolean {
        const unsafeDataModel = dataModel as any;
        if (unsafeDataModel.__cachedThreeObject !== undefined) {
            delete unsafeDataModel.__cachedThreeObject;
            return true;
        }

        return false;
    }
}