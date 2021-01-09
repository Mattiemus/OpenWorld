import { isNumber } from "../../../../utils/type-guards";

export default class JsonNumberSerializer
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

    public static verifyObject(json: unknown): json is number {
        return isNumber(json);
    }

    public static serializeToObject(obj: number): number {
        return obj;
    }

    public static deserializeObject(json: unknown): number {
        if (!JsonNumberSerializer.verifyObject(json)) {
            throw new Error('Invalid json number');
        }

        return json;
    }

    public static deserializeObjectUnsafe(json: number): number {
        return json;
    }
}
