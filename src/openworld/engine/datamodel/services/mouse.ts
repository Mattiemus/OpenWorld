import { DataModelClass } from "../internals/metadata/metadata";
import Instance from '../elements/instance';
import PropertyType from '../internals/metadata/properties/property-type';
import MouseImpl from '../../services/mouse-impl';
import ForwardingSignal from '../internals/forwarding-signal';
import MathEx from '../../math/mathex';
import InstanceContext from "../internals/instance-context";

import { Signal, SignalConnection } from 'typed-signals';

@DataModelClass({
    className: 'Mouse',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable', 'NotReplicated', 'EditorHidden' ],
    properties: {
        isLeftButtonDown: {
            name: 'isLeftButtonDown',
            type: PropertyType.boolean,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        isLeftButtonUp: {
            name: 'isLeftButtonUp',
            type: PropertyType.boolean,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        isRightButtonDown: {
            name: 'isRightButtonDown',
            type: PropertyType.boolean,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        isRightButtonUp: {
            name: 'isRightButtonUp',
            type: PropertyType.boolean,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        x: {
            name: 'x',
            type: PropertyType.number,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        y: {
            name: 'y',
            type: PropertyType.number,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        }
    }
})
export default class Mouse extends Instance
{
    private _impl: MouseImpl;

    private _leftButtonDown: ForwardingSignal<() => void>;
    private _leftButtonUp: ForwardingSignal<() => void>;
    private _rightButtonDown: ForwardingSignal<() => void>;
    private _rightButtonUp: ForwardingSignal<() => void>;
    private _move: ForwardingSignal<() => void>;
    private _wheelDown: ForwardingSignal<() => void>;
    private _wheelUp: ForwardingSignal<() => void>;

    private _leftButtonDownConnection: SignalConnection;
    private _leftButtonUpConnection: SignalConnection;
    private _rightButtonDownConnection: SignalConnection;
    private _rightButtonUpConnection: SignalConnection;
    private _moveConnection: SignalConnection;

    constructor(context: InstanceContext, refId?: string) {
        super(context, refId);

        this._impl = context.getServiceImpl(MouseImpl);
        this._impl.attatch(this);

        this._leftButtonDown = new ForwardingSignal(this._impl.leftButtonDown);
        this._leftButtonUp = new ForwardingSignal(this._impl.leftButtonUp);
        this._rightButtonDown = new ForwardingSignal(this._impl.rightButtonDown);
        this._rightButtonUp = new ForwardingSignal(this._impl.rightButtonUp);
        this._move = new ForwardingSignal(this._impl.move);
        this._wheelDown = new ForwardingSignal(this._impl.wheelDown);
        this._wheelUp = new ForwardingSignal(this._impl.wheelUp);

        this._leftButtonDownConnection = this._impl.leftButtonDown.connect(this.onLeftButtonDownOrUp.bind(this));
        this._leftButtonUpConnection = this._impl.leftButtonUp.connect(this.onLeftButtonDownOrUp.bind(this));
        this._rightButtonDownConnection = this._impl.rightButtonDown.connect(this.onRightButtonDownOrUp.bind(this));
        this._rightButtonUpConnection = this._impl.rightButtonUp.connect(this.onRightButtonDownOrUp.bind(this));
        this._moveConnection = this._impl.move.connect(this.onMove.bind(this));

        this.finishConstruction(refId);
    }   

    // 
    // Signals
    //

    public get leftButtonDown(): Signal<() => void> {
        this.throwIfDestroyed();
        return this._leftButtonDown.signal;
    }

    public get leftButtonUp(): Signal<() => void> {
        this.throwIfDestroyed();
        return this._leftButtonUp.signal;
    }

    public get rightButtonDown(): Signal<() => void> {
        this.throwIfDestroyed();
        return this._rightButtonDown.signal;
    }

    public get rightButtonUp(): Signal<() => void> {
        this.throwIfDestroyed();
        return this._rightButtonUp.signal;
    }

    public get move(): Signal<(deltaX: number, deltaY: number) => void> {
        this.throwIfDestroyed();
        return this._move.signal;
    }

    public get wheelDown(): Signal<() => void> {
        this.throwIfDestroyed();
        return this._wheelDown.signal;
    }

    public get wheelUp(): Signal<() => void> {
        this.throwIfDestroyed();
        return this._wheelUp.signal;
    }

    //
    // Properties
    //

    public get isLeftButtonDown(): boolean {
        this.throwIfDestroyed();
        return this._impl.isLeftButtonDown;
    }

    public get isLeftButtonUp(): boolean {
        this.throwIfDestroyed();
        return this._impl.isLeftButtonUp;
    }

    public get isRightButtonDown(): boolean {
        this.throwIfDestroyed();
        return this._impl.isRightButtonDown;
    }

    public get isRightButtonUp(): boolean {
        this.throwIfDestroyed();
        return this._impl.isRightButtonUp;
    }

    public get x(): number {
        this.throwIfDestroyed();
        return this._impl.x;
    }

    public get y(): number {
        this.throwIfDestroyed();
        return this._impl.y;
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        this._impl.detatch(this);

        this._leftButtonDown.destroy();
        this._leftButtonUp.destroy();
        this._rightButtonDown.destroy();
        this._rightButtonUp.destroy();
        this._move.destroy();
        this._wheelDown.destroy();
        this._wheelUp.destroy();

        this._leftButtonDownConnection.disconnect();
        this._leftButtonUpConnection.disconnect();
        this._rightButtonDownConnection.disconnect();
        this._rightButtonUpConnection.disconnect();
        this._moveConnection.disconnect();
    }

    private onLeftButtonDownOrUp(): void {
        this.firePropertyChanged('leftButtonDown');
        this.firePropertyChanged('leftButtonUp');
    }

    private onRightButtonDownOrUp(): void {
        this.firePropertyChanged('leftButtonDown');
        this.firePropertyChanged('leftButtonUp');
    }

    private onMove(deltaX: number, deltaY: number): void {
        if (!MathEx.isApproxZero(deltaX)) {
            this.firePropertyChanged('x');
        }

        if (!MathEx.isApproxZero(deltaX)) {
            this.firePropertyChanged('y');
        }
    }
}