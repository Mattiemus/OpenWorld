import { IDestroyable } from "../utils/interfaces";

export class ServiceBase implements IDestroyable {
    private _isDestroyed: boolean = false;
    
    //
    // Methods
    //

    public destroy(): void {
        if (this._isDestroyed) {
            return;
        }


        this.onDestroy();

        this._isDestroyed = true;
    }

    protected throwIfDestroyed(): void {
        if (this._isDestroyed) {
            throw new Error('Service has been destroyed');
        }
    }

    protected onDestroy(): void {
        // No-op
    }
}