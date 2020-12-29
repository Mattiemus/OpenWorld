import { Camera } from '../../../engine/datamodel/elements/world/camera';
import { Instance } from '../../../engine/datamodel/elements/core/instance';
import { Primitive } from '../../../engine/datamodel/elements/building/primitive';
import { ThreeJsDataModelCameraProxy } from '../rendering/proxies/threejs-data-model-camera-proxy';
import { World } from '../../../engine/datamodel/services/world/world';
import { ThreeJsDataModelPrimitiveProxy } from '../rendering/proxies/threejs-data-model-primitive-proxy';
import { RenderCanvas } from '../rendering/render-canvas';
import { ServiceBase } from '../../../engine/services/service-base';

import * as THREE from 'three';
import { SignalConnection } from 'typed-signals';

export class WorldDataModelWatcher extends ServiceBase
{
    private _currentCameraProxy: ThreeJsDataModelCameraProxy | undefined;
    private _currentCameraChangedConnection: SignalConnection;
    private _descendentAddedConnection: SignalConnection;
    private _descendantRemovingConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(private _world: World, private _renderCanvas: RenderCanvas)
    {
        super();

        this.addThreeSceneToWorld(_world, _renderCanvas.scene);

        this._currentCameraChangedConnection =
            _world.getPropertyChangedSignal('currentCamera')!.connect(this.onWorldCurrentCameraChanged.bind(this));

        this._descendentAddedConnection =
            _world.descendantAdded.connect(this.onWorldDataModelDescendantAdded.bind(this));

        this._descendantRemovingConnection =
            _world.descendantRemoving.connect(this.onWorldDataModelDescendantRemoving.bind(this));
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        this._currentCameraChangedConnection.disconnect();
        this._descendentAddedConnection.disconnect();
        this._descendantRemovingConnection.disconnect();

        this.removeThreeSceneFromWorld(this._world);
    }

    private onWorldCurrentCameraChanged(): void {
        const newCamera = this._world.currentCamera;

        if (this._currentCameraProxy !== undefined && newCamera === this._currentCameraProxy.dataModel) {
            return;
        }

        if (this._currentCameraProxy !== undefined) {
            this._renderCanvas.camera = undefined;

            this._currentCameraProxy.destroy();
            this._currentCameraProxy = undefined;
        }

        if (newCamera !== null) {
            this._currentCameraProxy = new ThreeJsDataModelCameraProxy(newCamera, this._renderCanvas);
            this._renderCanvas.camera = this._currentCameraProxy.threeObject;
        }
    }

    private onWorldDataModelDescendantAdded(child: Instance): void {
        if (child instanceof Camera) {
            // No-op: We only care about the current camera
            return;
        }

        if (child instanceof Primitive) {
            const proxy = new ThreeJsDataModelPrimitiveProxy(child);
            this.addProxyToDataModel(child, proxy);
        }
    }

    private onWorldDataModelDescendantRemoving(child: Instance): void {
        if (child instanceof Camera) {
            // No-op: We only care about the current camera
            return;
        }

        if (child instanceof Primitive) {
            this.removeProxyFromDataModel(child);
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

    private addProxyToDataModel(dataModel: Instance, proxy: ThreeJsDataModelPrimitiveProxy): void {
        const unsafeDataModel = dataModel as any;
        unsafeDataModel.__threeProxy = proxy;
    }
    
    private removeProxyFromDataModel(dataModel: Instance): boolean {
        const unsafeDataModel = dataModel as any;
        if (unsafeDataModel.__threeProxy !== undefined) {
            delete unsafeDataModel.__threeProxy;
            return true;
        }

        return false;
    }
}