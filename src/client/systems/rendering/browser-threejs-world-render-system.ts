import { WorldRenderSystemImpl } from '../../../openworld/engine/datamodel/services/world/impl/world-render-system-impl';
import { Camera } from '../../../openworld/engine/datamodel/elements/world/camera';
import { Instance } from '../../../openworld/engine/datamodel/elements/core/instance';
import { WorldObject } from '../../../openworld/engine/datamodel/elements/building/world-object';
import { Primitive } from '../../../openworld/engine/datamodel/elements/building/primitive';
import { ThreeJsDataModelCameraProxy } from './threejs-data-model-camera-proxy';
import { World } from '../../../openworld/engine/datamodel/services/world/world';
import { ServiceInstance, InjectInstance } from '../../../openworld/engine/datamodel/internals/services/service-instance';

import * as THREE from 'three';
import { injectable } from 'inversify';
import { SignalConnection } from 'typed-signals';
import { ThreeJsDataModelPrimitiveProxy } from './threejs-data-model-primitive-proxy';

@injectable()
export class BrowserThreeJsWorldRenderSystem extends WorldRenderSystemImpl
{    
    private _world: World;
    private _scene: THREE.Scene = new THREE.Scene();
    private _renderer: THREE.WebGLRenderer;
    private _currentCameraProxy: ThreeJsDataModelCameraProxy | undefined;
    private _currentCameraChangedConnection: SignalConnection;
    private _descendentAddedConnection: SignalConnection;
    private _descendantRemovingConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(@InjectInstance(World) world: ServiceInstance<World>) {
        super();

        this._world = world.instance;

        this._renderer = new THREE.WebGLRenderer({ antialias: false });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);

        this.addThreeSceneToWorld(world.instance, this._scene);

        this._currentCameraChangedConnection =
            this._world.getPropertyChangedSignal('currentCamera')!.connect(this.onWorldCurrentCameraChanged.bind(this));

        this._descendentAddedConnection =
            this._world.descendantAdded.connect(this.onWorldDataModelDescendantAdded.bind(this));

        this._descendantRemovingConnection =
            this._world.descendantRemoving.connect(this.onWorldDataModelDescendantRemoving.bind(this));
    }

    //
    // Methods
    //

    public render(): void {
        if (this._currentCameraProxy !== undefined) {
            this._renderer.render(this._scene, this._currentCameraProxy.threeObject);
        } else {
            this._renderer.clear();
        }
    }

    public destroy(): void {
        this._currentCameraChangedConnection.disconnect();
        this._descendentAddedConnection.disconnect();
        this._descendantRemovingConnection.disconnect();

        this._renderer.dispose();
        this.removeThreeSceneFromWorld(this._world);
    }

    private onWorldCurrentCameraChanged(): void {
        const newCamera = this._world.currentCamera;

        if (this._currentCameraProxy !== undefined && newCamera === this._currentCameraProxy.dataModel) {
            return;
        }

        if (this._currentCameraProxy !== undefined) {
            this._currentCameraProxy.destroy();
            this._currentCameraProxy = undefined;
        }

        if (newCamera !== null) {
            this._currentCameraProxy = new ThreeJsDataModelCameraProxy(newCamera);
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