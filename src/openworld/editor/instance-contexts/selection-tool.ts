export enum SelectionToolMode {
    Pointer,
    Move,
    Scale,
    Rotate
}

export default class SelectionTool {
    
    private _mode = SelectionToolMode.Pointer;





    public get mode(): SelectionToolMode {
        return this._mode;
    }
    public set mode(newValue: SelectionToolMode) {
        this._mode = newValue;
    }
}