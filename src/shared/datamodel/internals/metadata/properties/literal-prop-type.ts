import { BasePropType } from './base-prop-type';

export class LiteralPropType<T> extends BasePropType
{
    public toJson(instance: any, propName: string): T {
        return instance[propName];
    }
    
    public fromJson(instance: any, propName: string, jsonValue: T): void {
        instance[propName] = jsonValue;
    }
}
