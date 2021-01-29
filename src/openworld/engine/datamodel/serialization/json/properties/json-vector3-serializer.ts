import Vector3 from '../../../../math/vector3';
import { isArrayOf, isNumber } from '../../../../utils/type-guards';

export type Vector3Json = [
    number,
    number,
    number
];

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
        return isArrayOf(json, isNumber, 3);
    }

    public static serializeToObject(obj: Vector3): Vector3Json {
        return [ obj.x, obj.y, obj.z ];
    }

    public static deserializeObject(json: unknown): Vector3 {
        if (!JsonVector3Serializer.verifyObject(json)) {
            throw new Error('Invalid json vector3');
        }

        return new Vector3(json[0], json[1], json[2]);
    }

    public static deserializeObjectUnsafe(json: Vector3Json): Vector3 {
        return new Vector3(json[0], json[1], json[2]);
    }
}
