import ContentProviderImpl from '../../../engine/services/content-provider-impl';
import Content from '../../../engine/datamodel/data-types/content';

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

    public loadTexture(contentId: Content): THREE.Texture {
        return this._textureLoader.load(`./content/${contentId.id}.png`);
    }

    public unloadTexture(texture: THREE.Texture): void {
        // TODO
    }
}