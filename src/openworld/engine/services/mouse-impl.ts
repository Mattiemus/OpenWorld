import { Signal } from 'typed-signals';
import DataModelServiceBase from './base/data-model-service-base';
import Mouse from '../datamodel/services/mouse';

export default abstract class MouseImpl extends DataModelServiceBase<Mouse>
{
    //
    // Signals
    //

    public abstract get leftButtonDown(): Signal<() => void>;
    public abstract get leftButtonUp(): Signal<() => void>;
    public abstract get rightButtonDown(): Signal<() => void>;
    public abstract get rightButtonUp(): Signal<() => void>;
    public abstract get move(): Signal<(deltaX: number, deltaY: number) => void>;
    public abstract get wheelDown(): Signal<() => void>;
    public abstract get wheelUp(): Signal<() => void>;

    //
    // Properties
    //

    public abstract get isLeftButtonDown(): boolean;

    public abstract get isLeftButtonUp(): boolean;

    public abstract get isRightButtonDown(): boolean;

    public abstract get isRightButtonUp(): boolean;

    public abstract get x(): number;

    public abstract get y(): number;
}