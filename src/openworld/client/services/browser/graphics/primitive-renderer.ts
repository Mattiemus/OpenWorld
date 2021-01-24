import RenderCanvas from "./render-canvas";
import BrowserContentProviderImpl from "../browser-content-provider";
import Primitive from "../../../../engine/datamodel/elements/primitive";
import { PrimitiveType } from '../../../../engine/datamodel/elements/primitive';
import Material from '../../../../engine/datamodel/data-types/material';
import { DynamicInstancedMesh, MeshInstance } from './objects/dynamic-instanced-mesh';
import Destroyable from '../../../../engine/utils/destroyable';

import * as THREE from 'three';
import { SignalConnection } from 'typed-signals';

type PrimitiveBatchKey = {    
    type: PrimitiveType;
    material: Material;
    castsShadows: boolean;
    receivesShadows: boolean;
}

export default class PrimitiveRenderer extends Destroyable
{
    private static _cubePrimitiveGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    private static _spherePrimitiveGeometry = new THREE.SphereBufferGeometry(0.5);

    private _instancedMeshes = new Map<PrimitiveBatchKey, DynamicInstancedMesh>();
    private _primitiveInstances = new Map<Primitive, MeshInstance>();

    private _primitiveCFrameChangedConnections = new Map<Primitive, SignalConnection>();
    private _primitiveTypeChangedConnections = new Map<Primitive, SignalConnection>();
    private _primitiveMaterialChangedConnections = new Map<Primitive, SignalConnection>();
    private _primitiveSizeChangedConnections = new Map<Primitive, SignalConnection>();
    private _primitiveReceivesShadowsChangedConnections = new Map<Primitive, SignalConnection>();
    private _primitiveCastsShadowsChangedConnections = new Map<Primitive, SignalConnection>();

    //
    // Constructor
    //

    constructor(private _renderCanvas: RenderCanvas, private _browserContentProviderImpl: BrowserContentProviderImpl) {
        super();
    }

    //
    // Methods
    //

    public addPrimitive(primitive: Primitive): void {
        const instancedMesh =
            this.findOrCreateInstancedMesh(
                primitive.type,
                primitive.material,
                primitive.castsShadows,
                primitive.receivesShadows);

        const meshInstance = instancedMesh.addInstance();
        meshInstance.setCFrame(primitive.cframe, primitive.size);

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

        const sizeChangedSignal = primitive.getPropertyChangedSignal('size')!;
        const sizeChangedConnection = sizeChangedSignal.connect(() => this.onPrimitiveSizeChanged(primitive, meshInstance));
        this._primitiveSizeChangedConnections.set(primitive, sizeChangedConnection);

        const receivesShadowsChangedSignal = primitive.getPropertyChangedSignal('receivesShadows')!;
        const receivesShadowsChangedConnection = receivesShadowsChangedSignal.connect(() => this.onPrimitiveReceivesShadowsChanged(primitive));
        this._primitiveReceivesShadowsChangedConnections.set(primitive, receivesShadowsChangedConnection);

        const castsShadowsChangedSignal = primitive.getPropertyChangedSignal('castsShadows')!;
        const castsShadowsChangedConnection = castsShadowsChangedSignal.connect(() => this.onPrimitiveCastsShadowsChanged(primitive));
        this._primitiveCastsShadowsChangedConnections.set(primitive, castsShadowsChangedConnection);
    }

    public removePrimitive(primitive: Primitive): void {
        const primitiveInstance = this._primitiveInstances.get(primitive);
        if (primitiveInstance === undefined) {
            return;
        }       

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

        const sizeChangedConnection = this._primitiveSizeChangedConnections.get(primitive);
        if (sizeChangedConnection !== undefined) {
            sizeChangedConnection.disconnect();
            this._primitiveSizeChangedConnections.delete(primitive);
        }

        const receivesShadowsChangedConnection = this._primitiveReceivesShadowsChangedConnections.get(primitive);
        if (receivesShadowsChangedConnection !== undefined) {
            receivesShadowsChangedConnection.disconnect();
            this._primitiveReceivesShadowsChangedConnections.delete(primitive);
        }

        const castsShadowsChangedConnection = this._primitiveCastsShadowsChangedConnections.get(primitive);
        if (castsShadowsChangedConnection !== undefined) {
            castsShadowsChangedConnection.disconnect();
            this._primitiveCastsShadowsChangedConnections.delete(primitive);
        }

        primitiveInstance.destroy();
        this._primitiveInstances.delete(primitive);

        // TODO: This needs to cleanup the PREVIOUS primitive value - this currently uses the CURRENT values!
        
        const instancedMesh =
            this.findInstancedMesh(
                primitive.type,
                primitive.material,
                primitive.castsShadows,
                primitive.receivesShadows);

        if (instancedMesh !== undefined && instancedMesh.instanceCount === 0) {
            this._browserContentProviderImpl.unloadMaterial(instancedMesh.material);

            this.deleteInstancedMesh(
                primitive.type,
                primitive.material,
                primitive.castsShadows,
                primitive.receivesShadows);
        }
    }

    private onPrimitiveCFrameChanged(primitive: Primitive, meshInstance: MeshInstance): void {
        meshInstance.setCFrame(primitive.cframe, primitive.size);
    }

    private onPrimitiveTypeChanged(primitive: Primitive): void {
        this.removePrimitive(primitive);
        this.addPrimitive(primitive);
    }

    private onPrimitiveMaterialChanged(primitive: Primitive): void {
        this.removePrimitive(primitive);
        this.addPrimitive(primitive);
    }

    private onPrimitiveSizeChanged(primitive: Primitive, meshInstance: MeshInstance): void {
        meshInstance.setCFrame(primitive.cframe, primitive.size);
    }

    private onPrimitiveReceivesShadowsChanged(primitive: Primitive): void {
        this.removePrimitive(primitive);
        this.addPrimitive(primitive);
    }

    private onPrimitiveCastsShadowsChanged(primitive: Primitive): void {
        this.removePrimitive(primitive);
        this.addPrimitive(primitive);
    }

    private deleteInstancedMesh(
        primitiveType: PrimitiveType,
        material: Material,
        castsShadows: boolean,
        receivesShadows: boolean
    ): boolean {
        for (let batchKey of Array.from(this._instancedMeshes.keys())) {
            if (primitiveType === batchKey.type &&
                material.equals(batchKey.material) &&
                castsShadows === batchKey.castsShadows &&
                receivesShadows === batchKey.receivesShadows
            ) {
                return this._instancedMeshes.delete(batchKey);
            }
        }

        return false;
    }

    private findInstancedMesh(
        primitiveType: PrimitiveType,
        material: Material,
        castsShadows: boolean,
        receivesShadows: boolean
    ): DynamicInstancedMesh | undefined {
        for (let batchKey of Array.from(this._instancedMeshes.keys())) {
            if (primitiveType === batchKey.type &&
                material.equals(batchKey.material) &&
                castsShadows === batchKey.castsShadows &&
                receivesShadows === batchKey.receivesShadows
            ) {
                return this._instancedMeshes.get(batchKey);
            }
        }

        return undefined;
    }

    private findOrCreateInstancedMesh(
        primitiveType: PrimitiveType,
        material: Material,
        castsShadows: boolean,
        receivesShadows: boolean
    ): DynamicInstancedMesh {
        const existingInstancedMesh = this.findInstancedMesh(primitiveType, material, castsShadows, receivesShadows);
        if (existingInstancedMesh !== undefined) {
            return existingInstancedMesh;
        }

        const threeGeometry = this.createGeometryForPrimitiveType(primitiveType);
        const threeMaterial = this._browserContentProviderImpl.loadMaterial(material);

        const batchKey: PrimitiveBatchKey = {
            type: primitiveType,
            material,
            castsShadows,
            receivesShadows
        };

        const dynamicInstancedMesh = new DynamicInstancedMesh(threeGeometry, threeMaterial);
        dynamicInstancedMesh.castShadow = castsShadows;
        dynamicInstancedMesh.receiveShadow = receivesShadows;

        this._renderCanvas.scene.add(dynamicInstancedMesh);

        this._instancedMeshes.set(batchKey, dynamicInstancedMesh);

        return dynamicInstancedMesh;
    }

    private createGeometryForPrimitiveType(primType: PrimitiveType): THREE.BufferGeometry {
        switch (primType) {
            case PrimitiveType.Cube:
                return PrimitiveRenderer._cubePrimitiveGeometry;

            case PrimitiveType.Sphere:
                return PrimitiveRenderer._spherePrimitiveGeometry;
        }

        throw new Error(`Unknown primitive type "${primType}"`);
    }
}
