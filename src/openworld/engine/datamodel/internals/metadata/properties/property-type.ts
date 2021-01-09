import Instance from "../../../elements/instance";
import { Constructor } from '../../../../utils/types';
import InstanceContext from '../../instance-context';
import { isString } from "../../../../utils/type-guards";
import { getMetaData } from "../metadata";

export default class PropertyType
{
    public static readonly number = new PropertyType();
    public static readonly boolean = new PropertyType();
    public static readonly string = new PropertyType();
    public static readonly cframe = new PropertyType();
    public static readonly color3 = new PropertyType();
    public static readonly vector3 = new PropertyType();
    public static readonly quaternion = new PropertyType();
    public static readonly content = new PropertyType();
    public static readonly material = new PropertyType();

    private static _instanceRefPropertyTypeCache = new Map<string, PropertyType>();
    private static _enumPropertyTypeCache = new Map<object, PropertyType>();

    private _isInstanceRef: boolean = false;
    private _isEnum: boolean = false;

    //
    // Constructor
    //

    private constructor() {
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

    //
    // Methods
    //

    public static instanceRef<T extends Instance>(constructor: string | Constructor<T, [InstanceContext]>): PropertyType {
        if (!isString(constructor)) {
            const metadata = getMetaData(constructor);
            constructor = metadata.className;
        }

        const existingPropertyType = PropertyType._instanceRefPropertyTypeCache.get(constructor);
        if (existingPropertyType !== undefined) {
            return existingPropertyType;
        }

        const instanceRefPropertyType = new PropertyType();
        instanceRefPropertyType._isInstanceRef = true;

        PropertyType._instanceRefPropertyTypeCache.set(constructor, instanceRefPropertyType);

        return instanceRefPropertyType;
    }
    
    public static enum<T>(e: { [K in keyof T]: string; }): PropertyType {
        const existingPropertyType = PropertyType._enumPropertyTypeCache.get(e);
        if (existingPropertyType !== undefined) {
            return existingPropertyType;
        }

        const enumPropertyType = new PropertyType();
        enumPropertyType._isEnum = true;

        PropertyType._enumPropertyTypeCache.set(e, enumPropertyType);

        return enumPropertyType;
    }
}
