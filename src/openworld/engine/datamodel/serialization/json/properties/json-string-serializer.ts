import { isString } from '../../../../utils/type-guards';

export default class JsonStringSerializer
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

    public static verifyObject(json: unknown): json is string {
        return isString(json);
    }

    public static serializeToObject(obj: string): string {
        return obj;
    }

    public static deserializeObject(json: unknown): string {
        if (!JsonStringSerializer.verifyObject(json)) {
            throw new Error('Invalid json string');
        }

        return json;
    }

    public static deserializeObjectUnsafe(json: string): string {
        return json;
    }
}
