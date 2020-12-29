import { BasePropType } from './base-prop-type';

export class QuaternionPropType extends BasePropType
{
    public toJson(instance: any, propName: string): [number, number, number, number] {
        return (instance[propName] as THREE.Quaternion).toArray() as [number, number, number, number];
    }

    public fromJson(instance: any, propName: string, jsonValue: [number, number, number, number]): void {
        (instance[propName] as THREE.Quaternion).fromArray(jsonValue);
    }
}
