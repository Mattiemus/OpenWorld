import Color3 from '../../../../math/color3';
import { isNumber, isArrayOf } from '../../../../utils/type-guards';

export type Color3Json = [
    number,
    number,
    number
];

export default class JsonColor3Serializer
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

    public static verifyObject(json: unknown): json is Color3Json {
        return isArrayOf(json, isNumber, 3);
    }

    public static serializeToObject(obj: Color3): Color3Json {
        return [ obj.r, obj.g, obj.b ];
    }

    public static deserializeObject(json: unknown): Color3 {
        if (!JsonColor3Serializer.verifyObject(json)) {
            throw new Error('Invalid json color3');
        }

        return new Color3(json[0], json[1], json[2]);
    }

    public static deserializeObjectUnsafe(json: Color3Json): Color3 {
        return new Color3(json[0], json[1], json[2]);
    }
}
