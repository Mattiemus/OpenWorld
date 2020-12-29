import { Constructor } from '../../../../../utils/types';
import BasePropType from './base-prop-type';
import Vector3PropType from './vector3-prop-type';
import QuaternionPropType from './quaternion-prop-type';
import InstanceRefPropType from './instance-ref-prop-type';
import EnumPropType from './enum-prop-type';
import LiteralPropType from './literal-prop-type';
import CFramePropType from './cframe-prop-type';
import Instance from '../../../../elements/instance';
import Color3PropType from './color3-prop-type';

export default class PropType
{
    public static get number(): BasePropType {
        return new LiteralPropType<number>();
    }

    public static get boolean(): BasePropType {
        return new LiteralPropType<boolean>();
    }

    public static get string(): BasePropType {
        return new LiteralPropType<string>();
    }

    public static instanceRef<T extends Instance>(constructor: string | Constructor<T>): BasePropType {
        return new InstanceRefPropType(constructor);
    }
    
    public static enum<T>(e: { [K in keyof T]: any; }): BasePropType {
        return new EnumPropType<T>(e);
    }

    public static get cframe(): BasePropType {
        return new CFramePropType();
    }




    // TODO: Need to fix these as they target THREE types, not our math types...

    public static get color3(): BasePropType {
        return new Color3PropType();
    }

    public static get vector3(): BasePropType {
        return new Vector3PropType();
    }

    public static get quaternion(): BasePropType {
        return new QuaternionPropType();
    }
}
