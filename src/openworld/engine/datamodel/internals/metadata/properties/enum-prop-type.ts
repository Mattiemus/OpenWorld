import { BasePropType } from './base-prop-type';

export class EnumPropType<T> extends BasePropType
{
    constructor(private _e: { [K in keyof T]: any; }) {
        super();
    }

    public toJson(instance: any, propName: string): any {
        return instance[propName];
    }

    public fromJson(instance: any, propName: string, jsonValue: any): void {
        // TODO: Verify value is one of this._e
        instance[propName] = jsonValue;
    }
}
