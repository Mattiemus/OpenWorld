import Instance from '../../../elements/instance';
import InstanceContext from '../../../context/instance-context';
import { hasFieldOfType, isObject, isString } from '../../../../utils/type-guards';
import InstanceUtils from '../../../utils/instance-utils';

export type InstanceRefJson = { 
    instanceRef: string | null
};

export default class JsonInstanceRefSerializer
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

    public static verifyObject(json: unknown): json is InstanceRefJson {
        return isObject(json) && 
            hasFieldOfType(
                'instanceRef',
                json,
                (f: unknown): f is null | string => {
                    return f === null || isString(f);
                }
            );       
    }

    public static serializeToObject(obj: Instance | null): InstanceRefJson {
        if (obj === null) {
            return { 
                instanceRef: null 
            };
        }
        
        return { 
            instanceRef: InstanceUtils.getRefId(obj)
        };
    }

    public static deserializeObject(
        json: unknown, 
        context: InstanceContext
    ): Instance | null {
        if (!JsonInstanceRefSerializer.verifyObject(json)) {
            throw new Error('Invalid json instance ref');
        }

        return JsonInstanceRefSerializer.deserializeObjectUnsafe(json, context);
    }

    public static deserializeObjectUnsafe(
        json: InstanceRefJson,
        context: InstanceContext
    ): Instance | null {
        if (json.instanceRef === null) {
            return null;
        }

        const instanceValue = context.findInstance(json.instanceRef);
        if (instanceValue === undefined) {
            throw new Error(`Could not find instance id "${json.instanceRef}"`);
        }
        
        return instanceValue;
    }
}
