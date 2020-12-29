import ThreeJsDataModelProxy from './threejs-data-model-proxy';
import Primitive, { PrimitiveType } from '../../../../../engine/datamodel/elements/primitive';

import { SignalConnection } from 'typed-signals';
import * as THREE from 'three';

export default class ThreeJsDataModelPrimitiveProxy extends ThreeJsDataModelProxy<Primitive, THREE.Mesh>
{
    private static _cubeMesh = new THREE.BoxBufferGeometry(1, 1, 1);
    private static _sphereMesh = new THREE.SphereBufferGeometry(0.5);

    private _typeChangedConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(dataModel: Primitive) {
        super(dataModel);

        const typeChangedSignal = dataModel.getPropertyChangedSignal('type')!;
        this._typeChangedConnection = typeChangedSignal.connect(this.onDataModelTypeChanged.bind(this));
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
        mesh.material = new THREE.MeshStandardMaterial();

        this.copyCFrame(dataModel, mesh);

        return mesh;
    }

    private onDataModelTypeChanged(): void {
        this.threeObject.geometry = this.createGeometryForPrimitiveType(this.dataModel.type);
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
}
