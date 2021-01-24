import InstanceContext from '../internals/instance-context';
import Light from './light';
import PropertyType from '../internals/metadata/properties/property-type';
import { DataModelClass } from '../internals/metadata/metadata';

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
    // Constructor
    //

    constructor(context: InstanceContext, refId?: string) {
        super(context, refId);
        this.finishConstruction(refId);
    }

    //
    // Properties
    //

    public get range(): number {
        this.throwIfDestroyed();
        return this._range;
    }
    public set range(newValue: number) {
        this.throwIfDestroyed();

        if (this._range === newValue) {
            return;
        }

        this._range = newValue;
        this.firePropertyChanged('range');
    }
}