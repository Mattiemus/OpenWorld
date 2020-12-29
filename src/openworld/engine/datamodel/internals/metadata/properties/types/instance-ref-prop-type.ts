import { InstanceManager } from '../../../instance-manager';
import { BasePropType } from './base-prop-type';
import { Class } from '../../../../../utils/types';
import { Instance } from '../../../../elements/core/instance';

export class InstanceRefPropType extends BasePropType
{
    constructor(private _baseType: string | Class<Instance>) {
        super();
    }

    public toJson(instance: any, propName: string): string {
        return InstanceManager.getInstanceRefId(instance[propName]);
    }

    public fromJson(instance: any, propName: string, jsonValue: string): void {
        const referenced = InstanceManager.getInstanceFromRefId(jsonValue);

        if (referenced === undefined) {
            throw new Error(`Instance reference "${jsonValue}" does not exist`);
        }

        if (!referenced.isA(this._baseType)) {
            throw new Error(`Instance reference "${jsonValue}" known as "${referenced.getFullName()}" is not castable to the expected base type "${this._baseType}"`);
        }
        
        instance[propName] = InstanceManager.getInstanceFromRefId(jsonValue);
    }
}
