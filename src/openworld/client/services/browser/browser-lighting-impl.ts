import RenderCanvas from "./graphics/render-canvas";
import LightingImpl from "../../../engine/services/lighting-impl";
import Lighting from '../../../engine/datamodel/services/lighting';

import * as THREE from 'three';
import { SignalConnection } from 'typed-signals';

export default class BrowserLightingImpl extends LightingImpl
{
    private _ambientLight = new THREE.AmbientLight();
    private _ambientChangedConnection: SignalConnection | undefined = undefined;

    //
    // Constructor
    //

    constructor(private _renderCanvas: RenderCanvas) {
        super();
    }

    //
    // Methods
    //

    protected onAttatch(dataModel: Lighting): void {        
        this._ambientLight.color.set(dataModel.ambient.toNumber());
        this._renderCanvas.scene.add(this._ambientLight);

        const ambientChangedSignal = dataModel.getPropertyChangedSignal('ambient')!;
        this._ambientChangedConnection = ambientChangedSignal.connect(this.onAmbientChanged.bind(this));
    }

    protected onDetatch(): void {
        this._renderCanvas.scene.remove(this._ambientLight);

        if (this._ambientChangedConnection !== undefined) {
            this._ambientChangedConnection.disconnect();
            this._ambientChangedConnection = undefined;
        }
    }    

    private onAmbientChanged(): void {        
        this._ambientLight.color.set(this.currentDataModel!.ambient.toNumber());
    }
}