import RenderCanvas from "./graphics/render-canvas";
import LightingImpl from "../../../engine/services/lighting-impl";
import Lighting from '../../../engine/datamodel/services/lighting';
import Instance from "../../../engine/datamodel/elements/instance";
import Sky from "../../../engine/datamodel/elements/sky";
import SkyProxy from './graphics/proxies/sky-proxy';
import BrowserContentProviderImpl from './browser-content-provider';

import * as THREE from 'three';
import { SignalConnection } from 'typed-signals';
import { injectable, inject } from "inversify";

@injectable()
export default class BrowserLightingImpl extends LightingImpl
{
    private _ambientLight = new THREE.AmbientLight();
    private _childAddedConnection: SignalConnection | null = null;
    private _childRemovedConnection: SignalConnection | null = null;
    private _ambientChangedConnection: SignalConnection | null = null;

    //
    // Constructor
    //

    constructor(
        @inject('RenderCanvas') private _renderCanvas: RenderCanvas, 
        @inject('BrowserContentProviderImpl') private _browserContentProvider: BrowserContentProviderImpl
    ) {
        super();
    }

    //
    // Methods
    //

    protected onAttatch(dataModel: Lighting): void {        
        this._ambientLight.color.set(dataModel.ambient.toNumber());
        this._renderCanvas.scene.add(this._ambientLight);

        // TODO: Do we need to initialise any existing descendent proxies?

        const ambientChangedSignal = dataModel.getPropertyChangedSignal('ambient')!;
        this._ambientChangedConnection = ambientChangedSignal.connect(this.onAmbientChanged.bind(this));

        this._childAddedConnection =
            dataModel.childAdded.connect(this.onChildAdded.bind(this));

        this._childRemovedConnection =
            dataModel.childRemoved.connect(this.onChildRemoved.bind(this));
    }

    protected onDetatch(): void {
        this._renderCanvas.scene.remove(this._ambientLight);
        this._renderCanvas.skybox = null;

        if (this._ambientChangedConnection !== null) {
            this._ambientChangedConnection.disconnect();
            this._ambientChangedConnection = null;
        }

        if (this._childAddedConnection !== null) {
            this._childAddedConnection.disconnect();
            this._childAddedConnection = null;
        }

        if (this._childRemovedConnection !== null) {
            this._childRemovedConnection.disconnect();
            this._childRemovedConnection = null;
        }
    }    

    private onChildAdded(child: Instance): void {
        if (child instanceof Sky) {
            const proxy = new SkyProxy(child, this._browserContentProvider);
            this._renderCanvas.skybox = proxy;
        }
    }

    private onChildRemoved(child: Instance): void {        
        if (child instanceof Sky) {
            if (this._renderCanvas.skybox !== null && child === this._renderCanvas.skybox.dataModel) {
                this._renderCanvas.skybox = null;
            }
        }
    }

    private onAmbientChanged(): void {        
        this._ambientLight.color.set(this.currentDataModel!.ambient.toNumber());
    }
}