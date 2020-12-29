import PropertyType from "../internals/metadata/properties/property-type";
import { DataModelClass } from "../internals/metadata/metadata";
import Light from "./light";

@DataModelClass({
    className: 'PointLight',
    parent: Light,
    attributes: [],
    properties: {
        range: {
            name: 'range',
            type: PropertyType.number,
            attributes: []
        }
    }
})
export default class PointLight extends Light
{
    private _range: number = 5;
    
    //
    // Properties
    //

    public get range(): number {
        return this._range;
    }
    public set range(newRange: number) {
        if (this._range === newRange) {
            return;
        }

        this._range = newRange;
        this.processChangedProperty('range');
    }
}