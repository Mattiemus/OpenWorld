import Quaternion from '../../../../math/quaternion';
import { isNumber, isArrayOf } from '../../../../utils/type-guards';

export type QuaternionJson = [
    number,
    number,
    number,
    number
];

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
        return isArrayOf(json, isNumber, 4);
    }

    public static serializeToObject(obj: Quaternion): QuaternionJson {
        return [ obj.x, obj.y, obj.z, obj.w ];
    }

    public static deserializeObject(json: unknown): Quaternion {
        if (!JsonQuaternionSerializer.verifyObject(json)) {
            throw new Error('Invalid json quaternion');
        }

        return new Quaternion(json[0], json[1], json[2], json[3]);
    }

    public static deserializeObjectUnsafe(json: QuaternionJson): Quaternion {
        return new Quaternion(json[0], json[1], json[2], json[3]);
    }
}
