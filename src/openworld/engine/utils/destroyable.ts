import { IDestroyable } from "./interfaces";

import { injectable } from "inversify";

@injectable()
export default class Destroyable implements IDestroyable {
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
            throw new Error('Object has been destroyed');
        }
    }

    protected onDestroy(): void {
        // No-op
    }
}