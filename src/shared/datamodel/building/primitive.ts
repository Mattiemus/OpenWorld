import { DataModelClass } from '../internals/metadata/metadata';
import { PropType } from "../internals/metadata/properties/prop-type";
import { WorldObject } from './world-object';

import * as THREE from 'three';

export enum PrimitiveType {
    Cube = 'Cube',
    Sphere = 'Sphere'
}

@DataModelClass({
    className: 'Primitive',
    parent: WorldObject,
    attributes: [],
    properties: {
        type: {
            name: 'type',
            type: PropType.enum(PrimitiveType),
            attributes: []
        }
    }
})
export class Primitive extends WorldObject
{
    private _primType: PrimitiveType = PrimitiveType.Cube;
    private _mesh: THREE.Mesh = new THREE.Mesh();

    constructor() {
        super();
        this['_scene'].add(this._mesh);
        this.updateGeometry();
    }

    //
    // Properties
    //

    public get type(): PrimitiveType {
        return this._primType;
    }
    public set type(newPrimitiveType: PrimitiveType) {
        if (this._primType === newPrimitiveType) {
            return;
        }

        this._primType = newPrimitiveType;
        this.updateGeometry();

        this.firePropertyChanged('type');
        this.onPropertyChanged('type');
    }

    //
    // Methods
    //

    private updateGeometry(): void {
        this._mesh.geometry = Primitive.createGeometry(this._primType);

        // TODO: Support some kind of SurfaceDefinition class
        this._mesh.material = new THREE.MeshNormalMaterial();
    }

    private static createGeometry(primType: PrimitiveType): THREE.Geometry {
        switch (primType) {
            case PrimitiveType.Cube:
                return new THREE.BoxGeometry(1, 1, 1);
            case PrimitiveType.Sphere:
                return new THREE.SphereGeometry(0.5);
        }

        throw new Error(`Unknown primitive type "${primType}"`);
    }
}