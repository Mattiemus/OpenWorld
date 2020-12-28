import { Primitive, PrimitiveType } from '../../../openworld/engine/datamodel/elements/building/primitive';
import { SignalConnection } from 'typed-signals';
import { ThreeJsDataModelProxy } from './threejs-data-model-proxy';

import * as THREE from 'three';

export class ThreeJsDataModelPrimitiveProxy extends ThreeJsDataModelProxy<Primitive, THREE.Mesh>
{
    private static _cubeMesh = new THREE.BoxGeometry(1, 1, 1);
    private static _sphereMesh = new THREE.SphereGeometry(0.5);

    private _typeChangedConnection: SignalConnection;

    constructor(dataModel: Primitive) {
        super(dataModel);

        const typeChangedSignal = dataModel.getPropertyChangedSignal('type')!;
        this._typeChangedConnection = typeChangedSignal.connect(this.onDataModelTypeUpdated.bind(this));
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
        mesh.material = new THREE.MeshNormalMaterial();

        this.copyCFrame(dataModel, mesh);

        return mesh;
    }

    private onDataModelTypeUpdated(): void {
        this.threeObject.geometry = this.createGeometryForPrimitiveType(this.dataModel.type);
    }

    private createGeometryForPrimitiveType(primType: PrimitiveType): THREE.Geometry {
        switch (primType) {
            case PrimitiveType.Cube:
                return ThreeJsDataModelPrimitiveProxy._cubeMesh;
            case PrimitiveType.Sphere:
                return ThreeJsDataModelPrimitiveProxy._sphereMesh;
        }

        throw new Error(`Unknown primitive type "${primType}"`);
    }
}
