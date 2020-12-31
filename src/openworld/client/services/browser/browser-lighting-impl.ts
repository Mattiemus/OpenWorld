import RenderCanvas from "./graphics/render-canvas";
import LightingImpl from "../../../engine/services/lighting-impl";
import Lighting from '../../../engine/datamodel/services/lighting';

import * as THREE from 'three';
import { SignalConnection } from 'typed-signals';

export default class BrowserLightingImpl extends LightingImpl
{
    private _ambientLight = new THREE.AmbientLight();
    private _ambientChangedConnection: SignalConnection | null = null;

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







        // TODO: Move this to a proxy!

        const skyBoxFrontMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, depthWrite: false, side: THREE.BackSide });
        const skyBoxBackMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, depthWrite: false, side: THREE.BackSide });
        const skyBoxUpMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, depthWrite: false, side: THREE.BackSide });
        const skyBoxDownMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, depthWrite: false, side: THREE.BackSide });
        const skyBoxRightMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, depthWrite: false, side: THREE.BackSide });
        const skyBoxLeftMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, depthWrite: false, side: THREE.BackSide });

        this._renderCanvas.skybox.material = [
            skyBoxFrontMaterial,
            skyBoxBackMaterial,
            skyBoxUpMaterial,
            skyBoxDownMaterial,
            skyBoxRightMaterial,
            skyBoxLeftMaterial
        ];
    }

    protected onDetatch(): void {
        this._renderCanvas.scene.remove(this._ambientLight);

        if (this._ambientChangedConnection !== null) {
            this._ambientChangedConnection.disconnect();
            this._ambientChangedConnection = null;
        }
    }    

    private onAmbientChanged(): void {        
        this._ambientLight.color.set(this.currentDataModel!.ambient.toNumber());
    }
}