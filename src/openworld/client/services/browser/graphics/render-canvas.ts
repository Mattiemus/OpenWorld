import ServiceBase from '../../../../engine/services/base/service-base';
import getElementSize from "../../../utils/get-element-size";
import SkyProxy from './proxies/sky-proxy';

import * as THREE from 'three';
import { Signal } from "typed-signals";
import { injectable } from 'inversify';

@injectable()
export default class RenderCanvas extends ServiceBase
{
    private _renderer: THREE.WebGLRenderer | null = null;
    private _scene: THREE.Scene = new THREE.Scene();
    private _camera: THREE.PerspectiveCamera | null = null;    
    private _skybox: SkyProxy | null = null;
    
    private _resized = new Signal<() => void>();
    private _canvasChanged = new Signal<(oldCanvas: HTMLCanvasElement | null, newCanvas: HTMLCanvasElement | null) => void>();

    //
    // Constructor
    //

    constructor() {
        super();        
        window.addEventListener('resize', this.handleResize, false);
    }

    //
    // Signals
    //

    public get resized(): Signal<() => void> {
        return this._resized;
    }

    public get canvasChanged(): Signal<(oldCanvas: HTMLCanvasElement | null, newCanvas: HTMLCanvasElement | null) => void> {
        return this._canvasChanged;
    }
    
    //
    // Properties
    //

    public get canvas(): HTMLCanvasElement | null {
        if (this._renderer === null) {
            return null;
        }

        return this._renderer.domElement;
    }
    public set canvas(newCanvas: HTMLCanvasElement | null) {
        let oldCanvas: HTMLCanvasElement | null = null;
        if (this._renderer !== null) {
            oldCanvas = this._renderer.domElement;
        }

        this.destroyRenderer();

        if (newCanvas !== null) {
            this.createRenderer(newCanvas);
        }

        this._canvasChanged.emit(oldCanvas, newCanvas);
    }

    public get width(): number {
        if (this.canvas === null) {
            return 0;
        }

        return this.canvas.width;
    }

    public get height(): number {
        if (this.canvas === null) {
            return 0;
        }

        return this.canvas.height;
    }

    public get scene(): THREE.Scene {
        return this._scene;
    }

    public get camera(): THREE.PerspectiveCamera | null {
        return this._camera;
    }
    public set camera(newCamera: THREE.PerspectiveCamera | null) {
        this._camera = newCamera;
    }

    public get skybox(): SkyProxy | null {
        return this._skybox;
    }
    public set skybox(newSkybox: SkyProxy | null) {
        if (this._skybox === newSkybox) {
            return;
        }

        if (this._skybox !== null) {
            this._skybox.destroy();            
            this._skybox = null;
        }

        this._skybox = newSkybox;

        if (newSkybox !== null) {
            this._scene.add(newSkybox);
        }
    }

    //
    // Methods
    //
    
    public render(): void {
        if (this._renderer === null) {
            return;
        }

        if (this._camera !== null) {
            this._renderer.render(this._scene, this._camera);
        } else {
            this._renderer.clear();
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        
        this.destroyRenderer();

        window.removeEventListener('resize', this.handleResize, false);
        this._resized.disconnectAll();
    }

    private handleResize = (): void => {
        if (this._renderer === null || this.canvas === null) {
            return;
        }

        const parent = this.canvas.parentElement;    
        if (parent === null) {
            return;
        }
    
        const [newWidth, newHeight] = getElementSize(parent);

        if (newWidth !== this.width || newHeight !== this.height) {
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
            
            this._renderer.setSize(newWidth, newHeight);
            
            this._resized.emit();
        }
    }

    private createRenderer(canvas: HTMLCanvasElement): void {
        this._renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
        this._renderer.shadowMap.enabled = true;
        
        this.handleResize();
    }

    private destroyRenderer(): void {
        if (this._renderer !== null) {
            this._renderer.dispose();
            this._renderer = null;
        }
    }
}