import { isBoolean } from "../../../../utils/type-guards";

export default class JsonBooleanSerializer
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

    public static verifyObject(json: unknown): json is boolean {
        return isBoolean(json);
    }

    public static serializeToObject(obj: boolean): boolean {
        return obj;
    }

    public static deserializeObject(json: unknown): boolean {
        if (!JsonBooleanSerializer.verifyObject(json)) {
            throw new Error('Invalid json boolean');
        }

        return json;
    }

    public static deserializeObjectUnsafe(json: boolean): boolean {
        return json;
    }
}
