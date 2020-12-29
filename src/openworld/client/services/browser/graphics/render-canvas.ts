import ServiceBase from '../../../../engine/services/base/service-base';
import getElementSize from "../../../utils/get-element-size";

import * as THREE from 'three';
import { Signal } from "typed-signals";

export default class RenderCanvas extends ServiceBase
{
    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene = new THREE.Scene();
    private _camera: THREE.PerspectiveCamera | undefined = undefined;    
    
    private _resized = new Signal<() => void>();

    //
    // Constructor
    //

    constructor(private _canvas: HTMLCanvasElement) {
        super();
        
        this._renderer = new THREE.WebGLRenderer({ canvas: _canvas, antialias: false });
        
        window.addEventListener('resize', this.handleResize, false);
        this.handleResize();
    }

    //
    // Signals
    //

    public get resized(): Signal<() => void> {
        return this._resized;
    }

    //
    // Properties
    //

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get width(): number {
        return this.canvas.width;
    }

    public get height(): number {
        return this.canvas.height;
    }

    public get renderer(): THREE.WebGLRenderer {
        return this._renderer;
    }

    public get scene(): THREE.Scene {
        return this._scene;
    }

    public get camera(): THREE.PerspectiveCamera | undefined {
        return this._camera;
    }
    public set camera(newCamera: THREE.PerspectiveCamera | undefined) {
        this._camera = newCamera;
    }

    //
    // Methods
    //
    
    public render(): void {
        if (this._camera !== undefined) {
            this._renderer.render(this._scene, this._camera);
        } else {
            this._renderer.clear();
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        
        this._renderer.dispose();

        window.removeEventListener('resize', this.handleResize, false);
        this._resized.disconnectAll();
    }

    private handleResize = (): void => {
        const parent = this._canvas.parentElement;    
        if (parent === null) {
            return;
        }
    
        const [newWidth, newHeight] = getElementSize(parent);

        if (newWidth !== this.width || newHeight !== this.height) {
            this._canvas.width = newWidth;
            this._canvas.height = newHeight;
            
            this._renderer.setSize(newWidth, newHeight);
            
            this._resized.emit();
        }
    }
}