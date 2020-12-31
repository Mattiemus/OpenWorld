import Instance from '../elements/instance';
import { DataModelClass } from "../internals/metadata/metadata";
import LightingImpl from '../../services/lighting-impl';
import Color3 from '../../math/color3';
import PropertyType from '../internals/metadata/properties/property-type';

@DataModelClass({
    className: 'Lighting',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable' ],
    properties: {
        ambient: {
            name: 'ambient',
            type: PropertyType.color3,
            attributes: []
        }
    }
})
export default class Lighting extends Instance
{
    private _impl: LightingImpl;

    private _ambient: Color3 = Color3.black;

    constructor() {
        super();
        
        this._impl = Lighting._getServiceImpl(LightingImpl);
        this._impl.attatch(this);
    }

    //
    // Properties
    //

    public get ambient(): Color3 {
        return this._ambient;
    }
    public set ambient(newAmbient: Color3) {
        if (this._ambient === newAmbient) {
            return;
        }

        this._ambient = newAmbient;
        this.firePropertyChanged('ambient');
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();        
        this._impl.detatch(this);
    }
}