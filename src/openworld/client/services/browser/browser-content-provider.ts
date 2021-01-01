import ContentProviderImpl from '../../../engine/services/content-provider-impl';
import Content from '../../../engine/datamodel/data-types/content';
import Material from '../../../engine/datamodel/data-types/material';

import * as THREE from 'three';

export default class BrowserContentProviderImpl extends ContentProviderImpl
{
    private _loadingManager: THREE.LoadingManager;
    private _textureLoader: THREE.TextureLoader;

    //
    // Constructor
    //

    constructor() {
        super();

        this._loadingManager = new THREE.LoadingManager();
        this._textureLoader = new THREE.TextureLoader(this._loadingManager);
    }

    //
    // Methods
    //

    public loadTexture(content: Content): THREE.Texture {
        return this._textureLoader.load(`./content/${content.id}.png`);
    }

    public unloadTexture(texture: Content | THREE.Texture): void {
        // TODO
    }

    public loadMaterial(material: Material): THREE.Material {
        const materialParams: THREE.MeshStandardMaterialParameters = {};

        if (material.color instanceof Content) {
            materialParams.map = this.loadTexture(material.color);
        } else {
            materialParams.color = material.color.toNumber();
        }
        
        if (material.metalness instanceof Content) {
            materialParams.metalnessMap = this.loadTexture(material.metalness);
        } else {
            materialParams.metalness = material.metalness;
        }

        if (material.roughness instanceof Content) {
            materialParams.roughnessMap = this.loadTexture(material.roughness);
        } else {
            materialParams.roughness = material.roughness;
        }

        if (material.normal !== null) {
            materialParams.normalMap = this.loadTexture(material.normal);
        }

        return new THREE.MeshStandardMaterial(materialParams);
    }

    public unloadMaterial(material: Material | THREE.Material): void {
        // TODO
    }
}