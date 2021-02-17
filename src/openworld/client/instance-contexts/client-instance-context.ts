import BrowserContentProviderImpl from '../../client-shared/services/browser/browser-content-provider';
import BrowserLightingImpl from '../../client-shared/services/browser/browser-lighting-impl';
import BrowserMouseImpl from '../../client-shared/services/browser/browser-mouse-impl';
import BrowserRunServiceImpl from '../../client-shared/services/browser/browser-run-service-impl';
import ClientWorldImpl from '../services/client-world-impl';
import ContentProviderImpl from '../../engine/services/content-provider-impl';
import IInstanceContextWithCanvas from '../../client-shared/instance-contexts/instance-context-with-canvas';
import InstanceContext from '../../engine/datamodel/internals/instance-context';
import LightingImpl from '../../engine/services/lighting-impl';
import MouseImpl from '../../engine/services/mouse-impl';
import RenderCanvas from '../../client-shared/services/browser/graphics/render-canvas';
import RunServiceImpl from '../../engine/services/run-service-impl';
import WorldImpl from '../../engine/services/world-impl';
import { Container } from 'inversify';
import { WorkerThread } from '../../engine/threading/contexts/main-thread/worker-thread';

export default class ClientInstanceContext extends InstanceContext implements IInstanceContextWithCanvas
{
    private _renderCanvas: RenderCanvas;
    private _clientScriptWorkerThread: WorkerThread;

    //
    // Constructor
    //

    constructor() {
        super();
        this.finishConstruction();

        this._renderCanvas = this.getServiceImpl<RenderCanvas>('RenderCanvas');

        this._clientScriptWorkerThread = new WorkerThread(
            this, 
            new Worker(
                '../../client-shared/worker-threads/client-script-thread-worker',
                { 
                    name: 'work',
                    type: 'module'
                }));
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

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();
        this._clientScriptWorkerThread.destroy();
    }

    protected setupContainer(container: Container): void {
        container.bind('RenderCanvas').to(RenderCanvas).inSingletonScope();
        
        container.bind('ClientWorldImpl').to(ClientWorldImpl).inSingletonScope();
        container.bind('ClientWorldImpl').toService('BrowserWorldImpl');
        container.bind(WorldImpl).toService('ClientWorldImpl');

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
