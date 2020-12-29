import Instance from '../elements/instance';
import { DataModelClass } from "../internals/metadata/metadata";
import PropertyType from "../internals/metadata/properties/property-type";
import WorldImpl from '../../services/world-impl';
import Camera from '../elements/camera';

@DataModelClass({
    className: 'World',
    parent: Instance,
    attributes: [ 'Service', 'NotCreatable' ],
    properties: {
        currentCamera: {
            name: 'currentCamera',
            type: PropertyType.instanceRef(Camera),
            attributes: [ 'NotReplicated' ]
        }
    }
})
export default class World extends Instance
{
    private _impl: WorldImpl;

    private _currentCamera: Camera | null = null;

    constructor() {
        super();
        
        this._impl = World._getServiceImpl(WorldImpl);
        this._impl.attatch(this);
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
        
        if (newCamera !== null && newCamera.parent === null) {
            newCamera.parent = this;
        }

        this.processChangedProperty('currentCamera');
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();        
        this._impl.detatch(this);
    }
}