import Instance from '../../elements/instance';
import JsonBooleanSerializer from './properties/json-boolean-serializer';
import JsonCFrameSerializer, { CFrameJson } from './properties/json-cframe-serializer';
import JsonColor3Serializer, { Color3Json } from './properties/json-color3-serializer';
import JsonContentSerializer, { ContentJson } from './properties/json-content-serializer';
import JsonMaterialSerializer, { MaterialJson } from './properties/json-material-serializer';
import JsonNumberSerializer from './properties/json-number-serializer';
import JsonQuaternionSerializer, { QuaternionJson } from './properties/json-quaternion-serializer';
import JsonStringSerializer from './properties/json-string-serializer';
import JsonVector3Serializer, { Vector3Json } from './properties/json-vector3-serializer';
import PropertyType from '../../internals/metadata/properties/property-type';
import { getMetaData } from '../../internals/metadata/metadata';
import { hasFieldOfType, isObject, isString } from '../../../utils/type-guards';
import InstanceContext from '../../internals/instance-context';

export type InstanceRefJson = { instanceRef: string | null };

export type InstanceJsonProperty =
    null |
    boolean |
    number |
    string |
    CFrameJson |
    Color3Json |
    ContentJson |
    MaterialJson |
    QuaternionJson | 
    Vector3Json |
    InstanceRefJson;
    
export default class JsonInstancePropertySerializer
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

    public static verifyObject(json: unknown): json is InstanceJsonProperty {
        return json == null ||
               JsonBooleanSerializer.verifyObject(json) ||
               JsonNumberSerializer.verifyObject(json) ||
               JsonStringSerializer.verifyObject(json) ||
               JsonCFrameSerializer.verifyObject(json) ||
               JsonColor3Serializer.verifyObject(json) ||
               JsonContentSerializer.verifyObject(json) || 
               JsonContentSerializer.verifyObject(json) ||
               JsonMaterialSerializer.verifyObject(json) ||
               JsonQuaternionSerializer.verifyObject(json) ||
               JsonVector3Serializer.verifyObject(json) ||
               (isObject(json) && hasFieldOfType('instanceRef', json, (f: unknown): f is null | string => f === null || isString(f)));
    }

    public static serializeToObject(instance: Instance, propertyName: string): InstanceJsonProperty {
        const metadata = getMetaData(instance);
        const propertyMetaData = metadata.properties.get(propertyName);
        if (propertyMetaData === undefined) {
            throw new Error(`Instance "${instance.className}" doesnt have a property named "${propertyName}"`);
        }

        const propertyType = propertyMetaData.type;

        const unsafeObj = instance as any;

        if (unsafeObj[propertyName] === null) {
            return null;
        }

        switch(propertyType) { 
            case PropertyType.number:
                return JsonNumberSerializer.serializeToObject(unsafeObj[propertyName]);
            case PropertyType.boolean:
                return JsonBooleanSerializer.serializeToObject(unsafeObj[propertyName]);
            case PropertyType.string:
                return JsonStringSerializer.serializeToObject(unsafeObj[propertyName]);
            case PropertyType.cframe:
                return JsonCFrameSerializer.serializeToObject(unsafeObj[propertyName]);
            case PropertyType.color3:
                return JsonColor3Serializer.serializeToObject(unsafeObj[propertyName]);
            case PropertyType.vector3:
                return JsonVector3Serializer.serializeToObject(unsafeObj[propertyName]);
            case PropertyType.quaternion:
                return JsonQuaternionSerializer.serializeToObject(unsafeObj[propertyName]);
            case PropertyType.content:
                return JsonContentSerializer.serializeToObject(unsafeObj[propertyName]);
            case PropertyType.material:
                return JsonMaterialSerializer.serializeToObject(unsafeObj[propertyName]);
            default: {
                if (propertyType.isEnum) {
                    return JsonStringSerializer.serializeToObject(unsafeObj[propertyName]);
                } else if (propertyType.isInstanceRef) {
                    if (unsafeObj[propertyName] === null) {
                        return { instanceRef: null };
                    } else {
                        return { instanceRef: unsafeObj[propertyName]['_refId'] };
                    }
                } else {
                    throw new Error(`Property "${propertyName}" has an unknown property type`);
                }
            }
        }
    }

    public static deserializeObject(        
        propertyJson: unknown,
        propertyName: string,
        instance: Instance,
        context: InstanceContext
    ): void {
        if (!JsonInstancePropertySerializer.verifyObject(propertyJson)) {
            throw new Error('Invalid json instance property object');
        }

        JsonInstancePropertySerializer.deserializeObjectUnsafe(propertyJson, propertyName, instance, context);
    }

    public static deserializeObjectUnsafe(        
        propertyJson: InstanceJsonProperty,
        propertyName: string,
        instance: Instance,
        context: InstanceContext
    ): void {        
        const metadata = getMetaData(instance);
        const propertyMetaData = metadata.properties.get(propertyName);
        if (propertyMetaData === undefined) {
            throw new Error(`Instance "${instance.className}" doesnt have a property named "${propertyName}"`);
        }

        const propertyType = propertyMetaData.type;

        if (propertyMetaData.hasAttribute('ReadOnly')) {
            return;
        }

        const unsafeInstance = instance as any;

        if (propertyJson === null) {
            unsafeInstance[propertyName] = null;
            return; 
        }

        switch(propertyType) { 
            case PropertyType.number:
                unsafeInstance[propertyName] = JsonNumberSerializer.deserializeObject(propertyJson);
                break;
            case PropertyType.boolean:
                unsafeInstance[propertyName] = JsonBooleanSerializer.deserializeObject(propertyJson);
                break;
            case PropertyType.string:
                unsafeInstance[propertyName] = JsonStringSerializer.deserializeObject(propertyJson);
                break;
            case PropertyType.cframe:
                unsafeInstance[propertyName] = JsonCFrameSerializer.deserializeObject(propertyJson);
                break;
            case PropertyType.color3:
                unsafeInstance[propertyName] = JsonColor3Serializer.deserializeObject(propertyJson);
                break;
            case PropertyType.vector3:
                unsafeInstance[propertyName] = JsonVector3Serializer.deserializeObject(propertyJson);
                break;
            case PropertyType.quaternion:
                unsafeInstance[propertyName] = JsonQuaternionSerializer.deserializeObject(propertyJson);
                break;
            case PropertyType.content:
                unsafeInstance[propertyName] = JsonContentSerializer.deserializeObject(propertyJson);
                break;
            case PropertyType.material:
                unsafeInstance[propertyName] = JsonMaterialSerializer.deserializeObject(propertyJson);
                break;
            default: {
                if (propertyType.isEnum) {
                    unsafeInstance[propertyName] = JsonStringSerializer.deserializeObject(propertyJson);
                } else if (propertyType.isInstanceRef) {
                    const instanceRefJson = propertyJson as InstanceRefJson;
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
}