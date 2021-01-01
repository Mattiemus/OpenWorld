import Instance from '../elements/instance';
import { DataModelClass } from "../internals/metadata/metadata";
import LightingImpl from '../../services/lighting-impl';
import Color3 from '../../math/color3';
import PropertyType from '../internals/metadata/properties/property-type';
import InstanceContext from '../internals/instance-context';

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

    constructor(context: InstanceContext) {
        super(context);
        
        this._impl = context.getServiceImpl(LightingImpl);
        this._impl.attatch(this);
    }

    //
    // Properties
    //

    public get ambient(): Color3 {
        this.throwIfDestroyed();

        return this._ambient;
    }
    public set ambient(newAmbient: Color3) {
        this.throwIfDestroyed();

        if (this._ambient.equals(newAmbient)) {
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