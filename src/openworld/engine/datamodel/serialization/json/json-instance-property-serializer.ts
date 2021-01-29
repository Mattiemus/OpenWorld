import Instance from '../../elements/instance';
import InstanceContext from '../../internals/instance-context';
import InstanceUtils from '../../utils/InstanceUtils';
import JsonBooleanSerializer from './properties/json-boolean-serializer';
import JsonCFrameSerializer, { CFrameJson } from './properties/json-cframe-serializer';
import JsonColor3Serializer, { Color3Json } from './properties/json-color3-serializer';
import JsonContentSerializer, { ContentJson } from './properties/json-content-serializer';
import JsonInstanceRefSerializer, { InstanceRefJson } from './properties/json-instance-ref-serializer';
import JsonMaterialSerializer, { MaterialJson } from './properties/json-material-serializer';
import JsonNumberSerializer from './properties/json-number-serializer';
import JsonQuaternionSerializer, { QuaternionJson } from './properties/json-quaternion-serializer';
import JsonStringSerializer from './properties/json-string-serializer';
import JsonVector3Serializer, { Vector3Json } from './properties/json-vector3-serializer';
import PropertyType from '../../internals/metadata/properties/property-type';
import { getMetaData } from '../../internals/metadata/metadata';

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
               JsonInstanceRefSerializer.verifyObject(json);
    }

    public static serializeToObject(instance: Instance, propertyName: string): InstanceJsonProperty {
        const metadata = getMetaData(instance);
        const propertyMetaData = metadata.properties.get(propertyName);
        if (propertyMetaData === undefined) {
            throw new Error(`Instance "${instance.className}" doesnt have a property named "${propertyName}"`);
        }

        const propertyType = propertyMetaData.type;

        const unsafePropertyValue =
            InstanceUtils.unsafeGetProperty(instance, propertyName) as any;

        if (unsafePropertyValue === null && !propertyType.isInstanceRef) {
            return null;
        }

        switch(propertyType) { 
            case PropertyType.number:
                return JsonNumberSerializer.serializeToObject(unsafePropertyValue);

            case PropertyType.boolean:
                return JsonBooleanSerializer.serializeToObject(unsafePropertyValue);

            case PropertyType.string:
                return JsonStringSerializer.serializeToObject(unsafePropertyValue);

            case PropertyType.cframe:
                return JsonCFrameSerializer.serializeToObject(unsafePropertyValue);

            case PropertyType.color3:
                return JsonColor3Serializer.serializeToObject(unsafePropertyValue);

            case PropertyType.vector3:
                return JsonVector3Serializer.serializeToObject(unsafePropertyValue);

            case PropertyType.quaternion:
                return JsonQuaternionSerializer.serializeToObject(unsafePropertyValue);

            case PropertyType.content:
                return JsonContentSerializer.serializeToObject(unsafePropertyValue);

            case PropertyType.material:
                return JsonMaterialSerializer.serializeToObject(unsafePropertyValue);

            default: {
                if (propertyType.isEnum) {
                    return JsonStringSerializer.serializeToObject(unsafePropertyValue);
                } else if (propertyType.isInstanceRef) {
                    return JsonInstanceRefSerializer.serializeToObject(unsafePropertyValue);
                }
                
                break;
            }
        }

        throw new Error(`Property "${propertyName}" has an unknown property type`);
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

        JsonInstancePropertySerializer.deserializeObjectUnsafe(
            propertyJson,
            propertyName,
            instance,
            context);
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

        if (propertyJson === null && !propertyType.isInstanceRef) {
            InstanceUtils.unsafeSetProperty(
                instance,
                propertyName,
                null
            );

            return; 
        }

        switch(propertyType) { 
            case PropertyType.number:
                InstanceUtils.unsafeSetProperty(
                    instance,
                    propertyName,
                    JsonNumberSerializer.deserializeObject(propertyJson)
                );
                return;

            case PropertyType.boolean:
                InstanceUtils.unsafeSetProperty(
                    instance,
                    propertyName,
                    JsonBooleanSerializer.deserializeObject(propertyJson)
                );
                return;

            case PropertyType.string:
                InstanceUtils.unsafeSetProperty(
                    instance,
                    propertyName,
                    JsonStringSerializer.deserializeObject(propertyJson)
                );
                return;

            case PropertyType.cframe:
                InstanceUtils.unsafeSetProperty(
                    instance,
                    propertyName,
                    JsonCFrameSerializer.deserializeObject(propertyJson)
                );
                return;

            case PropertyType.color3:
                InstanceUtils.unsafeSetProperty(
                    instance,
                    propertyName,
                    JsonColor3Serializer.deserializeObject(propertyJson)
                );
                return;

            case PropertyType.vector3:
                InstanceUtils.unsafeSetProperty(
                    instance,
                    propertyName,
                    JsonVector3Serializer.deserializeObject(propertyJson)
                );
                return;

            case PropertyType.quaternion:
                InstanceUtils.unsafeSetProperty(
                    instance,
                    propertyName,
                    JsonQuaternionSerializer.deserializeObject(propertyJson)
                );
                return;

            case PropertyType.content:
                InstanceUtils.unsafeSetProperty(
                    instance,
                    propertyName,
                    JsonContentSerializer.deserializeObject(propertyJson)
                );
                return;

            case PropertyType.material:
                InstanceUtils.unsafeSetProperty(
                    instance,
                    propertyName,
                    JsonMaterialSerializer.deserializeObject(propertyJson)
                );
                return;

            default: {
                if (propertyType.isEnum) {
                    InstanceUtils.unsafeSetProperty(
                        instance,
                        propertyName,
                        JsonStringSerializer.deserializeObject(propertyJson)
                    );
                    return;
                } else if (propertyType.isInstanceRef) {
                    InstanceUtils.unsafeSetProperty(
                        instance,
                        propertyName,
                        JsonInstanceRefSerializer.deserializeObject(propertyJson, context)
                    );
                    return;
                }

                break;
            }
        }
        
        throw new Error(`Property "${propertyName}" has an unknown property type`);
    }
}