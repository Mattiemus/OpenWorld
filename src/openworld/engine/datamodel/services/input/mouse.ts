import { DataModelClass } from '../../../../../shared/datamodel/internals/metadata/metadata';
import { Instance } from '../../../../../shared/datamodel/core/instance';
import { PropType } from '../../../../../shared/datamodel/internals/metadata/properties/prop-type';
import { MouseInputImpl } from './impl/mouse-input-impl';
import { getService } from '../../../../../shared/datamodel/internals/service-locator';
import { ForwardingSignal } from '../../../../../shared/datamodel/internals/forwarding-signal';

import { Signal } from 'typed-signals';


@DataModelClass({
    className: 'Mouse',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated' ],
    properties: {
        isLeftMouseButtonDown: {
            name: 'isLeftMouseButtonDown',
            type: PropType.boolean,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        isLeftMouseButtonUp: {
            name: 'isLeftMouseButtonUp',
            type: PropType.boolean,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        isRightMouseButtonDown: {
            name: 'isRightMouseButtonDown',
            type: PropType.boolean,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        isRightMouseButtonUp: {
            name: 'isRightMouseButtonUp',
            type: PropType.boolean,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        x: {
            name: 'x',
            type: PropType.number,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        y: {
            name: 'y',
            type: PropType.number,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        }
    }
})
export class Mouse extends Instance
{
    private _mouseInput: MouseInputImpl;

    private _leftButtonDown: ForwardingSignal<() => void>;
    private _leftButtonUp: ForwardingSignal<() => void>;
    private _rightButtonDown: ForwardingSignal<() => void>;
    private _rightButtonUp: ForwardingSignal<() => void>;
    private _move: ForwardingSignal<() => void>;
    private _wheelDown: ForwardingSignal<() => void>;
    private _wheelUp: ForwardingSignal<() => void>;

    constructor() {
        super();

        this._mouseInput = getService(MouseInputImpl);

        this._leftButtonDown = new ForwardingSignal(this._mouseInput.leftButtonDown);
        this._leftButtonUp = new ForwardingSignal(this._mouseInput.leftButtonUp);
        this._rightButtonDown = new ForwardingSignal(this._mouseInput.rightButtonDown);
        this._rightButtonUp = new ForwardingSignal(this._mouseInput.rightButtonUp);
        this._move = new ForwardingSignal(this._mouseInput.move);
        this._wheelDown = new ForwardingSignal(this._mouseInput.wheelDown);
        this._wheelUp = new ForwardingSignal(this._mouseInput.wheelUp);
    }   

    // 
    // Events
    //

    public get leftButtonDown(): Signal<() => void> {
        return this._leftButtonDown.signal;
    }

    public get leftButtonUp(): Signal<() => void> {
        return this._leftButtonUp.signal;
    }

    public get rightButtonDown(): Signal<() => void> {
        return this._rightButtonDown.signal;
    }

    public get rightButtonUp(): Signal<() => void> {
        return this._rightButtonUp.signal;
    }

    public get move(): Signal<(deltaX: number, deltaY: number) => void> {
        return this._move.signal;
    }

    public get wheelDown(): Signal<() => void> {
        return this._wheelDown.signal;
    }

    public get wheelUp(): Signal<() => void> {
        return this._wheelUp.signal;
    }

    //
    // Properties
    //

    public get isLeftButtonDown(): boolean {
        return this._mouseInput.isLeftButtonDown;
    }

    public get isLeftButtonUp(): boolean {
        return this._mouseInput.isLeftButtonUp;
    }

    public get isRightButtonDown(): boolean {
        return this._mouseInput.isRightButtonDown;
    }

    public get isRightButtonUp(): boolean {
        return this._mouseInput.isRightButtonUp;
    }

    public get x(): number {
        return this._mouseInput.x;
    }

    public get y(): number {
        return this._mouseInput.y;
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        this._leftButtonDown.destroy();
        this._leftButtonUp.destroy();
        this._rightButtonDown.destroy();
        this._rightButtonUp.destroy();
        this._move.destroy();
        this._wheelDown.destroy();
        this._wheelUp.destroy();
    }
}