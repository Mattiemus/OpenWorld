import { Camera } from '../../../../engine/datamodel/elements/world/camera';
import { RenderCanvas } from '../render-canvas';
import { ThreeJsDataModelProxy } from './threejs-data-model-proxy';

import { SignalConnection } from 'typed-signals';
import * as THREE from 'three';

export class ThreeJsDataModelCameraProxy extends ThreeJsDataModelProxy<Camera, THREE.PerspectiveCamera>
{
    private _renderCanvasResizeConnection: SignalConnection;
    private _fovChangedConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(dataModel: Camera, private _renderCanvas: RenderCanvas) {
        super(dataModel);

        this.threeObject.aspect = this._renderCanvas.width / this._renderCanvas.height;
        
        this._renderCanvasResizeConnection =
            _renderCanvas.resized.connect(this.onRenderCanvasResized.bind(this));
        
        const fovChangedSignal = dataModel.getPropertyChangedSignal('fieldOfView')!;
        this._fovChangedConnection = fovChangedSignal.connect(this.onDataModelFieldOfViewUpdated.bind(this));
    }

    // 
    // Methods
    //

    public destroy(): void {
        super.destroy();
        this._renderCanvasResizeConnection.disconnect();
        this._fovChangedConnection.disconnect();
    }

    protected createThreeObject(dataModel: Camera): THREE.PerspectiveCamera {
        const camera =
            new THREE.PerspectiveCamera(
                dataModel.fieldOfView,
                1.0,
                dataModel.nearPlane,
                dataModel.farPlane);

        this.copyCFrame(dataModel, camera);

        return camera;
    }

    private onRenderCanvasResized(): void {
        this.threeObject.aspect = this._renderCanvas.width / this._renderCanvas.height;
        this.threeObject.updateProjectionMatrix();
    }

    private onDataModelFieldOfViewUpdated(): void {
        this.threeObject.fov = this.dataModel.fieldOfView;
    }
}
