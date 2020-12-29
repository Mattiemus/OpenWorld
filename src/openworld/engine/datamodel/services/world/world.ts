import { Instance } from '../../elements/core/instance';
import { DataModelClass } from "../../internals/metadata/metadata";
import { PropType } from "../../internals/metadata/properties/types/prop-type";
import { WorldImpl } from '../../../services/world/world-impl';
import { Camera } from '../../elements/world/camera';

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
    private _worldImpl: WorldImpl;

    private _currentCamera: Camera | null = null;

    constructor() {
        super();
        
        this._worldImpl = World._getServiceImpl(WorldImpl);
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