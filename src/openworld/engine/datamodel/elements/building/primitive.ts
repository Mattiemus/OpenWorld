import { DataModelClass } from '../../internals/metadata/metadata';
import { PropType } from "../../internals/metadata/properties/prop-type";
import { WorldObject } from './world-object';

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
}