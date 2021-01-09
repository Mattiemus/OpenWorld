import Instance from '../../elements/instance';
import InstanceContext from '../../internals/instance-context';
import InstanceUtils from '../../utils/InstanceUtils';
import JsonBooleanSerializer from './properties/json-boolean-serializer';
import JsonCFrameSerializer from './properties/json-cframe-serializer';
import JsonColor3Serializer from './properties/json-color3-serializer';
import JsonContentSerializer from './properties/json-content-serializer';
import JsonMaterialSerializer from './properties/json-material-serializer';
import JsonNumberSerializer from './properties/json-number-serializer';
import JsonQuaternionSerializer from './properties/json-quaternion-serializer';
import JsonStringSerializer from './properties/json-string-serializer';
import JsonVector3Serializer from './properties/json-vector3-serializer';
import PropertyType from '../../internals/metadata/properties/property-type';
import { Class } from '../../../utils/types';
import { getConstructor, getMetaData } from '../../internals/metadata/metadata';
import { hasFieldOfType, isObject, isString } from '../../../utils/type-guards';
import JsonInstancePropertySerializer, { InstanceJsonProperty, InstanceRefJson } from './json-instance-property-serializer';

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
                    debugger;
                    return false;
                }
            }
            
            return true;
        }

        debugger;
        return false;
    }

    public static serializeToObject(obj: Instance): InstanceJson {
        const json: InstanceJson = {
            className: obj.className,
            refId: obj['_refId'],
            properties: {}
        };

        const metadata = getMetaData(obj);

        for (const [propertyName] of metadata.properties) {
            const property = metadata.properties.get(propertyName)!;
            const propertyType = property.type;

            if (property.hasAttribute('ReadOnly')) {
                continue;
            }

            const unsafeObj = obj as any;

            if (unsafeObj[propertyName] === null) {
                json.properties[propertyName] = null;
                continue;
            }

            switch(propertyType) { 
                case PropertyType.number:
                    json.properties[propertyName] = JsonNumberSerializer.serializeToObject(unsafeObj[propertyName]);
                    break;
                case PropertyType.boolean:
                    json.properties[propertyName] = JsonBooleanSerializer.serializeToObject(unsafeObj[propertyName]);
                    break;
                case PropertyType.string:
                    json.properties[propertyName] = JsonStringSerializer.serializeToObject(unsafeObj[propertyName]);
                    break;
                case PropertyType.cframe:
                    json.properties[propertyName] = JsonCFrameSerializer.serializeToObject(unsafeObj[propertyName]);
                    break;
                case PropertyType.color3:
                    json.properties[propertyName] = JsonColor3Serializer.serializeToObject(unsafeObj[propertyName]);
                    break;
                case PropertyType.vector3:
                    json.properties[propertyName] = JsonVector3Serializer.serializeToObject(unsafeObj[propertyName]);
                    break;
                case PropertyType.quaternion:
                    json.properties[propertyName] = JsonQuaternionSerializer.serializeToObject(unsafeObj[propertyName]);
                    break;
                case PropertyType.content:
                    json.properties[propertyName] = JsonContentSerializer.serializeToObject(unsafeObj[propertyName]);
                    break;
                case PropertyType.material:
                    json.properties[propertyName] = JsonMaterialSerializer.serializeToObject(unsafeObj[propertyName]);
                    break;
                default: {
                    if (propertyType.isEnum) {
                        json.properties[propertyName] = JsonStringSerializer.serializeToObject(unsafeObj[propertyName]);
                    } else if (propertyType.isInstanceRef) {
                        if (unsafeObj[propertyName] === null) {
                            json.properties[propertyName] = {
                                instanceRef: null
                            };
                        } else {
                            json.properties[propertyName] = {
                                instanceRef: unsafeObj[propertyName]['_refId']
                            };
                        }
                    } else {
                        throw new Error(`Property "${propertyName}" has an unknown property type`);
                    }

                    break;
                }
            }
        }

        return json;
    }

    public static deserializeObject<TInstance extends Instance>(
        instanceJson: unknown,
        context: InstanceContext,
        allowServiceConstruction: boolean,
        instanceType?: Class<TInstance>
    ): TInstance {
        if (!JsonInstanceSerializer.verifyObject(instanceJson)) {
            throw new Error('Invalid json instance object');
        }

        return JsonInstanceSerializer.deserializeObjectUnsafe(instanceJson, context, allowServiceConstruction, instanceType);
    }

    public static deserializeObjectUnsafe<TInstance extends Instance>(
        instanceJson: InstanceJson,
        context: InstanceContext,
        allowServiceConstruction: boolean,
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

            const unsafeInstance = instance as any;

            if (instanceJson.properties[propertyName] === null) {
                unsafeInstance[propertyName] = null;
                continue; 
            }

            switch(propertyType) { 
                case PropertyType.number:
                    unsafeInstance[propertyName] = JsonNumberSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.boolean:
                    unsafeInstance[propertyName] = JsonBooleanSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.string:
                    unsafeInstance[propertyName] = JsonStringSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.cframe:
                    unsafeInstance[propertyName] = JsonCFrameSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.color3:
                    unsafeInstance[propertyName] = JsonColor3Serializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.vector3:
                    unsafeInstance[propertyName] = JsonVector3Serializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.quaternion:
                    unsafeInstance[propertyName] = JsonQuaternionSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.content:
                    unsafeInstance[propertyName] = JsonContentSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.material:
                    unsafeInstance[propertyName] = JsonMaterialSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                default: {
                    if (propertyType.isEnum) {
                        unsafeInstance[propertyName] = JsonStringSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    } else if (propertyType.isInstanceRef) {
                        const instanceRefJson = instanceJson.properties[propertyName] as InstanceRefJson;
                        if (instanceRefJson.instanceRef === null) {
                            unsafeInstance[propertyName] = null;
                        } else {
                            const instanceValue = context.findInstance(instanceRefJson.instanceRef);
                            if (instanceValue === undefined) {
                                throw new Error(`Could not find instance id "${instanceRefJson.instanceRef}" for property "${propertyName}" on "${instance.className}" instance "${instance['_refId']}"`);
                            }
                            
                            unsafeInstance[propertyName] = instanceValue;
                        }
                    } else {
                        throw new Error(`Property "${propertyName}" has an unknown property type`);
                    }

                    break;
                }
            }
        }
        
        return instance;
    }
}