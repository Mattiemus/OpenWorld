import BrowserContentProviderImpl from '../../../client-shared/datamodel/services/browser/browser-content-provider';
import BrowserLightingImpl from '../../../client-shared/datamodel/services/browser/browser-lighting-impl';
import BrowserMouseImpl from '../../../client-shared/datamodel/services/browser/browser-mouse-impl';
import BrowserRunServiceImpl from '../../../client-shared/datamodel/services/browser/browser-run-service-impl';
import ContentProviderImpl from '../../../engine/datamodel/services/impl/content-provider-impl';
import IInstanceContextWithCanvas from '../../../client-shared/datamodel/context/instance-context-with-canvas';
import InstanceContext from '../../../engine/datamodel/context/instance-context';
import LightingImpl from '../../../engine/datamodel/services/impl/lighting-impl';
import MouseImpl from '../../../engine/datamodel/services/impl/mouse-impl';
import RenderCanvas from '../../../client-shared/services/graphics/render-canvas';
import RunServiceImpl from '../../../engine/datamodel/services/impl/run-service-impl';
import WorldImpl from '../../../engine/datamodel/services/impl/world-impl';
import { Container } from 'inversify';
import EditorCamera from './editor-camera';
import BrowserWorldImpl from '../../../client-shared/datamodel/services/browser/browser-world-impl';
import EditorRaycaster from './editor-raycaster';

export default class EditorInstanceContext extends InstanceContext implements IInstanceContextWithCanvas
{
    private _renderCanvas: RenderCanvas;
    private _editorCamera: EditorCamera;
    private _editorRaycaster: EditorRaycaster;

    //
    // Constructor
    //

    constructor() {
        super();
        this.finishConstruction();

        this._renderCanvas = this.getServiceImpl<RenderCanvas>('RenderCanvas');
        const runService = this.getServiceImpl<RunServiceImpl>(RunServiceImpl);

        this._editorCamera = new EditorCamera(this._renderCanvas, runService);
        this._renderCanvas.camera = this._editorCamera;

        this._editorRaycaster = new EditorRaycaster(this._editorCamera, this._renderCanvas);
    }

    //
    // Properties
    //

    public get canvas(): HTMLCanvasElement | null {
        this.throwIfDestroyed();
        return this._renderCanvas.canvas;
    }
    public set canvas(newCanvas: HTMLCanvasElement | null) {
        this.throwIfDestroyed();
        this._renderCanvas.canvas = newCanvas;
    }

    public get editorCamera(): EditorCamera {
        this.throwIfDestroyed();
        return this._editorCamera;
    }

    public get editorRaycaster(): EditorRaycaster {
        this.throwIfDestroyed();
        return this._editorRaycaster;
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();
        this._editorCamera.destroy();
        this._editorRaycaster.destroy();
    }

    protected setupContainer(container: Container): void {
        container.bind('RenderCanvas').to(RenderCanvas).inSingletonScope();
        
        container.bind('BrowserWorldImpl').to(BrowserWorldImpl).inSingletonScope();
        container.bind(WorldImpl).toService('BrowserWorldImpl');

        container.bind('BrowserContentProviderImpl').to(BrowserContentProviderImpl).inSingletonScope();
        container.bind(ContentProviderImpl).toService('BrowserContentProviderImpl');

        container.bind('BrowserLightingImpl').to(BrowserLightingImpl).inSingletonScope();
        container.bind(LightingImpl).toService('BrowserLightingImpl');

        // TODO: client replicator

        container.bind('BrowserMouseImpl').to(BrowserMouseImpl).inSingletonScope();
        container.bind(MouseImpl).toService('BrowserMouseImpl');

        container.bind('BrowserRunServiceImpl').to(BrowserRunServiceImpl).inSingletonScope();
        container.bind(RunServiceImpl).toService('BrowserRunServiceImpl');
    }
}
