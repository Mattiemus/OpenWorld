import { Instance } from '../../elements/core/instance';
import { DataModelClass } from '../../internals/metadata/metadata';
import { PropType } from "../../internals/metadata/properties/prop-type";
import { WorldRenderSystemImpl } from './impl/world-render-system-impl';
import { getServiceFor } from '../../internals/services/service-locator';
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

    private _currentCamera: Camera | null = null;

    constructor() {
        super();
        
        this._worldRenderSystem = getServiceFor(WorldRenderSystemImpl, this);
        this._worldPhysicsSystem = getServiceFor(WorldPhysicsSystemImpl, this);
    }

    //
    // Properties
    //

    public get currentCamera(): Camera | null {
        this.throwIfDestroyed();
        return this._currentCamera;
    }
    public set currentCamera(newCamera: Camera | null) {
        this.throwIfDestroyed();
        
        if (this._currentCamera === newCamera) {
            return;
        }

        this._currentCamera = newCamera;
        this.processChangedProperty('currentCamera');
    }
}