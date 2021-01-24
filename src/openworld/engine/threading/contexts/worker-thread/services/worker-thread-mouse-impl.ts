import MouseImpl from '../../../../services/mouse-impl';
import { injectable, inject } from 'inversify';
import { Signal, SignalConnection } from 'typed-signals';
import InterThreadCommunication from '../../../inter-thread-communication';

@injectable()
export default class WorkerThreadMouseImpl extends MouseImpl
{
    private _isLeftButtonDown = false;
    private _isRightButtonDown = false;
    private _x = 0;
    private _y = 0;

    private _leftButtonDown = new Signal<() => void>();
    private _leftButtonUp = new Signal<() => void>();
    private _rightButtonDown = new Signal<() => void>();
    private _rightButtonUp = new Signal<() => void>();
    private _move = new Signal<(deltaX: number, deltaY: number) => void>();
    private _wheelDown = new Signal<() => void>();
    private _wheelUp = new Signal<() => void>();

    private _mouseLeftButtonDownConnection: SignalConnection;
    private _mouseLeftButtonUpConnection: SignalConnection;
    private _mouseRightButtonDownConnection: SignalConnection;
    private _mouseRightButtonUpConnection: SignalConnection;
    private _mouseMoveConnection: SignalConnection;
    private _mouseWheelDownConnection: SignalConnection;
    private _mouseWheelUpConnection: SignalConnection;
    
    //
    // Constructor
    //

    constructor(@inject(InterThreadCommunication) comms: InterThreadCommunication) {
        super();

        this._mouseLeftButtonDownConnection =
            comms.addSignalHandler(
                'Mouse:LeftButtonDown',
                this.onMouseLeftButtonDown.bind(this));

        this._mouseLeftButtonUpConnection =
            comms.addSignalHandler(
                'Mouse:LeftButtonUp',
                this.onMouseLeftButtonUp.bind(this));
                
        this._mouseRightButtonDownConnection =
            comms.addSignalHandler(
                'Mouse:RightButtonDown',
                this.onMouseRightButtonDown.bind(this));

        this._mouseRightButtonUpConnection =
            comms.addSignalHandler(
                'Mouse:RightButtonUp',
                this.onMouseRightButtonUp.bind(this));

        this._mouseMoveConnection =
            comms.addSignalHandler(
                'Mouse:Move',
                this.onMouseMove.bind(this));

        this._mouseWheelDownConnection =
            comms.addSignalHandler(
                'Mouse:WheelDown',
                this.onMouseWheelDown.bind(this));

        this._mouseWheelUpConnection =
            comms.addSignalHandler(
                'Mouse:WheelUp',
                this.onMouseWheelUp.bind(this));
    }

    // 
    // Signals
    //

    public get leftButtonDown(): Signal<() => void> {
        return this._leftButtonDown;
    }

    public get leftButtonUp(): Signal<() => void> {
        return this._leftButtonUp;
    }

    public get rightButtonDown(): Signal<() => void> {
        return this._rightButtonDown;
    }

    public get rightButtonUp(): Signal<() => void> {
        return this._rightButtonUp;
    }

    public get move(): Signal<(deltaX: number, deltaY: number) => void> {
        return this._move;
    }

    public get wheelDown(): Signal<() => void> {
        return this._wheelDown;
    }

    public get wheelUp(): Signal<() => void> {
        return this._wheelUp;
    }

    //
    // Properties
    //

    public get isLeftButtonDown(): boolean {
        return this._isLeftButtonDown;
    }

    public get isLeftButtonUp(): boolean {
        return !this._isLeftButtonDown;
    }

    public get isRightButtonDown(): boolean {
        return this._isRightButtonDown;
    }

    public get isRightButtonUp(): boolean {
        return !this._isRightButtonDown;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        this._mouseLeftButtonDownConnection.disconnect();
        this._mouseLeftButtonUpConnection.disconnect();
        this._mouseRightButtonDownConnection.disconnect();
        this._mouseRightButtonUpConnection.disconnect();
        this._mouseMoveConnection.disconnect();
        this._mouseWheelDownConnection.disconnect();
        this._mouseWheelUpConnection.disconnect();

        this._leftButtonDown.disconnectAll();
        this._leftButtonUp.disconnectAll();
        this._rightButtonDown.disconnectAll();
        this._rightButtonUp.disconnectAll();
        this._move.disconnectAll();
        this._wheelDown.disconnectAll();
        this._wheelUp.disconnectAll();
    }

    private onMouseLeftButtonDown(): void {
        this._isLeftButtonDown = true;
        this._leftButtonDown.emit();
    }

    private onMouseLeftButtonUp(): void {
        this._isLeftButtonDown = false;
        this._leftButtonUp.emit();
    }

    private onMouseRightButtonDown(): void {
        this._isRightButtonDown = true;
        this._rightButtonDown.emit();
    }

    private onMouseRightButtonUp(): void {
        this._isRightButtonDown = false;
        this._rightButtonUp.emit();
    }

    private onMouseMove(payload: { deltaX: number, deltaY: number }): void {
        this._move.emit(payload.deltaX, payload.deltaY);
    }

    private onMouseWheelUp(): void {
        this._wheelUp.emit();
    }

    private onMouseWheelDown(): void {
        this._wheelDown.emit();
    }
}