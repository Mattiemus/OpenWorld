import BasePropType from './base-prop-type';
import CFrame from '../../../../../math/cframe';

export default class CFramePropType extends BasePropType
{
    public toJson(v: CFrame, propName: string): [number, number, number, number, number, number, number] {        
        return [ v.x, v.y, v.z, v.qx, v.qy, v.qz, v.qw ];
    }
    
    public fromJson(instance: any, propName: string, jsonValue: [number, number, number, number, number, number, number]): void {
        (instance[propName] as CFrame) = new CFrame(...jsonValue);
    }
}
