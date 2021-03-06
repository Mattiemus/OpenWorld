
import * as THREE from 'three';
import CFrame from '../../../../engine/math/cframe';
import Vector3 from '../../../../engine/math/vector3';

export default class CFrameConverter
{
    private static readonly _tempQuaternion = new THREE.Quaternion();
    private static readonly _tempMatrix4A = new THREE.Matrix4();
    private static readonly _tempMatrix4B = new THREE.Matrix4();
    private static readonly _tempMatrix4C = new THREE.Matrix4();

    //
    // Constructor
    //

    private constructor() {
        // No-op
    }

    //
    // Methods
    //

    public static toTranslationMatrix(cframe: CFrame, result: THREE.Matrix4 = new THREE.Matrix4()): THREE.Matrix4 {
        result.makeTranslation(cframe.x, cframe.y, cframe.z);

        return result;
    }

    public static toRotationMatrix(cframe: CFrame, result: THREE.Matrix4 = new THREE.Matrix4()): THREE.Matrix4 {
        CFrameConverter._tempQuaternion.set(cframe.qx, cframe.qy, cframe.qz, cframe.qw);
        result.makeRotationFromQuaternion(CFrameConverter._tempQuaternion);
        
        return result;
    }

    public static toMatrix(cframe: CFrame, scale: Vector3 = Vector3.one, result: THREE.Matrix4 = new THREE.Matrix4()): THREE.Matrix4 {
        CFrameConverter.toTranslationMatrix(cframe, CFrameConverter._tempMatrix4A);
        CFrameConverter.toRotationMatrix(cframe, CFrameConverter._tempMatrix4B);
        CFrameConverter._tempMatrix4C.makeScale(scale.x, scale.y, scale.z);

        result.multiplyMatrices(CFrameConverter._tempMatrix4A, CFrameConverter._tempMatrix4B);
        result.multiplyMatrices(result, CFrameConverter._tempMatrix4C);

        return result;
    }
}