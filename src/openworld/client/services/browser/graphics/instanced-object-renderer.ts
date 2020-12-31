import { SignalConnection } from "typed-signals";
import CFrameConverter from './converters/cframe-converter';
import CFrame from '../../../../engine/math/cframe';
import Instance from "../../../../engine/datamodel/elements/instance";

import * as THREE from 'three';

type InstanceWithCFrame = Instance & { cframe: CFrame }

export default class InstancedObjectRenderer
{
    private _instancedMesh: THREE.InstancedMesh | null = null;
    private _instanceCount = 0;
    private _instanceIds = new Map<InstanceWithCFrame, number>();
    private _cframeChangeConnections = new Map<InstanceWithCFrame, SignalConnection>();

    // 
    // Constructor
    //

    constructor(
        private _parentScene: THREE.Scene,
        private _geometry: THREE.Geometry | THREE.BufferGeometry,
        private _material: THREE.Material)
    {
        // No-op
    }

    public addInstance(instance: InstanceWithCFrame): void {
        this.updateInstancedMeshSize(this._instanceCount + 1);

        const instanceId = this._instanceCount++;
        this._instanceIds.set(instance, instanceId);

        this.setMatrixForInstance(instanceId, instance);

        const instanceCFrameChangedSignal = instance.getPropertyChangedSignal('cframe')!;
        const instanceCFrameChangedConnection = instanceCFrameChangedSignal.connect(() => this.onInstanceCFrameChanged(instance));        
        this._cframeChangeConnections.set(instance, instanceCFrameChangedConnection);
    }

    public removeInstance(instance: InstanceWithCFrame): void {
        if (this._instancedMesh === null) {
            return;
        }

        // TODO
    }

    private setMatrixForInstance(instanceId: number, instance: InstanceWithCFrame): void {
        const tempMatrix = CFrameConverter.toMatrix(instance.cframe);

        this._instancedMesh!.setMatrixAt(instanceId, tempMatrix);
        this._instancedMesh!.instanceMatrix.needsUpdate = true;
    }

    private updateInstancedMeshSize(newSize: number): void {
        if (this._instancedMesh === null) {
            this._instancedMesh = new THREE.InstancedMesh(this._geometry, this._material, newSize);
            this._instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            this._parentScene.add(this._instancedMesh);
            return;
        }

        if (this._instancedMesh.count >= newSize) {
            this._instancedMesh.count = newSize;
            return;
        }

        const oldInstancedMesh = this._instancedMesh;
        this._parentScene.remove(oldInstancedMesh);

        this._instancedMesh = new THREE.InstancedMesh(this._geometry, this._material, newSize);
        this._instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this._parentScene.add(this._instancedMesh);

        const tempMatrix = new THREE.Matrix4;
        for (let i = 0; i < this._instanceCount; i++) {
            oldInstancedMesh.getMatrixAt(i, tempMatrix);
            this._instancedMesh.setMatrixAt(i, tempMatrix);
        }
    }

    private onInstanceCFrameChanged(instance: InstanceWithCFrame): void {
        const instanceId = this._instanceIds.get(instance);
        if (instanceId === undefined) {
            return;
        }

        this.setMatrixForInstance(instanceId, instance);
    }
}
