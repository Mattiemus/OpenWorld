import { Camera } from '../../../openworld/engine/datamodel/elements/world/camera';
import { SignalConnection } from 'typed-signals';
import { ThreeJsDataModelProxy } from './threejs-data-model-proxy';

import * as THREE from 'three';

export class ThreeJsDataModelCameraProxy extends ThreeJsDataModelProxy<Camera, THREE.PerspectiveCamera>
{
    private _fovChangedConnection: SignalConnection;

    constructor(dataModel: Camera) {
        super(dataModel);
        
        const fovChangedSignal = dataModel.getPropertyChangedSignal('fieldOfView')!;
        this._fovChangedConnection = fovChangedSignal.connect(this.onDataModelFieldOfViewUpdated.bind(this));
    }

    // 
    // Methods
    //

    public destroy(): void {
        super.destroy();
        this._fovChangedConnection.disconnect();
    }

    protected createThreeObject(dataModel: Camera): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(dataModel.fieldOfView, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.copyCFrame(dataModel, camera);
        camera.fov = dataModel.fieldOfView;
        return camera;
    }

    private onDataModelFieldOfViewUpdated(): void {
        this.threeObject.fov = this.dataModel.fieldOfView;
    }
}
