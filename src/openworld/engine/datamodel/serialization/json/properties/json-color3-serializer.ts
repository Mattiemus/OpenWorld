import Color3 from '../../../../math/color3';
import { hasFieldOfType, isNumber, isObject } from '../../../../utils/type-guards';

export type Color3Json = {
    r: number;
    g: number;
    b: number;
};

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
        return isObject(json) &&
               hasFieldOfType('r', json, isNumber) &&
               hasFieldOfType('g', json, isNumber) &&
               hasFieldOfType('b', json, isNumber);
    }

    public static deserializeObject(json: unknown): Color3 {
        if (!JsonColor3Serializer.verifyObject(json)) {
            throw new Error('Invalid json color3');
        }

        return new Color3(json.r, json.g, json.b);
    }

    public static deserializeObjectUnsafe(json: Color3Json): Color3 {
        return new Color3(json.r, json.g, json.b);
    }
}
