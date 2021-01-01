import Quaternion from '../../../../math/quaternion';
import { hasFieldOfType, isNumber, isObject } from '../../../../utils/type-guards';

export type QuaternionJson = {
    x: number;
    y: number;
    z: number;
    w: number;
};

export default class JsonQuaternionSerializer
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

    public static verifyObject(json: unknown): json is QuaternionJson {
        return isObject(json) &&
               hasFieldOfType('x', json, isNumber) &&
               hasFieldOfType('y', json, isNumber) &&
               hasFieldOfType('z', json, isNumber) &&
               hasFieldOfType('w', json, isNumber);
    }

    public static deserializeObject(json: unknown): Quaternion {
        if (!JsonQuaternionSerializer.verifyObject(json)) {
            throw new Error('Invalid json quaternion');
        }

        return new Quaternion(json.x, json.y, json.z, json.w);
    }

    public static deserializeObjectUnsafe(json: QuaternionJson): Quaternion {
        return new Quaternion(json.x, json.y, json.z, json.w);
    }
}
