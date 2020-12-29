import PropertyType from "../internals/metadata/properties/property-type";
import WorldObject from './world-object';
import { DataModelClass } from "../internals/metadata/metadata";
import MaterialProperties from '../data-types/MaterialProperties';
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
        materialProperties: {
            name: 'materialProperties',
            type: PropertyType.materialProperties,
            attributes: []
        }
    }
})
export default class Primitive extends WorldObject
{
    private _primType: PrimitiveType = PrimitiveType.Cube;
    private _materialProperties: MaterialProperties =
        MaterialProperties.createBasicColor(Color3.white);
    
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
        this.processChangedProperty('type');
    }

    public get materialProperties(): MaterialProperties {
        return this._materialProperties;
    }
    public set materialProperties(newMaterialProperties: MaterialProperties) {
        if (this._materialProperties === newMaterialProperties) {
            return;
        }

        this._materialProperties = newMaterialProperties;
        this.processChangedProperty('materialProperties');
    }
}