import Destroyable from '../../../../engine/utils/destroyable';
import CFrame from '../../../../engine/math/cframe';
import Vector3 from '../../../../engine/math/vector3';
import CFrameConverter from '../converters/cframe-converter';
import { IDestroyable } from '../../../../engine/utils/interfaces';

import * as THREE from 'three';

export class MeshInstance extends Destroyable
{
    private static _tempMatrix = new THREE.Matrix4();

    //
    // Constructor
    //

    constructor(private _parent: DynamicInstancedMesh, private _index: number) {
        super();
    }

    //
    // Properties
    //

    public get parent(): DynamicInstancedMesh {
        this.throwIfDestroyed();
        return this._parent;
    }

    //
    // Methods
    //

    public setCFrame(cframe: CFrame, scale: Vector3 = Vector3.one): void {
        CFrameConverter.toMatrix(cframe, scale, MeshInstance._tempMatrix);
        this.setMatrix(MeshInstance._tempMatrix);
    }

    public setMatrix(matrix: THREE.Matrix4): void {
        if (this._parent['_instancedMesh'] === null) {
            return;
        }

        this._parent['_instancedMesh'].setMatrixAt(this._index, matrix);
        this._parent['_instancedMesh'].instanceMatrix.needsUpdate = true;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this._parent.removeInstance(this);
    }
}

export class DynamicInstancedMesh extends THREE.Object3D implements IDestroyable
{
    private static _tempMatrix = new THREE.Matrix4();
    private static _zeroScaleMatrix = new THREE.Matrix4().makeScale(0, 0, 0);

    private _instancedMesh: THREE.InstancedMesh | null = null;
    private _instances = new Set<MeshInstance>();
    private _indexHoles: number[] = [];
    private _lastFreeIndex = 0;
    private _isDestroyed: boolean = false;
    
    //
    // Constructor
    //

    constructor(
        private _geometry: THREE.Geometry | THREE.BufferGeometry,
        private _material: THREE.Material
    ) {
        super();
    }

    //
    // Properties
    //

    public get instanceCount(): number {
        return this._instances.size;
    }

    public get geometry(): THREE.Geometry | THREE.BufferGeometry {
        return this._geometry
    }

    public get material(): THREE.Material {
        return this._material;
    }

    //
    // Methods
    //

    public addInstance(): MeshInstance {
        this.throwIfDestroyed();

        const nextIndex = this.allocateIndex();

        const newInstance = new MeshInstance(this, nextIndex);
        this._instances.add(newInstance);

        return newInstance;
    }

    public removeInstance(instance: MeshInstance): boolean {
        this.throwIfDestroyed();

        if (this._instances.delete(instance)) {
            instance.setMatrix(DynamicInstancedMesh._zeroScaleMatrix);
            instance['_isDestroyed'] = true;

            this.freeIndex(instance['_index']);

            return true;
        }
        
        return false;
    }

    public clearInstances(): void {
        this.throwIfDestroyed();

        const instancesClone = Array.from(this._instances.values());
        for (const instance of instancesClone) {
            this.removeInstance(instance);
        }
    }

    public reserve(minimumSize: number): void {
        this.throwIfDestroyed();

        // TODO: Optimise reallocations to follow a curve
        if (this._instancedMesh === null || this._instancedMesh.count < minimumSize) {
            this.resizeInternal(minimumSize);
        }
    }

    public destroy(): void {
        if (this._isDestroyed) {
            return;
        }

        this.clearInstances();

        this._isDestroyed = true;
    }

    protected throwIfDestroyed(): void {
        if (this._isDestroyed) {
            throw new Error('Object has been destroyed');
        }
    }

    private allocateIndex(): number {
        const lastHole = this._indexHoles.pop();
        if (lastHole !== undefined) {
            return lastHole;
        }

        if (this._instancedMesh === null) {
            this.reserve(1);
        } else if (this._lastFreeIndex >= this._instancedMesh.count) {
            this.reserve(this._instancedMesh.count + 1);
        }

        return this._lastFreeIndex++;
    }

    private freeIndex(index: number): void {
        // TODO: Optimise
        this._indexHoles.push(index);        
    }

    private resizeInternal(newSize: number): void {
        if (this._instancedMesh !== null && this._instancedMesh.count >= newSize) {
            this._instancedMesh.count = newSize;
            return;
        }

        const oldInstancedMesh = this._instancedMesh;
        const newInstancedMesh = this.createInstancedMesh(newSize);

        if (oldInstancedMesh !== null) {
            newInstancedMesh.castShadow = oldInstancedMesh.castShadow;
            newInstancedMesh.receiveShadow = oldInstancedMesh.receiveShadow;

            for (let i = 0; i < Math.min(oldInstancedMesh.count, newInstancedMesh.count); i++) {
                oldInstancedMesh.getMatrixAt(i, DynamicInstancedMesh._tempMatrix);
                newInstancedMesh.setMatrixAt(i, DynamicInstancedMesh._tempMatrix);
            }
        }

        if (oldInstancedMesh !== null) {
            this.remove(oldInstancedMesh);
        }

        this._instancedMesh = newInstancedMesh;
        this.add(newInstancedMesh);
    }

    private createInstancedMesh(size: number): THREE.InstancedMesh {        
        const instancedMesh = new THREE.InstancedMesh(this._geometry, this._material, size);
        instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);        

        instancedMesh.castShadow = this.castShadow;
        instancedMesh.receiveShadow = this.receiveShadow;

        for (let i = 0; i < instancedMesh.count; i++) {
            instancedMesh.setMatrixAt(i, DynamicInstancedMesh._zeroScaleMatrix);
        }
        instancedMesh.instanceMatrix.needsUpdate = true;

        return instancedMesh;
    }
}