import CFrame from '../../../../math/cframe';
import { isArrayOf, isNumber } from '../../../../utils/type-guards';

export type CFrameJson = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
];

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
        return isArrayOf(json, isNumber, 7);
    }

    public static serializeToObject(obj: CFrame): CFrameJson {
        return [ obj.x, obj.y, obj.z, obj.qx, obj.qy, obj.qz, obj.qw ];
    }

    public static deserializeObject(json: unknown): CFrame {
        if (!JsonCFrameSerializer.verifyObject(json)) {
            throw new Error('Invalid json cframe');
        }

        return new CFrame(json[0], json[1], json[2], json[3], json[4], json[5], json[6]);
    }

    public static deserializeObjectUnsafe(json: CFrameJson): CFrame {
        return new CFrame(json[0], json[1], json[2], json[3], json[4], json[5], json[6]);
    }
}
