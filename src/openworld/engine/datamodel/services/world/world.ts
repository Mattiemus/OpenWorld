import { Instance } from '../../../../../shared/datamodel/core/instance';
import { WorldObject } from '../../../../../shared/datamodel/building/world-object';
import { DataModelClass } from '../../../../../shared/datamodel/internals/metadata/metadata';
import { PropType } from "../../../../../shared/datamodel/internals/metadata/properties/prop-type";
import { WorldRenderSystemImpl } from './impl/world-render-system-impl';
import { getService } from '../../../../../shared/datamodel/internals/service-locator';
import { Camera } from '../../../../../shared/datamodel/building/camera';

@DataModelClass({
    className: 'World',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable' ],
    properties: {
        currentCamera: {
            name: 'currentCamera',
            type: PropType.instanceRefT(Camera),
            attributes: [ 'NotReplicated' ]
        }
    }
})
export class World extends Instance
{
    private _renderSystem: WorldRenderSystemImpl;
    private _currentCamera: Camera;

    constructor() {
        super();
        
        this._renderSystem = getService(WorldRenderSystemImpl);

        this._currentCamera = new Camera();
        this._currentCamera.parent = this;
        this._renderSystem.camera = this._currentCamera['_camera'];
    }

    public get currentCamera(): Camera {
        return this._currentCamera;
    }
    public set currentCamera(newCamera: Camera) {
        if (this._currentCamera === newCamera) {
            return;
        }

        if (newCamera.parent === null) {
            newCamera.parent = this;
        }

        this._currentCamera = newCamera;
        this._renderSystem.camera = newCamera['_camera'];

        this.firePropertyChanged('currentCamera');
        this.onPropertyChanged('currentCamera');
    }

    protected onChildRemoved(child: Instance): void {
        super.onChildRemoved(child);

        if (child instanceof WorldObject) {
            const childScene = child['_scene'];
            this._renderSystem.scene.remove(childScene);
        }
    }

    protected onChildAdded(child: Instance): void {
        super.onChildAdded(child);

        if (child instanceof WorldObject) {
            const childScene = child['_scene'];
            this._renderSystem.scene.add(childScene);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this._renderSystem.destroy();   
    }
}