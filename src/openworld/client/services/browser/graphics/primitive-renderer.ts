import RenderCanvas from "./render-canvas";
import BrowserContentProviderImpl from "../browser-content-provider";
import Primitive from "../../../../engine/datamodel/elements/primitive";
import { PrimitiveType } from '../../../../engine/datamodel/elements/primitive';
import Material from '../../../../engine/datamodel/data-types/material';
import { DynamicInstancedMesh, MeshInstance } from './objects/dynamic-instanced-mesh';
import Destroyable from '../../../../engine/utils/destroyable';

import * as THREE from 'three';
import { SignalConnection } from 'typed-signals';

export default class PrimitiveRenderer extends Destroyable
{
    private _instancedMeshes = new Map<{
        type: PrimitiveType;
        material: Material;
    }, DynamicInstancedMesh>();

    private _primitiveInstances = new Map<Primitive, MeshInstance>();
    private _primitiveCFrameChangedConnections = new Map<Primitive, SignalConnection>();
    private _primitiveTypeChangedConnections = new Map<Primitive, SignalConnection>();
    private _primitiveMaterialChangedConnections = new Map<Primitive, SignalConnection>();

    constructor(private _renderCanvas: RenderCanvas, private _browserContentProviderImpl: BrowserContentProviderImpl) {
        super();
    }

    public addPrimitive(primitive: Primitive): void {
        const instancedMesh = this.findOrCreateInstancedMesh(primitive.type, primitive.material);

        const meshInstance = instancedMesh.addInstance();
        meshInstance.setCFrame(primitive.cframe);

        this._primitiveInstances.set(primitive, meshInstance);

        const cframeChangedSignal = primitive.getPropertyChangedSignal('cframe')!;
        const cframeChangedConnection = cframeChangedSignal.connect(() => this.onPrimitiveCFrameChanged(primitive, meshInstance));
        this._primitiveCFrameChangedConnections.set(primitive, cframeChangedConnection);

        const typeChangedSignal = primitive.getPropertyChangedSignal('type')!;
        const typeChangedConnection = typeChangedSignal.connect(() => this.onPrimitiveTypeChanged(primitive));
        this._primitiveTypeChangedConnections.set(primitive, typeChangedConnection);

        const materialChangedSignal = primitive.getPropertyChangedSignal('material')!;
        const materialChangedConnection = materialChangedSignal.connect(() => this.onPrimitiveMaterialChanged(primitive));
        this._primitiveMaterialChangedConnections.set(primitive, materialChangedConnection);
    }

    public removePrimitive(primitive: Primitive): void {
        const primitiveInstance = this._primitiveInstances.get(primitive);
        if (primitiveInstance === undefined) {
            return;
        }

        primitiveInstance.destroy();
        this._primitiveInstances.delete(primitive);

        const cframeChangedConnection = this._primitiveCFrameChangedConnections.get(primitive);
        if (cframeChangedConnection !== undefined) {
            cframeChangedConnection.disconnect();
            this._primitiveCFrameChangedConnections.delete(primitive);
        }

        const typeChangedConnection = this._primitiveTypeChangedConnections.get(primitive);
        if (typeChangedConnection !== undefined) {
            typeChangedConnection.disconnect();
            this._primitiveTypeChangedConnections.delete(primitive);
        }

        const materialChangedConnection = this._primitiveMaterialChangedConnections.get(primitive);
        if (materialChangedConnection !== undefined) {
            materialChangedConnection.disconnect();
            this._primitiveMaterialChangedConnections.delete(primitive);
        }
    }

    private onPrimitiveCFrameChanged(primitive: Primitive, meshInstance: MeshInstance): void {
        meshInstance.setCFrame(primitive.cframe);
    }

    private onPrimitiveTypeChanged(primitive: Primitive): void {
        this.removePrimitive(primitive);
        this.addPrimitive(primitive);
    }

    private onPrimitiveMaterialChanged(primitive: Primitive): void {
        this.removePrimitive(primitive);
        this.addPrimitive(primitive);
    }

    private findOrCreateInstancedMesh(primitiveType: PrimitiveType, material: Material): DynamicInstancedMesh {
        for (let pair of Array.from(this._instancedMeshes.keys())) {
            if (primitiveType === pair.type && material.equals(pair.material)) {
                return this._instancedMeshes.get(pair)!;
            }
        }

        const threeGeometry = this.createGeometryForPrimitiveType(primitiveType);
        const threeMaterial = this._browserContentProviderImpl.loadMaterial(material);

        const primTypeAndMaterial = { type: primitiveType, material };

        const dynamicInstancedMesh = new DynamicInstancedMesh(threeGeometry, threeMaterial);
        this._renderCanvas.scene.add(dynamicInstancedMesh);

        this._instancedMeshes.set(primTypeAndMaterial, dynamicInstancedMesh);

        return dynamicInstancedMesh;
    }

    private createGeometryForPrimitiveType(primType: PrimitiveType): THREE.BufferGeometry {
        switch (primType) {
            case PrimitiveType.Cube:
                return new THREE.BoxBufferGeometry(1, 1, 1);
            case PrimitiveType.Sphere:
                return new THREE.SphereBufferGeometry(0.5);
        }

        throw new Error(`Unknown primitive type "${primType}"`);
    }
}
