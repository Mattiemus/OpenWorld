import PointLight from '../../../../../engine/datamodel/elements/point-light';
import { IDestroyable } from '../../../../../engine/utils/interfaces';

import * as THREE from 'three';
import { SignalConnection } from 'typed-signals';

export default class PointLightProxy extends THREE.PointLight implements IDestroyable
{
    private _rangeChangedConnection: SignalConnection;
    private _brightnessChangedConnection: SignalConnection;
    private _colorChangedConnection: SignalConnection;
    private _castsShadowsChangedConnection: SignalConnection;
    private _cframeChangedConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(private _pointLight: PointLight) {
        // Create
        super(_pointLight.color.toNumber(), _pointLight.brightness, _pointLight.range);
        this.onDataModelCastsShadowsChanged();
        this.onDataModelCFrameChanged();

        // Hookup listeners
        const rangeChangedSignal = _pointLight.getPropertyChangedSignal('range')!;
        this._rangeChangedConnection = rangeChangedSignal.connect(this.onDataModelRangeChanged.bind(this));

        const brightnessChangedSignal = _pointLight.getPropertyChangedSignal('brightness')!;
        this._brightnessChangedConnection = brightnessChangedSignal.connect(this.onDataModelBrightnessChanged.bind(this));

        const colorChangedSignal = _pointLight.getPropertyChangedSignal('color')!;
        this._colorChangedConnection = colorChangedSignal.connect(this.onDataModelColorChanged.bind(this));

        const castsShadowsChangedSignal = _pointLight.getPropertyChangedSignal('castsShadows')!;
        this._castsShadowsChangedConnection = castsShadowsChangedSignal.connect(this.onDataModelCastsShadowsChanged.bind(this));

        const cframeChangedSignal = _pointLight.getPropertyChangedSignal('cframe')!;
        this._cframeChangedConnection = cframeChangedSignal.connect(this.onDataModelCFrameChanged.bind(this));
    }

    //
    // Properties
    //

    public get dataModel(): PointLight {
        return this._pointLight;
    }

    //
    // Methods
    //
    
    public destroy(): void {
        if (this.parent !== null) {
            this.parent.remove(this);
        }

        this._rangeChangedConnection.disconnect();
        this._brightnessChangedConnection.disconnect();
        this._colorChangedConnection.disconnect();
        this._castsShadowsChangedConnection.disconnect();
        this._cframeChangedConnection.disconnect();
    }

    private onDataModelRangeChanged(): void {
        this.distance = this._pointLight.range;
    }

    private onDataModelBrightnessChanged(): void {
        this.intensity = this._pointLight.brightness;
    }

    private onDataModelColorChanged(): void {
        this.color.set(this._pointLight.color.toNumber());
    }

    private onDataModelCastsShadowsChanged(): void {
        this.castShadow = this._pointLight.castsShadows;
    }

    private onDataModelCFrameChanged(): void {
        this.position.set(
            this._pointLight.cframe.x,
            this._pointLight.cframe.y,
            this._pointLight.cframe.z);

        this.quaternion.set(
            this._pointLight.cframe.qx,
            this._pointLight.cframe.qy,
            this._pointLight.cframe.qz,
            this._pointLight.cframe.qw);
    }
}