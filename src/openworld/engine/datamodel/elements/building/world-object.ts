import { Instance } from '../core/instance';
import { DataModelClass } from '../../internals/metadata/metadata';
import { PropType } from "../../internals/metadata/properties/prop-type";
import { CFrame } from '../../../math/cframe';

@DataModelClass({
    className: 'WorldObject',
    parent: Instance,
    attributes: [ 'NotCreatable' ],
    properties: {
        cframe: {
            name: 'cframe',
            type: PropType.cframe,
            attributes: []
        }
    }
})
export abstract class WorldObject extends Instance
{
    private _cframe = CFrame.identity;

    //
    // Properties
    //

    public get cframe(): CFrame {
        return this._cframe;
    }
    public set cframe(newCFrame: CFrame) {
        if (this._cframe === newCFrame) {
            return;
        }

        this._cframe = newCFrame;
        this.processChangedProperty('cframe');
    }
}