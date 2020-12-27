import { WorldRenderSystemImpl } from '../../../openworld/engine/datamodel/services/world/impl/world-render-system-impl';
import { Camera } from '../../../openworld/engine/datamodel/elements/world/camera';
import { Instance } from '../../../openworld/engine/datamodel/elements/core/instance';
import { WorldObject } from '../../../openworld/engine/datamodel/elements/building/world-object';
import { Primitive } from '../../../openworld/engine/datamodel/elements/building/primitive';

import * as THREE from 'three';
import { injectable } from 'inversify';
import { Signal, SignalConnection } from 'typed-signals';

@injectable()
export class BrowserThreeJsWorldRenderSystem extends WorldRenderSystemImpl
{    
    private _scene: THREE.Scene = new THREE.Scene();
    private _renderer: THREE.WebGLRenderer;
    private _camera: THREE.Camera;

    private _currentCamera: Camera;
    private _currentCameraChanged = new Signal<() => void>();
    private _currentCameraPropChanged: SignalConnection;

    //
    // Constructor
    //

    constructor() {
        super();

        this._renderer = new THREE.WebGLRenderer({ antialias: false });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);

        this._currentCamera = new Camera();
        //this._currentCamera.parent;
        this._currentCameraPropChanged = this._currentCamera.propertyChanged.connect(this.onCurrentCameraPropertyChanged);
        this._camera = this.getOrCreateCachedThreeJsCamera(this._currentCamera);
        this.updateCameraPositionRotation();
    }

    //
    // Events
    //

    public get currentCameraChanged(): Signal<() => void> {
        return this._currentCameraChanged;
    }

    //
    // Properties
    //

    public get currentCamera(): Camera {
        return this._currentCamera;
    }

    public set currentCamera(newCamera: Camera) {
        if (this._currentCamera === newCamera) {
            return;
        }
        
        this._currentCameraPropChanged.disconnect();

        // TODO
        //if (newCamera.parent === null) {
        //    newCamera.parent = this;
        //}

        this._currentCamera = newCamera;
        this._currentCameraPropChanged = this._currentCamera.propertyChanged.connect(this.onCurrentCameraPropertyChanged);        
        this._camera = this.getOrCreateCachedThreeJsCamera(newCamera);
        this.updateCameraPositionRotation();

        this.fireCurrentCameraChanged();
    }

    //
    // Methods
    //

    public onInstanceRemovedFromWorld(child: Instance): void {
        if (child instanceof WorldObject) {
            const childScene = this.getCachedThreeJsScene(child);
            if (childScene !== undefined) {
                this._scene.remove(childScene);
            }
        }
    }

    public onInstanceAddedToWorld(child: Instance): void {
        if (child instanceof WorldObject) {
            const childScene = this.getOrCreateCachedThreeJsScene(child);
            this._scene.add(childScene);
        }
    }

    public render(): void {
        if (this._camera === undefined) {
            this._renderer.clear();
        } else {
            this._renderer.render(this._scene, this._camera);
        }
    }

    public destroy(): void {
        this._renderer.dispose();
    }

    private fireCurrentCameraChanged(): void {
        this._currentCameraChanged.emit();
    }

    private onCurrentCameraPropertyChanged = (propertyName: string): void => {
        if (propertyName === 'cframe') {
            this.updateCameraPositionRotation();
        }
    }

    private getCachedThreeJsCamera(camera: Camera): THREE.PerspectiveCamera | undefined {
        const unsafeCamera = camera as any;

        const cachedCamera = unsafeCamera['__cachedCamera'] as THREE.PerspectiveCamera | undefined;
        return cachedCamera;
    }

    private getOrCreateCachedThreeJsCamera(camera: Camera): THREE.PerspectiveCamera {
        const cachedCamera = this.getCachedThreeJsCamera(camera);
        if (cachedCamera !== undefined) {
            return cachedCamera;
        }

        const unsafeCamera = camera as any;

        const createdCamera = new THREE.PerspectiveCamera(camera.fieldOfView, window.innerWidth / window.innerHeight, 0.1, 1000);
        unsafeCamera['__cachedCamera'] = createdCamera;

        return createdCamera;
    }

    private getCachedThreeJsScene(obj: WorldObject): THREE.Scene | undefined {
        const unsafeObj = obj as any;

        const cachedScene = unsafeObj['__cachedScene'] as THREE.Scene | undefined;
        return cachedScene;
    }

    private getOrCreateCachedThreeJsScene(obj: WorldObject): THREE.Scene {
        const cachedScene = this.getCachedThreeJsScene(obj);
        if (cachedScene !== undefined) {
            return cachedScene;
        }

        const unsafeObj = obj as any;

        const createdScene = new THREE.Scene();
        createdScene.position.set(
            obj.cframe.x,
            obj.cframe.y,
            obj.cframe.z);

            createdScene.quaternion.set(
            obj.cframe.qx,
            obj.cframe.qy,
            obj.cframe.qz,
            obj.cframe.qw);

        if (obj instanceof Primitive) {

            const mesh =
                new THREE.Mesh(
                    new THREE.BoxGeometry(1, 1, 1),
                    new THREE.MeshNormalMaterial()
                );

            createdScene.add(mesh);

        }

        unsafeObj['__cachedScene'] = createdScene;

        return createdScene;
    }

    private updateCameraPositionRotation(): void {
        const threeCamera = this._camera;

        threeCamera.position.set(
            this._currentCamera.cframe.x,
            this._currentCamera.cframe.y,
            this._currentCamera.cframe.z);

        threeCamera.quaternion.set(
            this._currentCamera.cframe.qx,
            this._currentCamera.cframe.qy,
            this._currentCamera.cframe.qz,
            this._currentCamera.cframe.qw);
    }


}