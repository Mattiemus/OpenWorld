import PropertyType from "../internals/metadata/properties/property-type";
import WorldObject from './world-object';
import { DataModelClass } from "../internals/metadata/metadata";
import Material from '../data-types/material';
import Color3 from '../../math/color3';

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
            type: PropertyType.enum(PrimitiveType),
            attributes: []
        },
        material: {
            name: 'material',
            type: PropertyType.materialProperties,
            attributes: []
        }
    }
})
export default class Primitive extends WorldObject
{
    private _primType: PrimitiveType = PrimitiveType.Cube;
    private _material: Material =
        Material.createBasic(Color3.white);
    
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
        this.firePropertyChanged('type');
    }

    public get material(): Material {
        return this._material;
    }
    public set material(newMaterial: Material) {
        if (this._material === newMaterial) {
            return;
        }

        this._material = newMaterial;
        this.firePropertyChanged('material');
    }
}