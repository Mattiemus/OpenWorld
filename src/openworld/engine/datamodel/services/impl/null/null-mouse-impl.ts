import MouseImpl from '../mouse-impl';

import { Signal } from 'typed-signals';
import { injectable } from 'inversify';

@injectable()
export default class NullMouseImpl extends MouseImpl
{
    private _leftButtonDown = new Signal<() => void>();
    private _leftButtonUp = new Signal<() => void>();
    private _rightButtonDown = new Signal<() => void>();
    private _rightButtonUp = new Signal<() => void>();
    private _move = new Signal<(deltaX: number, deltaY: number) => void>();
    private _wheelDown = new Signal<() => void>();
    private _wheelUp = new Signal<() => void>();

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
        return false;
    }

    public get isLeftButtonUp(): boolean {
        return true;
    }

    public get isRightButtonDown(): boolean {
        return false;
    }

    public get isRightButtonUp(): boolean {
        return true;
    }

    public get x(): number {
        return 0;
    }

    public get y(): number {
        return 0;
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        this._leftButtonDown.disconnectAll();
        this._leftButtonUp.disconnectAll();
        this._rightButtonDown.disconnectAll();
        this._rightButtonUp.disconnectAll();
        this._move.disconnectAll();
        this._wheelDown.disconnectAll();
        this._wheelUp.disconnectAll();
    }
}