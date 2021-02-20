import * as THREE from 'three';
import BrowserContentProviderImpl from '../../../datamodel/services/browser/browser-content-provider';
import Sky from '../../../../engine/datamodel/elements/sky';
import { IDestroyable } from '../../../../engine/utils/interfaces';
import { InstanceProxy } from './instance-proxy';
import { SignalConnection } from 'typed-signals';

export default class SkyProxy
    extends THREE.Mesh 
    implements InstanceProxy<Sky>, IDestroyable
{
    private static _geometry = new THREE.BoxBufferGeometry(1, 1, 1);

    private _skyBoxTopMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, depthWrite: false, side: THREE.BackSide });
    private _skyBoxBottomMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, depthWrite: false, side: THREE.BackSide });
    private _skyBoxLeftMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, depthWrite: false, side: THREE.BackSide });
    private _skyBoxRightMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, depthWrite: false, side: THREE.BackSide });
    private _skyBoxFrontMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, depthWrite: false, side: THREE.BackSide });
    private _skyBoxBackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, depthWrite: false, side: THREE.BackSide });

    private _skyboxTopChangedConnection: SignalConnection;
    private _skyboxBottomChangedConnection: SignalConnection;
    private _skyboxLeftChangedConnection: SignalConnection;
    private _skyboxRightChangedConnection: SignalConnection;
    private _skyboxFrontChangedConnection: SignalConnection;
    private _skyboxBackChangedConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(private _sky: Sky, private _browserContentProvider: BrowserContentProviderImpl) {
        // Create
        super(SkyProxy._geometry);

        this.material = [
            this._skyBoxRightMaterial,
            this._skyBoxLeftMaterial,
            this._skyBoxTopMaterial,
            this._skyBoxBottomMaterial,
            this._skyBoxFrontMaterial,
            this._skyBoxBackMaterial,
        ];

        this.renderOrder = Number.NEGATIVE_INFINITY;

        this.onSkyboxTopChanged();
        this.onSkyboxBottomChanged();
        this.onSkyboxLeftChanged();
        this.onSkyboxRightChanged();
        this.onSkyboxFrontChanged();
        this.onSkyboxBackChanged();

        // Hookup listeners
        const skyboxTopChangedSignal = _sky.getPropertyChangedSignal('skyboxTop')!;
        this._skyboxTopChangedConnection = skyboxTopChangedSignal.connect(this.onSkyboxTopChanged.bind(this));
        
        const skyboxBottomChangedSignal = _sky.getPropertyChangedSignal('skyboxBottom')!;
        this._skyboxBottomChangedConnection = skyboxBottomChangedSignal.connect(this.onSkyboxBottomChanged.bind(this));
        
        const skyboxLeftChangedSignal = _sky.getPropertyChangedSignal('skyboxLeft')!;
        this._skyboxLeftChangedConnection = skyboxLeftChangedSignal.connect(this.onSkyboxLeftChanged.bind(this));
        
        const skyboxRightChangedSignal = _sky.getPropertyChangedSignal('skyboxRight')!;
        this._skyboxRightChangedConnection = skyboxRightChangedSignal.connect(this.onSkyboxRightChanged.bind(this));
        
        const skyboxFrontChangedSignal = _sky.getPropertyChangedSignal('skyboxFront')!;
        this._skyboxFrontChangedConnection = skyboxFrontChangedSignal.connect(this.onSkyboxFrontChanged.bind(this));
        
        const skyboxBackChangedSignal = _sky.getPropertyChangedSignal('skyboxBack')!;
        this._skyboxBackChangedConnection = skyboxBackChangedSignal.connect(this.onSkyboxBackChanged.bind(this));
    }

    //
    // Properties
    //

    public get dataModel(): Sky {
        return this._sky;
    }

    //
    // Methods
    //
    
    public destroy(): void {
        if (this.parent !== null) {
            this.parent.remove(this);
        }

        this._skyboxTopChangedConnection.disconnect();
        this._skyboxBottomChangedConnection.disconnect();
        this._skyboxLeftChangedConnection.disconnect();
        this._skyboxRightChangedConnection.disconnect();
        this._skyboxFrontChangedConnection.disconnect();
        this._skyboxBackChangedConnection.disconnect();

        this.unloadTopTexture();
        this.unloadBottomTexture();
        this.unloadLeftTexture();
        this.unloadRightTexture();
        this.unloadFrontTexture();
        this.unloadBackTexture();

        this._skyBoxTopMaterial.dispose();
        this._skyBoxBottomMaterial.dispose();
        this._skyBoxLeftMaterial.dispose();
        this._skyBoxRightMaterial.dispose();
        this._skyBoxFrontMaterial.dispose();
        this._skyBoxBackMaterial.dispose();
    }

    private unloadTopTexture(): void {
        if (this._skyBoxTopMaterial.map !== null) {
            this._browserContentProvider.unloadTexture(this._skyBoxTopMaterial.map);
            this._skyBoxTopMaterial.map = null;
        }
    }

    private unloadBottomTexture(): void {
        if (this._skyBoxBottomMaterial.map !== null) {
            this._browserContentProvider.unloadTexture(this._skyBoxBottomMaterial.map);
            this._skyBoxBottomMaterial.map = null;
        }
    }

    private unloadLeftTexture(): void {
        if (this._skyBoxLeftMaterial.map !== null) {
            this._browserContentProvider.unloadTexture(this._skyBoxLeftMaterial.map);
            this._skyBoxLeftMaterial.map = null;
        }
    }

    private unloadRightTexture(): void {
        if (this._skyBoxRightMaterial.map !== null) {
            this._browserContentProvider.unloadTexture(this._skyBoxRightMaterial.map);
            this._skyBoxRightMaterial.map = null;
        }
    }

    private unloadFrontTexture(): void {
        if (this._skyBoxFrontMaterial.map !== null) {
            this._browserContentProvider.unloadTexture(this._skyBoxFrontMaterial.map);
            this._skyBoxFrontMaterial.map = null;
        }
    }

    private unloadBackTexture(): void {
        if (this._skyBoxBackMaterial.map !== null) {
            this._browserContentProvider.unloadTexture(this._skyBoxBackMaterial.map);
            this._skyBoxBackMaterial.map = null;
        }
    }

    private onSkyboxTopChanged(): void {
        this.unloadTopTexture();

        if (this._sky.skyboxTop !== null) {
            this._skyBoxTopMaterial.color.set(0xffffff);
            this._skyBoxTopMaterial.map = this._browserContentProvider.loadTexture(this._sky.skyboxTop);
        } else {            
            this._skyBoxTopMaterial.color.set(0x000000);
        }
    }

    private onSkyboxBottomChanged(): void {
        this.unloadBottomTexture();

        if (this._sky.skyboxBottom !== null) {
            this._skyBoxBottomMaterial.color.set(0xffffff);
            this._skyBoxBottomMaterial.map = this._browserContentProvider.loadTexture(this._sky.skyboxBottom);
        } else {            
            this._skyBoxBottomMaterial.color.set(0x000000);
        }
    }

    private onSkyboxLeftChanged(): void {
        this.unloadLeftTexture();

        if (this._sky.skyboxLeft !== null) {
            this._skyBoxLeftMaterial.color.set(0xffffff);
            this._skyBoxLeftMaterial.map = this._browserContentProvider.loadTexture(this._sky.skyboxLeft);
        } else {            
            this._skyBoxLeftMaterial.color.set(0x000000);
        }
    }

    private onSkyboxRightChanged(): void {
        this.unloadRightTexture();

        if (this._sky.skyboxRight !== null) {
            this._skyBoxRightMaterial.color.set(0xffffff);
            this._skyBoxRightMaterial.map = this._browserContentProvider.loadTexture(this._sky.skyboxRight);
        } else {            
            this._skyBoxRightMaterial.color.set(0x000000);
        }
    }

    private onSkyboxFrontChanged(): void {
        this.unloadFrontTexture();

        if (this._sky.skyboxFront !== null) {
            this._skyBoxFrontMaterial.color.set(0xffffff);
            this._skyBoxFrontMaterial.map = this._browserContentProvider.loadTexture(this._sky.skyboxFront);
        } else {            
            this._skyBoxFrontMaterial.color.set(0x000000);
        }
    }

    private onSkyboxBackChanged(): void {
        this.unloadBackTexture();

        if (this._sky.skyboxBack !== null) {
            this._skyBoxBackMaterial.color.set(0xffffff);
            this._skyBoxBackMaterial.map = this._browserContentProvider.loadTexture(this._sky.skyboxBack);
        } else {            
            this._skyBoxBackMaterial.color.set(0x000000);
        }
    }
}