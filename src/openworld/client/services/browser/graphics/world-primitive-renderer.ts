import RenderCanvas from "./render-canvas";
import BrowserContentProviderImpl from "../browser-content-provider";
import Primitive from "../../../../engine/datamodel/elements/primitive";
import InstancedObjectRenderer from "./instanced-object-renderer";
import { PrimitiveType } from '../../../../engine/datamodel/elements/primitive';
import Material from '../../../../engine/datamodel/data-types/material';
import Content from "../../../../engine/datamodel/data-types/content";

import * as THREE from 'three';

export default class WorldPrimitiveRenderer {
    private _objectRenderers = new Map<{
        type: PrimitiveType;
        material: Material;
    }, InstancedObjectRenderer>();

    constructor(private _renderCanvas: RenderCanvas, private _browserContentProviderImpl: BrowserContentProviderImpl) {
        // No-op
    }

    public addPrimitive(primitive: Primitive): void {
        const renderer = this.findOrCreateRenderer(primitive.type, primitive.material);
        renderer.addInstance(primitive);
        // TODO: Handle type change!
        // TODO: Handle material change!
    }

    public removePrimitive(primitive: Primitive): void {
        // TODO
    }

    private findOrCreateRenderer(primitiveType: PrimitiveType, material: Material): InstancedObjectRenderer {
        for (let pair of Array.from(this._objectRenderers.keys())) {
            if (primitiveType === pair.type && material.equals(pair.material)) {
                return this._objectRenderers.get(pair)!;
            }
        }

        const threeGeometry = this.createGeometryForPrimitiveType(primitiveType);
        const threeMaterial = this.createMaterialForMaterial(material);

        const primTypeAndMaterial = { type: primitiveType, material };

        const renderer = new InstancedObjectRenderer(this._renderCanvas.scene, threeGeometry, threeMaterial);
        this._objectRenderers.set(primTypeAndMaterial, renderer);

        return renderer;
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

    private createMaterialForMaterial(materialProperties: Material): THREE.Material {
        const materialParams: THREE.MeshStandardMaterialParameters = {};

        if (materialProperties.color instanceof Content) {
            materialParams.map = this._browserContentProviderImpl.loadTexture(materialProperties.color);
        } else {
            materialParams.color = materialProperties.color.toNumber();
        }
        
        if (materialProperties.metalness instanceof Content) {
            materialParams.metalnessMap = this._browserContentProviderImpl.loadTexture(materialProperties.metalness);
        } else {
            materialParams.metalness = materialProperties.metalness;
        }

        if (materialProperties.roughness instanceof Content) {
            materialParams.roughnessMap = this._browserContentProviderImpl.loadTexture(materialProperties.roughness);
        } else {
            materialParams.roughness = materialProperties.roughness;
        }

        if (materialProperties.normal !== null) {
            materialParams.normalMap = this._browserContentProviderImpl.loadTexture(materialProperties.normal);
        }

        return new THREE.MeshStandardMaterial(materialParams);
    }
}
