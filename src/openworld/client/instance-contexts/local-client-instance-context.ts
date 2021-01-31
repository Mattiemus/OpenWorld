import BrowserContentProviderImpl from '../services/browser/browser-content-provider';
import BrowserLightingImpl from '../services/browser/browser-lighting-impl';
import BrowserMouseImpl from '../services/browser/browser-mouse-impl';
import BrowserRunServiceImpl from '../services/browser/browser-run-service-impl';
import BrowserWorldImpl from '../services/browser/browser-world-impl';
import ContentProvider from '../../engine/datamodel/services/content-provider';
import ContentProviderImpl from '../../engine/services/content-provider-impl';
import DataModel from '../../engine/datamodel/elements/datamodel';
import IInstanceContextWithCanvas from '../../client-shared/instance-contexts/instance-context-with-canvas';
import InstanceContext from '../../engine/datamodel/internals/instance-context';
import Lighting from '../../engine/datamodel/services/lighting';
import LightingImpl from '../../engine/services/lighting-impl';
import Mouse from '../../engine/datamodel/services/mouse';
import MouseImpl from '../../engine/services/mouse-impl';
import RenderCanvas from '../services/browser/graphics/render-canvas';
import RunService from '../../engine/datamodel/services/run-service';
import RunServiceImpl from '../../engine/services/run-service-impl';
import World from '../../engine/datamodel/services/world';
import WorldImpl from '../../engine/services/world-impl';
import { Container } from 'inversify';
import { WorkerThread } from '../../engine/threading/contexts/main-thread/worker-thread';

export default class LocalClientInstanceContext extends InstanceContext implements IInstanceContextWithCanvas
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
                '../worker-threads/client-script-thread-worker',
                { 
                    name: 'work',
                    type: 'module'
                }));
    }

    //
    // Properties
    //

    public get canvas(): HTMLCanvasElement | null {
        return this._renderCanvas.canvas;
    }
    public set canvas(newCanvas: HTMLCanvasElement | null) {
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
