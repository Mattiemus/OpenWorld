import { Instance } from '../../elements/core/instance';
import { DataModelClass } from '../../internals/metadata/metadata';
import { PropType } from "../../internals/metadata/properties/prop-type";
import { WorldRenderSystemImpl } from './impl/world-render-system-impl';
import { getService } from '../../internals/service-locator';
import { Camera } from '../../elements/world/camera';
import { WorldPhysicsSystemImpl } from './impl/world-physics-system-impl';

import { SignalConnection } from 'typed-signals';

@DataModelClass({
    className: 'World',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable' ],
    properties: {
        currentCamera: {
            name: 'currentCamera',
            type: PropType.instanceRef(Camera),
            attributes: [ 'NotReplicated' ]
        }
    }
})
export class World extends Instance
{
    private _worldRenderSystem: WorldRenderSystemImpl;
    private _worldPhysicsSystem: WorldPhysicsSystemImpl;

    private _currentCameraChangedConnection: SignalConnection;

    constructor() {
        super();
        
        this._worldRenderSystem = getService(WorldRenderSystemImpl);
        this._worldPhysicsSystem = getService(WorldPhysicsSystemImpl);

        this._currentCameraChangedConnection = this._worldRenderSystem.currentCameraChanged.connect(() => {
            this.processChangedProperty('currentCamera');
        });
    }

    public get currentCamera(): Camera {
        this.throwIfDestroyed();
        return this._worldRenderSystem.currentCamera;
    }
    public set currentCamera(newCamera: Camera) {
        this.throwIfDestroyed();
        this._worldRenderSystem.currentCamera = newCamera;
    }

    protected onChildRemoved(child: Instance): void {
        super.onChildRemoved(child);
        this._worldRenderSystem.onInstanceRemovedFromWorld(child);
    }

    protected onChildAdded(child: Instance): void {
        super.onChildAdded(child);
        this._worldRenderSystem.onInstanceAddedToWorld(child);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this._currentCameraChangedConnection.disconnect();
    }
}