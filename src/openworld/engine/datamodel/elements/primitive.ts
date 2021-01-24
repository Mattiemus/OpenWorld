import Color3 from '../../math/color3';
import InstanceContext from '../internals/instance-context';
import Material from '../data-types/material';
import PropertyType from '../internals/metadata/properties/property-type';
import Vector3 from '../../math/vector3';
import WorldObject from './world-object';
import { DataModelClass } from '../internals/metadata/metadata';

export enum PrimitiveType {
    Cube = 'Cube',
    Sphere = 'Sphere'
}

@DataModelClass({
    className: 'Primitive',
    parent: WorldObject,
    attributes: [],
    properties: {
        type: {
            name: 'type',
            type: PropertyType.enum(PrimitiveType),
            attributes: []
        },
        material: {
            name: 'material',
            type: PropertyType.material,
            attributes: []
        },
        size: {
            name: 'size',
            type: PropertyType.vector3,
            attributes: []
        },
        receivesShadows: {
            name: 'receivesShadows',
            type: PropertyType.boolean,
            attributes: []
        },
        castsShadows: {
            name: 'castsShadows',
            type: PropertyType.boolean,
            attributes: []
        }
    }
})
export default class Primitive extends WorldObject
{
    private _primType: PrimitiveType = PrimitiveType.Cube;
    private _material: Material =
        Material.createBasic(Color3.white);
    private _size = Vector3.one;
    private _receivesShadows = true;
    private _castsShadows = true;
    
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

    public get type(): PrimitiveType {
        this.throwIfDestroyed();
        return this._primType;
    }
    public set type(newValue: PrimitiveType) {
        this.throwIfDestroyed();

        if (this._primType === newValue) {
            return;
        }

        this._primType = newValue;
        this.firePropertyChanged('type');
    }

    public get material(): Material {
        this.throwIfDestroyed();
        return this._material;
    }
    public set material(newValue: Material) {
        this.throwIfDestroyed();

        if (this._material.equals(newValue)) {
            return;
        }

        this._material = newValue;
        this.firePropertyChanged('material');
    }

    public get size(): Vector3 {
        this.throwIfDestroyed();
        return this._size;
    }
    public set size(newValue: Vector3) {
        this.throwIfDestroyed();

        if (this._size.equals(newValue)) {
            return;
        }

        this._size = newValue;
        this.firePropertyChanged('size');
    }

    public get receivesShadows(): boolean {
        this.throwIfDestroyed();
        return this._receivesShadows;
    }
    public set receivesShadows(newValue: boolean) {
        this.throwIfDestroyed();

        if (this._receivesShadows === newValue) {
            return;
        }

        this._receivesShadows = newValue;
        this.firePropertyChanged('receivesShadows');
    }

    public get castsShadows(): boolean {
        this.throwIfDestroyed();
        return this._castsShadows;
    }
    public set castsShadows(newValue: boolean) {
        this.throwIfDestroyed();
        
        if (this._castsShadows === newValue) {
            return;
        }

        this._castsShadows = newValue;
        this.firePropertyChanged('castsShadows');
    }
}