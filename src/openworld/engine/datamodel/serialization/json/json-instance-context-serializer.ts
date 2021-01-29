import InstanceContext from '../../internals/instance-context';
import InstanceUtils from '../../utils/InstanceUtils';
import JsonInstanceSerializer, { InstanceJson } from './json-instance-serializer';
import { isObject } from '../../../utils/type-guards';

export type InstanceContextJson = {
    [ key: string ]: InstanceJson
};

export default class JsonInstanceContextSerializer
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

    public static verifyObject(json: unknown): json is InstanceContextJson {
        if (isObject(json)) {
            for (const instanceJson of Object.values(json)) {
                if (!JsonInstanceSerializer.verifyObject(instanceJson)) {
                    return false;
                }
            }
            
            return true;
        }

        return false;
    }

    public static serializeToObject(obj: InstanceContext): InstanceContextJson {
        const json: InstanceContextJson = {};

        for (const instance of obj.getActiveInstances()) {
            const instanceRefId = InstanceUtils.getRefId(instance);
            json[instanceRefId] = JsonInstanceSerializer.serializeToObject(instance);
        }
        
        return json;
    }

    public static deserializeObject(
        instanceContextJson: unknown,
        context: InstanceContext
    ): void {
        if (!JsonInstanceContextSerializer.verifyObject(instanceContextJson)) {
            throw new Error('Invalid json instance context object');
        }

        JsonInstanceContextSerializer.deserializeObjectUnsafe(
            instanceContextJson,
            context
        );
    }

    public static deserializeObjectUnsafe(
        instanceContextJson: InstanceContextJson,
        context: InstanceContext
    ): void {
        for (const instanceJsonKey in instanceContextJson) {
            const instanceJson = instanceContextJson[instanceJsonKey];

            JsonInstanceSerializer.deserializeObject(
                instanceJson,
                context,
                true,
                true
            );
        }
        
        for (const instanceJsonKey in instanceContextJson) {
            const instanceJson = instanceContextJson[instanceJsonKey];

            JsonInstanceSerializer.deserializeObject(
                instanceJson,
                context,
                true,
                false
            );
        }
    }
}