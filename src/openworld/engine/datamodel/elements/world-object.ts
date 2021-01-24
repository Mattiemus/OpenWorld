import CFrame from '../../math/cframe';
import Instance from './instance';
import PropertyType from '../internals/metadata/properties/property-type';
import Quaternion from '../../math/quaternion';
import Vector3 from '../../math/vector3';
import { DataModelClass } from '../internals/metadata/metadata';

@DataModelClass({
    className: 'WorldObject',
    parent: Instance,
    attributes: [ 'NotCreatable' ],
    properties: {
        cframe: {
            name: 'cframe',
            type: PropertyType.cframe,
            attributes: [ 'EditorHidden' ]
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
}