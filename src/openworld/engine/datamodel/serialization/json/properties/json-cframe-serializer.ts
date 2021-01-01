import CFrame from '../../../../math/cframe';
import { hasFieldOfType, isNumber, isObject } from '../../../../utils/type-guards';

export type CFrameJson = {
    x: number;
    y: number;
    z: number;
    qx: number;
    qy: number;
    qz: number;
    qw: number;
};

export default class JsonCFrameSerializer
{
    //
    // Constructor
    //

    private constructor() {
        // No-op
    }

    //
    // Methods
    //

    public static verifyObject(json: unknown): json is CFrameJson {
        return isObject(json) &&
               hasFieldOfType('x', json, isNumber) &&
               hasFieldOfType('y', json, isNumber) &&
               hasFieldOfType('z', json, isNumber) &&
               hasFieldOfType('qx', json, isNumber) &&
               hasFieldOfType('qy', json, isNumber) &&
               hasFieldOfType('qz', json, isNumber) &&
               hasFieldOfType('qw', json, isNumber);
    }

    public static deserializeObject(json: unknown): CFrame {
        if (!JsonCFrameSerializer.verifyObject(json)) {
            throw new Error('Invalid json cframe');
        }

        return new CFrame(json.x, json.y, json.z, json.qx, json.qy, json.qz, json.qz);
    }

    public static deserializeObjectUnsafe(json: CFrameJson): CFrame {
        return new CFrame(json.x, json.y, json.z, json.qx, json.qy, json.qz, json.qz);
    }
}
