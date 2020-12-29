import PropertyType from "../internals/metadata/properties/property-type";
import WorldObject from './world-object';
import { DataModelClass } from "../internals/metadata/metadata";
import Color3 from '../../math/color3';

@DataModelClass({
    className: 'Light',
    parent: WorldObject,
    attributes: [ 'NotCreatable' ],
    properties: {
        brightness: {
            name: 'brightness',
            type: PropertyType.number,
            attributes: []
        },
        color: {
            name: 'color',
            type: PropertyType.color3,
            attributes: []
        },
        castsShadows: {
            name: 'castsShadows',
            type: PropertyType.boolean,
            attributes: []
        }
    }
})
export default abstract class Light extends WorldObject
{
    private _brightness: number = 1;
    private _color: Color3 = Color3.white;
    private _castsShadows: boolean = true;
    
    //
    // Properties
    //

    public get brightness(): number {
        return this._brightness;
    }
    public set brightness(newBrightness: number) {
        if (this._brightness === newBrightness) {
            return;
        }

        this._brightness = newBrightness;
        this.processChangedProperty('brightness');
    }

    public get color(): Color3 {
        return this._color;
    }
    public set color(newColor: Color3) {
        if (this._color === newColor) {
            return;
        }

        this._color = newColor;
        this.processChangedProperty('color');
    }

    public get castsShadows(): boolean {
        return this._castsShadows;
    }
    public set castsShadows(newCastsShadows: boolean) {
        if (this._castsShadows === newCastsShadows) {
            return;
        }

        this._castsShadows = newCastsShadows;
        this.processChangedProperty('castsShadows');
    }
}