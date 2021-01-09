import Material from '../../../data-types/material';
import Content from '../../../data-types/content';
import Color3 from '../../../../math/color3';
import { hasFieldOfType, isObject } from '../../../../utils/type-guards';
import JsonColor3Serializer, { Color3Json } from './json-color3-serializer';
import JsonContentSerializer, { ContentJson } from './json-content-serializer';
import JsonNumberSerializer from './json-number-serializer';

export type MaterialJson = {
    color: Color3Json | ContentJson;
    metalness: number | ContentJson;
    roughness: number | ContentJson ;
    normal: ContentJson | null;
};

export default class JsonMaterialSerializer
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

    public static verifyObject(json: unknown): json is MaterialJson {
        return isObject(json) &&
               hasFieldOfType('color', json, (f: unknown): f is Color3Json | ContentJson => JsonColor3Serializer.verifyObject(f) || JsonContentSerializer.verifyObject(f)) &&
               hasFieldOfType('metalness', json, (f: unknown): f is number | ContentJson => JsonNumberSerializer.verifyObject(f) || JsonContentSerializer.verifyObject(f)) &&
               hasFieldOfType('roughness', json, (f: unknown): f is number | ContentJson => JsonNumberSerializer.verifyObject(f) || JsonContentSerializer.verifyObject(f)) &&
               hasFieldOfType('normal', json, (f: unknown): f is ContentJson | null => f === null || JsonContentSerializer.verifyObject(f));
    }

    public static serializeToObject(obj: Material): MaterialJson {
        return { 
            color: obj.color instanceof Color3 ? JsonColor3Serializer.serializeToObject(obj.color) : JsonContentSerializer.serializeToObject(obj.color),
            metalness: obj.metalness instanceof Content ? JsonContentSerializer.serializeToObject(obj.metalness) : obj.metalness,
            roughness: obj.roughness instanceof Content ? JsonContentSerializer.serializeToObject(obj.roughness) : obj.roughness,
            normal: obj.normal === null ? obj.normal : JsonContentSerializer.serializeToObject(obj.normal)
        };
    }

    public static deserializeObject(json: unknown): Material {
        if (!JsonMaterialSerializer.verifyObject(json)) {
            throw new Error('Invalid json material');
        }

        return new Material(
            JsonColor3Serializer.verifyObject(json.color) ? JsonColor3Serializer.deserializeObject(json.color) : JsonContentSerializer.deserializeObject(json.color),
            JsonNumberSerializer.verifyObject(json.metalness) ? JsonNumberSerializer.deserializeObject(json.metalness) : JsonContentSerializer.deserializeObject(json.metalness),
            JsonNumberSerializer.verifyObject(json.roughness) ? JsonNumberSerializer.deserializeObject(json.roughness) : JsonContentSerializer.deserializeObject(json.roughness),
            json.normal === null ? null : JsonContentSerializer.deserializeObject(json.normal)
        );
    }

    public static deserializeObjectUnsafe(json: MaterialJson): Material {
        return new Material(
            JsonColor3Serializer.verifyObject(json.color) ? JsonColor3Serializer.deserializeObject(json.color) : JsonContentSerializer.deserializeObject(json.color),
            JsonNumberSerializer.verifyObject(json.metalness) ? JsonNumberSerializer.deserializeObject(json.metalness) : JsonContentSerializer.deserializeObject(json.metalness),
            JsonNumberSerializer.verifyObject(json.roughness) ? JsonNumberSerializer.deserializeObject(json.roughness) : JsonContentSerializer.deserializeObject(json.roughness),
            json.normal === null ? null : JsonContentSerializer.deserializeObject(json.normal)
        );
    }
}
