import Instance from './instance';
import { DataModelClass } from "../internals/metadata/metadata";
import PropertyType from "../internals/metadata/properties/property-type";
import CFrame from '../../math/cframe';

@DataModelClass({
    className: 'WorldObject',
    parent: Instance,
    attributes: [ 'NotCreatable' ],
    properties: {
        cframe: {
            name: 'cframe',
            type: PropertyType.cframe,
            attributes: []
        }
    }
})
export default abstract class WorldObject extends Instance
{
    private _cframe = CFrame.identity;

    //
    // Properties
    //

    public get cframe(): CFrame {
        this.throwIfDestroyed();
        return this._cframe;
    }
    public set cframe(newCFrame: CFrame) {
        this.throwIfDestroyed();

        if (this._cframe.equals(newCFrame)) {
            return;
        }

        this._cframe = newCFrame;
        this.firePropertyChanged('cframe');
    }
}