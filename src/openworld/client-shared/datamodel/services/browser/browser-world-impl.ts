import BrowserContentProviderImpl from './browser-content-provider';
import Instance from '../../../../engine/datamodel/elements/instance';
import PointLight from '../../../../engine/datamodel/elements/point-light';
import PointLightProxy from '../../../services/graphics/proxies/point-light-proxy';
import Primitive from '../../../../engine/datamodel/elements/primitive';
import PrimitiveRenderer from '../../../services/graphics/primitive-renderer';
import RenderCanvas from '../../../services/graphics/render-canvas';
import World from '../../../../engine/datamodel/services/world';
import WorldImpl from '../../../../engine/datamodel/services/impl/world-impl';
import { inject, injectable } from 'inversify';
import { InstanceProxy } from '../../../services/graphics/proxies/instance-proxy';
import { SignalConnection } from 'typed-signals';

@injectable()
export default class BrowserWorldImpl extends WorldImpl
{
    private _instanceProxies = new Map<Instance, InstanceProxy<Instance>>();
    private _primitiveRenderer: PrimitiveRenderer | null = null;

    private _descendantAddedConnection: SignalConnection | null = null;
    private _descendantRemovingConnection: SignalConnection | null = null;

    //
    // Constructor
    //

    constructor(
        @inject('RenderCanvas') private _renderCanvas: RenderCanvas, 
        @inject('BrowserContentProviderImpl') private _browserContentProviderImpl: BrowserContentProviderImpl
    ) {
        super();
    }

    //
    // Properties
    //

    public get renderCanvas(): RenderCanvas {
        return this._renderCanvas;
    }

    //
    // Methods
    //

    protected onAttatch(dataModel: World): void {
        super.onAttatch(dataModel);

        this._primitiveRenderer = new PrimitiveRenderer(this._renderCanvas, this._browserContentProviderImpl);

        // TODO: Do we need to initialise any existing descendent proxies?

        this._descendantAddedConnection =
            dataModel.descendantAdded.connect(this.onDescendantAdded.bind(this));

        this._descendantRemovingConnection =
            dataModel.descendantRemoving.connect(this.onDescendantRemoving.bind(this));
    }

    protected onDetatch(): void {
        super.onDetatch();

        const allProxies = Array.from(this._instanceProxies.values());
        for (const proxy of allProxies) {
            proxy.destroy();
        }
        this._instanceProxies.clear();
        
        if (this._primitiveRenderer !== null) {
            this._primitiveRenderer.destroy();
            this._primitiveRenderer = null;
        }

        if (this._descendantAddedConnection !== null) {
            this._descendantAddedConnection.disconnect();
            this._descendantAddedConnection = null;
        }

        if (this._descendantRemovingConnection !== null) {
            this._descendantRemovingConnection.disconnect();
            this._descendantRemovingConnection = null;
        }
    }

    private onDescendantAdded(descendant: Instance): void {
        if (descendant instanceof Primitive) {  
            if (this._primitiveRenderer !== null) {          
                this._primitiveRenderer.addPrimitive(descendant);
            }

            return;
        }

        if (descendant instanceof PointLight) {
            const proxy = new PointLightProxy(descendant);
            this._instanceProxies.set(descendant, proxy);
            this._renderCanvas.scene.add(proxy);  
            return;      
        }
    }

    private onDescendantRemoving(descendant: Instance): void {
        if (descendant instanceof Primitive) {
            if (this._primitiveRenderer !== null) {
                this._primitiveRenderer.removePrimitive(descendant);
            }

            return;
        }

        if (descendant instanceof PointLight) {
            const proxy = this._instanceProxies.get(descendant);
            if (proxy !== undefined) {
                proxy.destroy();
                this._instanceProxies.delete(descendant);
            }
        }
    }
}