import { Constructor } from '../../../../utils/types';
import { BasePropType } from './base-prop-type';
import { Vector3PropType } from './vector3-prop-type';
import { QuaternionPropType } from './quaternion-prop-type';
import { InstanceRefPropType } from './instance-ref-prop-type';
import { EnumPropType } from './enum-prop-type';
import { LiteralPropType } from './literal-prop-type';
import { getMetaData } from '../metadata';
import { Instance } from '../../../core/instance';

export class PropType
{
    public static get vector3(): BasePropType {
        return new Vector3PropType();
    }

    public static get quaternion(): BasePropType {
        return new QuaternionPropType();
    }

    public static get string(): BasePropType {
        return new LiteralPropType<string>();
    }

    public static get number(): BasePropType {
        return new LiteralPropType<number>();
    }

    public static get boolean(): BasePropType {
        return new LiteralPropType<boolean>();
    }

    public static get instanceRef(): BasePropType {
        return new InstanceRefPropType(Instance);
    }

    public static instanceRefT<T extends Instance>(constructor: string | Constructor<T>): BasePropType {
        return new InstanceRefPropType(constructor);
    }
    
    public static enum<T>(e: { [K in keyof T]: any; }): BasePropType {
        return new EnumPropType<T>(e);
    }
}
