import InstanceContext from "../../engine/datamodel/internals/instance-context";
import RenderCanvas from "../services/browser/graphics/render-canvas";
import BrowserContentProviderImpl from "../services/browser/browser-content-provider";
import BrowserMouseImpl from "../services/browser/browser-mouse-impl";
import BrowserRunServiceImpl from "../services/browser/browser-run-service-impl";
import BrowserWorldImpl from "../services/browser/browser-world-impl";
import BrowserLightingImpl from "../services/browser/browser-lighting-impl";
import ServiceBase from "../../engine/services/base/service-base";
import { Class } from "../../engine/utils/types";
import MouseImpl from "../../engine/services/mouse-impl";
import RunServiceImpl from "../../engine/services/run-service-impl";
import ClientReplicatorImpl from "../../engine/services/client-replicator-impl";
import WorldImpl from "../../engine/services/world-impl";
import LightingImpl from "../../engine/services/lighting-impl";
import ContentProviderImpl from "../../engine/services/content-provider-impl";

export default class LocalClientInstanceContext extends InstanceContext
{
    private _renderCanvas: RenderCanvas;
    private _browserContentProviderImpl: BrowserContentProviderImpl;   
    private _browserMouseService: BrowserMouseImpl;
    private _browserTaskScheduler: BrowserRunServiceImpl;
    //private _browserClientReplicator: BrowserClientReplicatorImpl;
    private _browserWorldImpl: BrowserWorldImpl;
    private _browserLightingImpl: BrowserLightingImpl;

    constructor(canvas: HTMLCanvasElement) {
        super();

        this._renderCanvas = new RenderCanvas(canvas);
        this._browserContentProviderImpl = new BrowserContentProviderImpl();    
        this._browserMouseService = new BrowserMouseImpl(this._renderCanvas);
        this._browserTaskScheduler = new BrowserRunServiceImpl(this._renderCanvas);
        //this._browserClientReplicator = new BrowserClientReplicatorImpl(datamodel);
        this._browserWorldImpl = new BrowserWorldImpl(this._renderCanvas, this._browserContentProviderImpl);
        this._browserLightingImpl = new BrowserLightingImpl(this._renderCanvas, this._browserContentProviderImpl);
    }

    public getServiceImpl<TService extends ServiceBase>(serviceBase: Class<TService>): TService {
        if (serviceBase as any === MouseImpl) {
            return this._browserMouseService as any;
        } else if (serviceBase as any === RunServiceImpl) {
            return this._browserTaskScheduler as any;
        } else if (serviceBase as any === ClientReplicatorImpl) {
            //return this._browserClientReplicator;
        } else if (serviceBase as any === WorldImpl) {
            return this._browserWorldImpl as any;
        } else if (serviceBase as any === LightingImpl) {
            return this._browserLightingImpl as any;
        } else if (serviceBase as any === ContentProviderImpl) {
            return this._browserContentProviderImpl as any;
        }

        throw new Error('Cannot find service implementation');
    }
}
