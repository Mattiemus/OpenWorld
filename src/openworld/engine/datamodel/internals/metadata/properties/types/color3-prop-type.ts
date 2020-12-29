import BasePropType from './base-prop-type';

export default class Color3PropType extends BasePropType
{
    public toJson(instance: any, propName: string): [number, number, number] {
        return (instance[propName] as THREE.Vector3).toArray();
    }
    
    public fromJson(instance: any, propName: string, jsonValue: [number, number, number]): void {
        (instance[propName] as THREE.Vector3).fromArray(jsonValue);
    }
}
