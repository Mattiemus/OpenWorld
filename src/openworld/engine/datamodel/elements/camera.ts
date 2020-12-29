import CFrame from '../../math/cframe';
import { DataModelClass } from "../internals/metadata/metadata";
import Instance from './instance';
import PropType from '../internals/metadata/properties/types/prop-type';
import MathEx from '../../math/mathex';

@DataModelClass({
    className: 'Camera',
    parent: Instance,
    attributes: [ 'NotReplicated' ],
    properties: {
        cframe: {
            name: 'cframe',
            type: PropType.cframe,
            attributes: [ 'NotReplicated' ]
        },
        fieldOfView: {
            name: 'fieldOfView',
            type: PropType.number,
            attributes: [ 'NotReplicated' ]
        },
        nearPlane: {
            name: 'nearPlane',
            type: PropType.number,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        farPlane: {
            name: 'farPlane',
            type: PropType.number,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        }
    }
})
export default class Camera extends Instance
{
    private _cframe = CFrame.identity;
    private _fieldOfView = 70.0;

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

    public get fieldOfView(): number {
        return this._fieldOfView;
    }
    public set fieldOfView(newFieldOfView: number) {
        if (MathEx.isApproxEqual(this._fieldOfView, newFieldOfView)) {
            return;
        }

        this._fieldOfView = newFieldOfView;
        this.processChangedProperty('fieldOfView');
    }

    public get nearPlane(): number {
        return 0.1;
    }

    public get farPlane(): number {
        return 1000;
    }
}
