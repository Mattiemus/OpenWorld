import { IDestroyable } from '../../../../../engine/utils/interfaces';
import Camera from '../../../../../engine/datamodel/elements/camera';
import RenderCanvas from '../render-canvas';

import * as THREE from 'three';
import { SignalConnection } from 'typed-signals';

export default class PerspectiveCameraProxy extends THREE.PerspectiveCamera implements IDestroyable
{
    private _renderCanvasResizeConnection: SignalConnection;
    private _fovChangedConnection: SignalConnection;
    private _cframeChangedConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(private _camera: Camera, private _renderCanvas: RenderCanvas) {
        // Create
        super(_camera.fieldOfView, 1.0, _camera.nearPlane, _camera.farPlane);
        this.onRenderCanvasResized();
        this.onDataModelCFrameChanged();

        // Hookup listeners
        this._renderCanvasResizeConnection =
            _renderCanvas.resized.connect(this.onRenderCanvasResized.bind(this));
        
        const fovChangedSignal = _camera.getPropertyChangedSignal('fieldOfView')!;
        this._fovChangedConnection = fovChangedSignal.connect(this.onDataModelFieldOfViewChanged.bind(this));

        const cframeChangedSignal = _camera.getPropertyChangedSignal('cframe')!;
        this._cframeChangedConnection = cframeChangedSignal.connect(this.onDataModelCFrameChanged.bind(this));
    }

    //
    // Properties
    //

    public get dataModel(): Camera {
        return this._camera;
    }

    //
    // Methods
    //
    
    public destroy(): void {
        if (this.parent !== null) {
            this.parent.remove(this);
        }

        this._renderCanvasResizeConnection.disconnect();
        this._fovChangedConnection.disconnect();
        this._cframeChangedConnection.disconnect();
    }

    private onRenderCanvasResized(): void {
        this.aspect = this._renderCanvas.width / this._renderCanvas.height;
        this.updateProjectionMatrix();
    }

    private onDataModelFieldOfViewChanged(): void {
        this.fov = this._camera.fieldOfView;
    }

    private onDataModelCFrameChanged(): void {
        this.position.set(
            this._camera.cframe.x,
            this._camera.cframe.y,
            this._camera.cframe.z);

        this.quaternion.set(
            this._camera.cframe.qx,
            this._camera.cframe.qy,
            this._camera.cframe.qz,
            this._camera.cframe.qw);

        this._renderCanvas.skybox.position.set(
            this._camera.cframe.x,
            this._camera.cframe.y,
            this._camera.cframe.z);
    }
}