export abstract class BasePropType
{
    public abstract toJson(instance: any, propName: string): any;
    
    public abstract fromJson(instance: any, propName: string, jsonValue: any): void;
}
