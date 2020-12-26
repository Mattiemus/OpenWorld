import { WorldRenderSystemImpl } from '../../../openworld/engine/datamodel/services/world/impl/world-render-system-impl';

import * as THREE from 'three';
import { injectable } from 'inversify';

@injectable()
export class BrowserThreeJsWorldRenderSystem extends WorldRenderSystemImpl
{
    private _scene: THREE.Scene = new THREE.Scene();
    private _renderer: THREE.WebGLRenderer;
    private _camera: THREE.Camera | undefined = undefined;

    //
    // Constructor
    //

    constructor() {
        super();

        this._renderer = new THREE.WebGLRenderer({ antialias: false });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);
    }

    //
    // Properties
    //

    public get scene(): THREE.Scene {
        return this._scene;
    }

    public get camera(): THREE.Camera | undefined {
        return this._camera;
    }
    public set camera(newCamera: THREE.Camera | undefined) {
        this._camera = newCamera;
    }

    public render(): void {
        if (this._camera === undefined) {
            this._renderer.clear();
        } else {
            this._renderer.render(this._scene, this._camera);
        }
    }

    //
    // Methods
    //

    public destroy(): void {
        this._renderer.dispose();
    }
}