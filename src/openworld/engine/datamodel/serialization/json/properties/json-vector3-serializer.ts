import Vector3 from '../../../../math/vector3';
import { hasFieldOfType, isNumber, isObject } from '../../../../utils/type-guards';

export type Vector3Json = {
    x: number;
    y: number;
    z: number;
};

export default class JsonVector3Serializer
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

    public static verifyObject(json: unknown): json is Vector3Json {
        return isObject(json) &&
               hasFieldOfType('x', json, isNumber) &&
               hasFieldOfType('y', json, isNumber) &&
               hasFieldOfType('z', json, isNumber);
    }

    public static deserializeObject(json: unknown): Vector3 {
        if (!JsonVector3Serializer.verifyObject(json)) {
            throw new Error('Invalid json color3');
        }

        return new Vector3(json.x, json.y, json.z);
    }

    public static deserializeObjectUnsafe(json: Vector3Json): Vector3 {
        return new Vector3(json.x, json.y, json.z);
    }
}
