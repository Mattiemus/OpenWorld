import CFrame from '../../math/cframe';
import Instance from './instance';
import InstanceContext from '../context/instance-context';
import MathEx from '../../math/mathex';
import PropertyType from '../metadata/properties/property-type';
import Quaternion from '../../math/quaternion';
import Vector3 from '../../math/vector3';
import { DataModelClass } from '../metadata/metadata';

@DataModelClass({
    className: 'Camera',
    parent: Instance,
    attributes: [ 'NotReplicated' ],
    properties: {
        cframe: {
            name: 'cframe',
            type: PropertyType.cframe,
            attributes: [ 'NotReplicated', 'EditorHidden' ]
        },
        position: {
            name: 'position',
            type: PropertyType.vector3,
            attributes: []
        },
        rotation: {
            name: 'rotation',
            type: PropertyType.quaternion,
            attributes: []
        },
        fieldOfView: {
            name: 'fieldOfView',
            type: PropertyType.number,
            attributes: [ 'NotReplicated' ]
        },
        nearPlane: {
            name: 'nearPlane',
            type: PropertyType.number,
            attributes: [ 'ReadOnly', 'NotReplicated', 'EditorHidden' ]
        },
        farPlane: {
            name: 'farPlane',
            type: PropertyType.number,
            attributes: [ 'ReadOnly', 'NotReplicated', 'EditorHidden' ]
        }
    }
})
export default class Camera extends Instance
{
    private _cframe = CFrame.identity;
    private _fieldOfView = 70.0;

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

    public get cframe(): CFrame {
        this.throwIfDestroyed();
        return this._cframe;
    }
    public set cframe(newValue: CFrame) {
        this.throwIfDestroyed();

        if (this._cframe.equals(newValue)) {
            return;
        }

        this._cframe = newValue;
        this.firePropertyChanged('cframe');
        this.firePropertyChanged('position');
        this.firePropertyChanged('rotation');
    }

    public get position(): Vector3 {
        this.throwIfDestroyed();
        return this._cframe.position;
    }
    public set position(newValue: Vector3) {
        this.throwIfDestroyed();

        if (this._cframe.position.equals(newValue)) {
            return;
        }

        this.cframe =
            new CFrame(
                newValue.x,
                newValue.y,
                newValue.z,
                this._cframe.qx,
                this._cframe.qy,
                this._cframe.qz,
                this._cframe.qw);
    }

    public get rotation(): Quaternion {
        this.throwIfDestroyed();
        return this._cframe.rotation;
    }
    public set rotation(newValue: Quaternion) {
        this.throwIfDestroyed();

        if (this._cframe.rotation.equals(newValue)) {
            return;
        }

        this.cframe =
            new CFrame(
                this._cframe.x,
                this._cframe.y,
                this._cframe.z,
                newValue.x,
                newValue.y,
                newValue.z,
                newValue.w);
    }

    public get fieldOfView(): number {
        this.throwIfDestroyed();
        return this._fieldOfView;
    }
    public set fieldOfView(newValue: number) {
        this.throwIfDestroyed();

        if (MathEx.isApproxEqual(this._fieldOfView, newValue)) {
            return;
        }

        this._fieldOfView = newValue;
        this.firePropertyChanged('fieldOfView');
    }

    public get nearPlane(): number {
        this.throwIfDestroyed();
        return 0.1;
    }

    public get farPlane(): number {
        this.throwIfDestroyed();
        return 1000;
    }
}
