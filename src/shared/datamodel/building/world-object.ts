import { Instance } from '../core/instance';
import { DataModelClass } from '../internals/metadata/metadata';
import { PropType } from "../internals/metadata/properties/prop-type";

import * as THREE from 'three';

@DataModelClass({
    className: 'WorldObject',
    parent: Instance,
    attributes: [ 'NotCreatable' ],
    properties: {
        position: {
            name: 'position',
            type: PropType.vector3,
            attributes: []
        },
        scale: {
            name: 'scale',
            type: PropType.vector3,
            attributes: []
        },
        rotation: {
            name: 'rotation',
            type: PropType.quaternion,
            attributes: []
        }
    }
})
export abstract class WorldObject extends Instance
{
    private _scene: THREE.Object3D = new THREE.Object3D();

    constructor() {
        super();
        this._scene.name = this.name;
    }

    //
    // Properties
    //

    public get position(): THREE.Vector3 {
        return this._scene.position;
    }
    public set position(newPosition: THREE.Vector3) {
        this._scene.position.copy(newPosition);
        // TODO: Changed
    }

    public get scale(): THREE.Vector3 {
        return this._scene.scale;
    }
    public set scale(newScale: THREE.Vector3) {
        this._scene.scale.copy(newScale);
        // TODO: Changed
    }

    public get rotation(): THREE.Quaternion {
        return this._scene.quaternion;
    }
    public set rotation(newRotation: THREE.Quaternion) {
        this._scene.quaternion.copy(newRotation);
        // TODO: Changed
    }

    //
    // Methods
    //
    
    protected onNameChanged(newName: string): void {
        super.onNameChanged(newName);
        this._scene.name = this.name;
    }
}