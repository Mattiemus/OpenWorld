import Destroyable from "../../../../utils/destroyable";
import MouseImpl from "../../../../datamodel/services/impl/mouse-impl";
import InterThreadCommunication from "../../../inter-thread-communication";
import { SignalConnection } from "typed-signals";

export default class WorkerMouseImplProxy extends Destroyable
{
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

    constructor(private _comms: InterThreadCommunication, mouseImpl: MouseImpl) {
        super();

        this._mouseLeftButtonDownConnection =
            mouseImpl.leftButtonDown.connect(this.onMouseLeftButtonDown.bind(this));

        this._mouseLeftButtonUpConnection =
            mouseImpl.leftButtonUp.connect(this.onMouseLeftButtonUp.bind(this));

        this._mouseRightButtonDownConnection =
            mouseImpl.rightButtonDown.connect(this.onMouseRightButtonDown.bind(this));

        this._mouseRightButtonUpConnection = 
            mouseImpl.rightButtonUp.connect(this.onMouseRightButtonUp.bind(this));

        this._mouseMoveConnection =
            mouseImpl.move.connect(this.onMouseMove.bind(this));

        this._mouseWheelDownConnection =
            mouseImpl.wheelDown.connect(this.onMouseWheelDown.bind(this));

        this._mouseWheelUpConnection =
            mouseImpl.wheelUp.connect(this.onMouseWheelUp.bind(this));
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
    }

    private onMouseLeftButtonDown(): void {
        this._comms.fireSignal('Mouse:LeftButtonDown', null);
    }

    private onMouseLeftButtonUp(): void {
        this._comms.fireSignal('Mouse:LeftButtonUp', null);
    }

    private onMouseRightButtonDown(): void {
        this._comms.fireSignal('Mouse:RightButtonDown', null);
    }

    private onMouseRightButtonUp(): void {
        this._comms.fireSignal('Mouse:RightButtonUp', null);
    }

    private onMouseMove(deltaX: number, deltaY: number): void {
        this._comms.fireSignal('Mouse:Move', { deltaX, deltaY });
    }

    private onMouseWheelUp(): void {        
        this._comms.fireSignal('Mouse:WheelUp', null);
    }

    private onMouseWheelDown(): void {
        this._comms.fireSignal('Mouse:WheelDown', null);
    }
}