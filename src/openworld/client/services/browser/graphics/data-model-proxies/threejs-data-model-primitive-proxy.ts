import ThreeJsDataModelProxy from './threejs-data-model-proxy';
import Primitive, { PrimitiveType } from '../../../../../engine/datamodel/elements/primitive';
import MaterialProperties from '../../../../../engine/datamodel/data-types/MaterialProperties';
import Color3 from '../../../../../engine/math/color3';

import { SignalConnection } from 'typed-signals';
import * as THREE from 'three';
import Content from '../../../../../engine/datamodel/data-types/Content';

export default class ThreeJsDataModelPrimitiveProxy extends ThreeJsDataModelProxy<Primitive, THREE.Mesh>
{
    private static _cubeMesh = new THREE.BoxBufferGeometry(1, 1, 1);
    private static _sphereMesh = new THREE.SphereBufferGeometry(0.5);

    private _typeChangedConnection: SignalConnection;
    private _materialPropertiesChangedConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(dataModel: Primitive) {
        super(dataModel);

        const typeChangedSignal = dataModel.getPropertyChangedSignal('type')!;
        this._typeChangedConnection = typeChangedSignal.connect(this.onDataModelTypeChanged.bind(this));

        const materialPropertiesChangedSignal = dataModel.getPropertyChangedSignal('materialProperties')!;
        this._materialPropertiesChangedConnection = materialPropertiesChangedSignal.connect(this.onDataModelMaterialPropertiesChanged.bind(this));
    }

    // 
    // Methods
    //

    public destroy(): void {
        super.destroy();
        this._typeChangedConnection.disconnect();
    }

    protected createThreeObject(dataModel: Primitive): THREE.Mesh {
        const mesh = new THREE.Mesh();
        mesh.geometry = this.createGeometryForPrimitiveType(dataModel.type);
        mesh.material = this.createMaterialForMaterialProperties(dataModel.materialProperties);

        mesh.receiveShadow = true;
        mesh.castShadow = true;

        this.copyCFrame(dataModel, mesh);

        return mesh;
    }

    private onDataModelTypeChanged(): void {
        this.threeObject.geometry = this.createGeometryForPrimitiveType(this.dataModel.type);
    }

    private onDataModelMaterialPropertiesChanged(): void {
        this.threeObject.material = this.createMaterialForMaterialProperties(this.dataModel.materialProperties);
    }

    private createGeometryForPrimitiveType(primType: PrimitiveType): THREE.BufferGeometry {
        switch (primType) {
            case PrimitiveType.Cube:
                return ThreeJsDataModelPrimitiveProxy._cubeMesh;
            case PrimitiveType.Sphere:
                return ThreeJsDataModelPrimitiveProxy._sphereMesh;
        }

        throw new Error(`Unknown primitive type "${primType}"`);
    }

    private createMaterialForMaterialProperties(materialProperties: MaterialProperties): THREE.Material {
        // TODO: We should cache these somewhere for performance!

        return new THREE.MeshStandardMaterial({
            color: materialProperties.color instanceof Content ? undefined : materialProperties.color.toNumber(),
            // TODO: map
            metalness: materialProperties.metalness instanceof Content ? undefined : materialProperties.metalness,
            // TODO: metalnessMap
            roughness: materialProperties.roughness instanceof Content ? undefined : materialProperties.roughness,
            // TODO: roughnessMap
            // TODO: normal
        });
    }
}
