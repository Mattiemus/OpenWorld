import { MouseImpl } from '../../../engine/services/input/mouse-impl';

import { Signal } from 'typed-signals';

export class BrowserMouseImpl extends MouseImpl
{
    private _isLeftButtonDown: boolean = false;
    private _isRightButtonDown: boolean = false;
    private _mouseX: number = 0;
    private _mouseY: number = 0;

    private _leftButtonDown: Signal<() => void> =
        new Signal<() => void>();
    private _leftButtonUp: Signal<() => void> =
        new Signal<() => void>();
    private _rightButtonDown: Signal<() => void> =
        new Signal<() => void>();
    private _rightButtonUp: Signal<() => void> =
        new Signal<() => void>();
    private _move: Signal<(deltaX: number, deltaY: number) => void> =
        new Signal<(deltaX: number, deltaY: number) => void>();
    private _wheelDown: Signal<() => void> =
        new Signal<() => void>();
    private _wheelUp: Signal<() => void> =
        new Signal<() => void>();

    //
    // Constructor
    //

    constructor() {
        super();

        document.body.addEventListener('mousedown', this.onMouseDown);
        document.body.addEventListener('mouseup', this.onMouseUp);
        document.body.addEventListener('mousemove', this.onMouseMove);
        document.body.addEventListener('wheel', this.onMouseWheel);
        document.body.addEventListener('contextmenu', this.onContextMenu);
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
        return this._mouseX;
    }

    public get y(): number {
        return this._mouseY;
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        document.body.removeEventListener('mousedown', this.onMouseDown);
        document.body.removeEventListener('mouseup', this.onMouseUp);
        document.body.removeEventListener('mousemove', this.onMouseMove);
        document.body.removeEventListener('wheel', this.onMouseWheel);
        document.body.removeEventListener('contextmenu', this.onContextMenu);
    }

    private onMouseDown = (e: MouseEvent): void => {
        switch (e.button) {
            case 0:
                this._isLeftButtonDown = true;
                this._leftButtonDown.emit();
                break;
            case 2:
                this._isRightButtonDown = true;
                this._rightButtonDown.emit();
                break;
        }
    }

    private onMouseUp = (e: MouseEvent): void => {
        switch (e.button) {
            case 0:
                this._isLeftButtonDown = false;
                this._leftButtonUp.emit();
                break;
            case 2:
                this._isRightButtonDown = false;
                this._rightButtonUp.emit();
                break;
        }
    }

    private onMouseMove = (e: MouseEvent): void => {
        const deltaX = e.clientX - this._mouseX;
        const deltaY = e.clientY - this._mouseY;

        this._mouseX = e.clientX;
        this._mouseY = e.clientY;

        this._move.emit(deltaX, deltaY);
    }

    private onMouseWheel = (e: WheelEvent): void => {
        if (e.deltaY < 0.0) {
            this._wheelUp.emit();
        } else if (e.deltaY > 0.0) {
            this._wheelDown.emit();
        }
    }

    private onContextMenu = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    }
}