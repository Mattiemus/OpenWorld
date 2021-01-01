import Instance from "../../../elements/instance";
import { Constructor } from "../../../../utils/types";
import InstanceContext from '../../instance-context';

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

    //
    // Constructor
    //

    private constructor() {
        // No-op
    }

    //
    // Methods
    //

    public static instanceRef<T extends Instance>(constructor: string | Constructor<T, [InstanceContext]>): PropertyType {
        // TODO: This needs to return a unique value for each instance type
        return new PropertyType();
    }
    
    public static enum<T>(e: { [K in keyof T]: any; }): PropertyType {
        // TODO: This needs to return a unique value for each enum type
        return new PropertyType();
    }
}
