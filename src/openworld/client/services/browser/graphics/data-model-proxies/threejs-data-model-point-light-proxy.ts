import ThreeJsDataModelProxy from './threejs-data-model-proxy';
import PointLight from '../../../../../engine/datamodel/elements/point-light';

import { SignalConnection } from 'typed-signals';
import * as THREE from 'three';

export default class ThreeJsDataModelPointLightProxy extends ThreeJsDataModelProxy<PointLight, THREE.PointLight>
{
    private _rangeChangedConnection: SignalConnection;
    private _brightnessChangedConnection: SignalConnection;
    private _colorChangedConnection: SignalConnection;
    private _castsShadowsChangedConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(dataModel: PointLight) {
        super(dataModel);

        const rangeChangedSignal = dataModel.getPropertyChangedSignal('range')!;
        this._rangeChangedConnection = rangeChangedSignal.connect(this.onDataModelRangeChanged.bind(this));

        const brightnessChangedSignal = dataModel.getPropertyChangedSignal('brightness')!;
        this._brightnessChangedConnection = brightnessChangedSignal.connect(this.onDataModelBrightnessChanged.bind(this));

        const colorChangedSignal = dataModel.getPropertyChangedSignal('color')!;
        this._colorChangedConnection = colorChangedSignal.connect(this.onDataModelColorChanged.bind(this));

        const castsShadowsChangedSignal = dataModel.getPropertyChangedSignal('castsShadows')!;
        this._castsShadowsChangedConnection = castsShadowsChangedSignal.connect(this.onDataModelCastsShadowsChanged.bind(this));
    }

    // 
    // Methods
    //

    public destroy(): void {
        super.destroy();
        this._rangeChangedConnection.disconnect();
        this._brightnessChangedConnection.disconnect();
        this._colorChangedConnection.disconnect();
        this._castsShadowsChangedConnection.disconnect();
    }

    protected createThreeObject(dataModel: PointLight): THREE.PointLight {
        const pointLight =
            new THREE.PointLight(
                dataModel.color.toNumber(),
                dataModel.brightness,
                dataModel.range);

        pointLight.castShadow = this.dataModel.castsShadows;

        this.copyCFrame(dataModel, pointLight);

        return pointLight;
    }

    private onDataModelRangeChanged(): void {
        this.threeObject.distance = this.dataModel.range;
    }

    private onDataModelBrightnessChanged(): void {
        this.threeObject.intensity = this.dataModel.brightness;
    }

    private onDataModelColorChanged(): void {
        this.threeObject.color.set(this.dataModel.color.toNumber());
    }

    private onDataModelCastsShadowsChanged(): void {
        this.threeObject.castShadow = this.dataModel.castsShadows;
    }
}
