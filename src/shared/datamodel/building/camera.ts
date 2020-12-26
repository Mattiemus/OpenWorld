import { Instance } from '../core/instance';
import { DataModelClass } from '../internals/metadata/metadata';
import { PropType } from "../internals/metadata/properties/prop-type";

import * as THREE from 'three';

@DataModelClass({
    className: 'Camera',
    parent: Instance,
    attributes: [ 'NotReplicated' ],
    properties: {
        position: {
            name: 'position',
            type: PropType.vector3,
            attributes: []
        },
        rotation: {
            name: 'rotation',
            type: PropType.quaternion,
            attributes: []
        },
        fieldOfView: {
            name: 'fieldOfView',
            type: PropType.number,
            attributes: []
        }
    }
})
export class Camera extends Instance
{
    private _camera: THREE.PerspectiveCamera;

    constructor() {
        super();

        this._camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    }

    public get position(): THREE.Vector3 {
        return this._camera.position;
    }
    public set position(newPosition: THREE.Vector3) {
        this._camera.position.copy(newPosition);
        // TODO: Changed
    }

    public get rotation(): THREE.Quaternion {
        return this._camera.quaternion;
    }
    public set rotation(newRotation: THREE.Quaternion) {
        this._camera.quaternion.copy(newRotation);
        // TODO: Changed
    }

    public get fieldOfView(): number {
        return this._camera.fov;
    }
    public set fieldOfView(newFieldOfView: number) {
        this._camera.fov = newFieldOfView;
        // TODO: Changed
    }
}
