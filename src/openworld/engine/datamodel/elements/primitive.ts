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
    public set type(newPrimitiveType: PrimitiveType) {
        this.throwIfDestroyed();

        if (this._primType === newPrimitiveType) {
            return;
        }

        this._primType = newPrimitiveType;
        this.firePropertyChanged('type');
    }

    public get material(): Material {
        this.throwIfDestroyed();
        return this._material;
    }
    public set material(newMaterial: Material) {
        this.throwIfDestroyed();

        if (this._material.equals(newMaterial)) {
            return;
        }

        this._material = newMaterial;
        this.firePropertyChanged('material');
    }

    public get size(): Vector3 {
        this.throwIfDestroyed();
        return this._size;
    }
    public set size(newSize: Vector3) {
        this.throwIfDestroyed();

        if (this._size.equals(newSize)) {
            return;
        }

        this._size = newSize;
        this.firePropertyChanged('size');
    }

    public get receivesShadows(): boolean {
        this.throwIfDestroyed();
        return this._receivesShadows;
    }
    public set receivesShadows(newReceivesShadows: boolean) {
        this.throwIfDestroyed();

        if (this._receivesShadows === newReceivesShadows) {
            return;
        }

        this._receivesShadows = newReceivesShadows;
        this.firePropertyChanged('receivesShadows');
    }

    public get castsShadows(): boolean {
        this.throwIfDestroyed();
        return this._castsShadows;
    }
    public set castsShadows(newCastsShadows: boolean) {
        this.throwIfDestroyed();
        
        if (this._castsShadows === newCastsShadows) {
            return;
        }

        this._castsShadows = newCastsShadows;
        this.firePropertyChanged('castsShadows');
    }
}