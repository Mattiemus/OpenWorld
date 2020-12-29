import Camera from '../../../../../engine/datamodel/elements/camera';
import Instance from '../../../../../engine/datamodel/elements/instance';
import Primitive from '../../../../../engine/datamodel/elements/primitive';
import PointLight from '../../../../../engine/datamodel/elements/point-light';
import World from '../../../../../engine/datamodel/services/world';
import RenderCanvas from '../render-canvas';
import ServiceBase from '../../../../../engine/services/base/service-base';
import ThreeJsDataModelCameraProxy from './threejs-data-model-camera-proxy';
import ThreeJsDataModelPrimitiveProxy from './threejs-data-model-primitive-proxy';
import ThreeJsDataModelPointLightProxy from './threejs-data-model-point-light-proxy';
import CFrame from '../../../../../engine/math/cframe';
import ThreeJsDataModelProxy from './threejs-data-model-proxy';

import * as THREE from 'three';
import { SignalConnection } from 'typed-signals';

export default class WorldDataModelProxy extends ServiceBase
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

        if (child instanceof PointLight) {
            const proxy = new ThreeJsDataModelPointLightProxy(child);
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

    private addProxyToDataModel<TDataModel extends Instance & { cframe: CFrame; }, TThreeObject extends THREE.Object3D>(dataModel: Instance, proxy: ThreeJsDataModelProxy<TDataModel, TThreeObject>): void {
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