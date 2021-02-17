import BrowserContentProviderImpl from '../../client-shared/services/browser/browser-content-provider';
import BrowserLightingImpl from '../../client-shared/services/browser/browser-lighting-impl';
import BrowserMouseImpl from '../../client-shared/services/browser/browser-mouse-impl';
import BrowserRunServiceImpl from '../../client-shared/services/browser/browser-run-service-impl';
import ContentProviderImpl from '../../engine/services/content-provider-impl';
import IInstanceContextWithCanvas from '../../client-shared/instance-contexts/instance-context-with-canvas';
import InstanceContext from '../../engine/datamodel/internals/instance-context';
import LightingImpl from '../../engine/services/lighting-impl';
import MouseImpl from '../../engine/services/mouse-impl';
import RenderCanvas from '../../client-shared/services/browser/graphics/render-canvas';
import RunServiceImpl from '../../engine/services/run-service-impl';
import WorldImpl from '../../engine/services/world-impl';
import { Container } from 'inversify';
import EditorCamera from './editor-camera';
import BrowserWorldImpl from '../../client-shared/services/browser/browser-world-impl';

export default class EditorInstanceContext extends InstanceContext implements IInstanceContextWithCanvas
{
    private _renderCanvas: RenderCanvas;
    private _editorCamera: EditorCamera;

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

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();
        this._editorCamera.destroy();
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
