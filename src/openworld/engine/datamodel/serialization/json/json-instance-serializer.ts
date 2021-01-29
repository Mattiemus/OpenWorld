import Instance from '../../elements/instance';
import InstanceContext from '../../internals/instance-context';
import InstanceUtils from '../../utils/InstanceUtils';
import JsonInstancePropertySerializer, { InstanceJsonProperty } from './json-instance-property-serializer';
import { Class } from '../../../utils/types';
import { getConstructor, getMetaData } from '../../internals/metadata/metadata';
import { hasFieldOfType, isObject, isString } from '../../../utils/type-guards';

export type InstanceJson = {
    className: string;
    refId: string;
    properties: {
        [key: string]: InstanceJsonProperty;
    };
};

export default class JsonInstanceSerializer
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

    public static verifyObject(json: unknown): json is InstanceJson {
        if (isObject(json) &&
            hasFieldOfType('className', json, isString) &&
            hasFieldOfType('refId', json, isString) &&
            hasFieldOfType('properties', json, isObject)
        ) {
            for (const jsonPropertyName in json.properties) {
                if (!JsonInstancePropertySerializer.verifyObject((json.properties as any)[jsonPropertyName])) {
                    return false;
                }
            }
            
            return true;
        }

        return false;
    }

    public static serializeToObject(obj: Instance): InstanceJson {
        const json: InstanceJson = {
            className: obj.className,
            refId: InstanceUtils.getRefId(obj),
            properties: {}
        };

        const metadata = getMetaData(obj);

        for (const [propertyName] of metadata.properties) {
            const property = metadata.properties.get(propertyName)!;
            const propertyType = property.type;

            if (property.hasAttribute('ReadOnly')) {
                continue;
            }

            if (InstanceUtils.unsafeGetProperty(obj, propertyName) === null &&
                !propertyType.isInstanceRef
            ) {
                json.properties[propertyName] = null;
                continue;
            }

            json.properties[propertyName] =
                JsonInstancePropertySerializer.serializeToObject(
                    obj,
                    propertyName);
        }

        return json;
    }

    public static deserializeObject<TInstance extends Instance>(
        instanceJson: unknown,
        context: InstanceContext,
        allowServiceConstruction: boolean,
        skipInstanceRefs: boolean,
        instanceType?: Class<TInstance>
    ): TInstance {
        if (!JsonInstanceSerializer.verifyObject(instanceJson)) {
            throw new Error('Invalid json instance object');
        }

        return JsonInstanceSerializer.deserializeObjectUnsafe(
            instanceJson,
            context,
            allowServiceConstruction,
            skipInstanceRefs,
            instanceType
        );
    }

    public static deserializeObjectUnsafe<TInstance extends Instance>(
        instanceJson: InstanceJson,
        context: InstanceContext,
        allowServiceConstruction: boolean,
        skipInstanceRefs: boolean,
        instanceType?: Class<TInstance>
    ): TInstance {
        const metadata = getMetaData(instanceJson.className);

        if (instanceType !== undefined && !InstanceUtils.isA(instanceJson.className, instanceType)) {
            throw new Error(`Expected to deserialize "${metadata.className}" but got a "${instanceJson.className}"`);
        }

        const metadataProperties = Array.from(metadata.properties.keys());
        for (const propertyName in instanceJson.properties) {
            if (!metadataProperties.some(p => p === propertyName)) {
                throw new Error(`Unexpected property "${propertyName}"`);
            }
        }

        let instance: TInstance;
        const existingInstance = context.findInstance(instanceJson.refId);
        if (existingInstance !== undefined) {
            if (instanceType !== undefined && !existingInstance.isA(instanceType)) {
                throw new Error(`Deserialized object matches existing reference but is not of the same type`);
            }

            instance = existingInstance as TInstance;
        } else {
            const constructor = getConstructor(instanceJson.className);

            try {
                if (allowServiceConstruction) {
                    Instance['_allowCreateService'] = true;
                }

                instance = new constructor(context, instanceJson.refId);
            } finally { 
                if (allowServiceConstruction) {
                    Instance['_allowCreateService'] = false;
                }
            }
        }
        
        for (const propertyName in instanceJson.properties) {
            const property = metadata.properties.get(propertyName)!;
            const propertyType = property.type;

            if (property.hasAttribute('ReadOnly')) {
                continue;
            }

            if (instanceJson.properties[propertyName] === null && !propertyType.isInstanceRef) {
                InstanceUtils.unsafeSetProperty(
                    instance,
                    propertyName,
                    null
                );

                continue; 
            }

            if (!propertyType.isInstanceRef || !skipInstanceRefs) {
                JsonInstancePropertySerializer.deserializeObjectUnsafe(
                    instanceJson.properties[propertyName],
                    propertyName,
                    instance,
                    context
                );
            }
        }
        
        return instance;
    }
}