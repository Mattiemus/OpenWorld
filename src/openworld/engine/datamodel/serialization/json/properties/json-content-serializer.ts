import Content from '../../../data-types/content';
import { hasFieldOfType, isObject, isString } from '../../../../utils/type-guards';

export type ContentJson = {
    content: string;
};

export default class JsonContentSerializer
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

    public static verifyObject(json: unknown): json is ContentJson {
        return isObject(json) &&
               hasFieldOfType('content', json, isString);
    }

    public static serializeToObject(obj: Content): ContentJson {
        return { content: obj.id.toString() };
    }

    public static deserializeObject(json: unknown): Content {
        if (!JsonContentSerializer.verifyObject(json)) {
            throw new Error('Invalid json string');
        }

        return new Content(json.content);
    }

    public static deserializeObjectUnsafe(json: ContentJson): Content {
        return new Content(json.content);
    }
}
