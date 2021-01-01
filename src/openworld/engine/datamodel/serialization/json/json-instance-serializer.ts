import Instance from '../../elements/instance';
import InstanceContext from '../../internals/instance-context';
import { getMetaData, getConstructor } from '../../internals/metadata/metadata';
import PropertyType from '../../internals/metadata/properties/property-type';
import { Class } from '../../../utils/types';
import JsonContentSerializer, { ContentJson } from './properties/json-content-serializer';
import JsonStringSerializer from './properties/json-string-serializer';
import JsonBooleanSerializer from './properties/json-boolean-serializer';
import JsonNumberSerializer from './properties/json-number-serializer';
import JsonCFrameSerializer, { CFrameJson } from './properties/json-cframe-serializer';
import JsonColor3Serializer, { Color3Json } from './properties/json-color3-serializer';
import JsonVector3Serializer from './properties/json-vector3-serializer';
import JsonQuaternionSerializer, { QuaternionJson } from './properties/json-quaternion-serializer';
import JsonMaterialSerializer, { MaterialJson } from './properties/json-material-serializer';
import { hasFieldOfType, isObject, isString, isArray } from '../../../utils/type-guards';
import { Vector3Json } from './properties/json-vector3-serializer';

export type InstanceJsonProperty =
    boolean |
    number |
    string |
    CFrameJson |
    Color3Json |
    ContentJson |
    MaterialJson |
    QuaternionJson | 
    Vector3Json;

function isInstanceJsonProperty(json: unknown): InstanceJsonProperty {
    return JsonBooleanSerializer.verifyObject(json) ||
            JsonNumberSerializer.verifyObject(json) ||
            JsonStringSerializer.verifyObject(json) ||
            JsonCFrameSerializer.verifyObject(json) ||
            JsonColor3Serializer.verifyObject(json) ||
            JsonContentSerializer.verifyObject(json) || 
            JsonContentSerializer.verifyObject(json) ||
            JsonMaterialSerializer.verifyObject(json) ||
            JsonQuaternionSerializer.verifyObject(json) ||
            JsonVector3Serializer.verifyObject(json);
}



export type InstanceJson = {
    className: string;
    properties: {
        name: string;
        [key: string]: InstanceJsonProperty;
    };
    children: InstanceJson[];
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
            hasFieldOfType('properties', json, isObject) &&
            hasFieldOfType('children', json, isArray)
        ) {
            if (!hasFieldOfType('name', json.properties, isString)) {
                return false;
            }

            for (const jsonPropertyName in json.properties) {
                if (!isInstanceJsonProperty((json.properties as any)[jsonPropertyName])) {
                    return false;
                }
            }
            
            for (const jsonChild of json.children) {
                if (!JsonInstanceSerializer.verifyObject(jsonChild)) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }

    public static deserializeObject<TInstance extends Instance>(
        instanceJson: unknown,
        context: InstanceContext,
        instanceType?: Class<TInstance>
    ): TInstance {
        if (!JsonInstanceSerializer.verifyObject(instanceJson)) {
            throw new Error('Invalid json instance object');
        }

        return JsonInstanceSerializer.deserializeObjectUnsafe(instanceJson, context, instanceType);
    }

    public static deserializeObjectUnsafe<TInstance extends Instance>(
        instanceJson: InstanceJson,
        context: InstanceContext,
        instanceType?: Class<TInstance>
    ): TInstance {
        const metadata = getMetaData(instanceJson.className);
        const constructor = getConstructor(instanceJson.className);

        // TODO: Can we construct this instance later so we dont need to call destroy if we throw?

        const instance: TInstance = new constructor(context);

        if (instanceType !== undefined && !instance.isA(instanceType)) {
            instance.destroy();
            throw new Error(`Expected to deserialize "${metadata.className}" but got a "${instanceJson.className}"`);
        }

        const metadataProperties = Array.from(metadata.properties.keys());
        for (const propertyName in instanceJson.properties) {
            if (propertyName === 'parent') {     
                instance.destroy();
                throw new Error(`Unexpected property "${propertyName}"`);
            }

            if (!metadataProperties.some(p => p === propertyName)) {
                instance.destroy();
                throw new Error(`Unexpected property "${propertyName}"`);
            }
        }


        for (const propertyName in instanceJson.properties) {
            if (propertyName === 'parent') {                
                continue;
            }

            const propertyType = metadata.properties.get(propertyName)!.type;

            switch(propertyType) { 
                case PropertyType.number:
                    (instance as any)[propertyName] = JsonNumberSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.boolean:
                    (instance as any)[propertyName] = JsonBooleanSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.string:
                    (instance as any)[propertyName] = JsonStringSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.cframe:
                    (instance as any)[propertyName] = JsonCFrameSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.color3:
                    (instance as any)[propertyName] = JsonColor3Serializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.vector3:
                    (instance as any)[propertyName] = JsonVector3Serializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.quaternion:
                    (instance as any)[propertyName] = JsonQuaternionSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.content:
                    (instance as any)[propertyName] = JsonContentSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
                case PropertyType.material:
                    (instance as any)[propertyName] = JsonMaterialSerializer.deserializeObject(instanceJson.properties[propertyName]);
                    break;
            }
        }

        for (const childJson of instanceJson.children) {
            const child = this.deserializeObject(childJson, context);
            child.parent = instance;
        }
        
        return instance;
    }
}