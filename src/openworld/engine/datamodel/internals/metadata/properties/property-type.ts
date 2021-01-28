import Instance from "../../../elements/instance";
import { Class } from '../../../../utils/types';
import { isString } from "../../../../utils/type-guards";
import { getMetaData } from "../metadata";

export default class PropertyType
{
    public static readonly number = new PropertyType(undefined, undefined);
    public static readonly boolean = new PropertyType(undefined, undefined);
    public static readonly string = new PropertyType(undefined, undefined);
    public static readonly cframe = new PropertyType(undefined, undefined);
    public static readonly color3 = new PropertyType(undefined, undefined);
    public static readonly vector3 = new PropertyType(undefined, undefined);
    public static readonly quaternion = new PropertyType(undefined, undefined);
    public static readonly content = new PropertyType(undefined, undefined);
    public static readonly material = new PropertyType(undefined, undefined);

    private static _instanceRefPropertyTypeCache = new Map<string, PropertyType>();
    private static _enumPropertyTypeCache = new Map<object, PropertyType>();

    private _isInstanceRef: boolean = false;
    private _isEnum: boolean = false;

    //
    // Constructor
    //

    private constructor(
        private _enum: { [key: string]: string; } | undefined, 
        private _instanceRefClassName: string | undefined
    ) {
        // No-op
    }

    //
    // Properties
    //

    public get isInstanceRef(): boolean {
        return this._isInstanceRef;
    }

    public get isEnum(): boolean {
        return this._isEnum;
    }

    public get enumValue(): { [key: string]: string; } | undefined {
        return this._enum;
    }

    public get instanceRefClassName(): string | undefined {
        return this._instanceRefClassName;
    }

    //
    // Methods
    //

    public static instanceRef<T extends Instance>(constructor: string | Class<T>): PropertyType {
        if (!isString(constructor)) {
            const metadata = getMetaData(constructor);
            constructor = metadata.className;
        }

        const existingPropertyType = PropertyType._instanceRefPropertyTypeCache.get(constructor);
        if (existingPropertyType !== undefined) {
            return existingPropertyType;
        }

        const instanceRefPropertyType = new PropertyType(undefined, constructor);
        instanceRefPropertyType._isInstanceRef = true;

        PropertyType._instanceRefPropertyTypeCache.set(constructor, instanceRefPropertyType);

        return instanceRefPropertyType;
    }
    
    public static enum<T>(e: { [K in keyof T]: string; }): PropertyType {
        const existingPropertyType = PropertyType._enumPropertyTypeCache.get(e);
        if (existingPropertyType !== undefined) {
            return existingPropertyType;
        }

        const enumPropertyType = new PropertyType(e, undefined);
        enumPropertyType._isEnum = true;

        PropertyType._enumPropertyTypeCache.set(e, enumPropertyType);

        return enumPropertyType;
    }
}
