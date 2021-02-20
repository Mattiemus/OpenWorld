import RunServiceImpl from '../../../../datamodel/services/impl/run-service-impl';
import { injectable, inject } from 'inversify';
import { Signal, SignalConnection } from 'typed-signals';
import InterThreadCommunication from '../../../inter-thread-communication';

@injectable()
export default class WorkerThreadRunServiceImpl extends RunServiceImpl
{
    private _preRender = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _postRender = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _preSimulation = new Signal<(deltaTime: number, elapsedTime: number) => void>();
    private _postSimulation = new Signal<(deltaTime: number, elapsedTime: number) => void>();

    private _runServicePreRenderConnection: SignalConnection;
    private _runServicePostRenderConnection: SignalConnection;
    private _runServicePreSimulationConnection: SignalConnection;
    private _runServicePostSimulationConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(@inject(InterThreadCommunication) comms: InterThreadCommunication) {
        super();

        this._runServicePreRenderConnection =
            comms.addSignalHandler(
                'RunService:PreRender',
                this.onRunServicePreRender.bind(this));

        this._runServicePostRenderConnection =
            comms.addSignalHandler(
                'RunService:PostRender',
                this.onRunServicePostRender.bind(this));

        this._runServicePreSimulationConnection =
            comms.addSignalHandler(
                'RunService:PreSimulation',
                this.onRunServicePreSimulation.bind(this));

        this._runServicePostSimulationConnection =
            comms.addSignalHandler(
                'RunService:PostSimulation',
                this.onRunServicePostSimulation.bind(this));
    }

    //
    // Signals
    //

    public get preRender(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._preRender;
    }

    public get postRender(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._postRender;
    }
    public get preSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._preSimulation;
    }
    public get postSimulation(): Signal<(deltaTime: number, elapsedTime: number) => void> {
        this.throwIfDestroyed();
        return this._postSimulation;
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        this._runServicePreRenderConnection.disconnect();
        this._runServicePostRenderConnection.disconnect();
        this._runServicePreSimulationConnection.disconnect();
        this._runServicePostSimulationConnection.disconnect();
        
        this._preRender.disconnectAll();
        this._postRender.disconnectAll();
        this._preSimulation.disconnectAll();
        this._postSimulation.disconnectAll();
    }

    protected onRunServicePreRender(payload: { deltaTime: number, elapsedTime: number }): void {
        this.preRender.emit(payload.deltaTime, payload.elapsedTime);
    }

    protected onRunServicePostRender(payload: { deltaTime: number, elapsedTime: number }): void {
        this.postRender.emit(payload.deltaTime, payload.elapsedTime);
    }

    protected onRunServicePreSimulation(payload: { deltaTime: number, elapsedTime: number }): void {
        this.preSimulation.emit(payload.deltaTime, payload.elapsedTime);
    }

    protected onRunServicePostSimulation(payload: { deltaTime: number, elapsedTime: number }): void {
        this.postSimulation.emit(payload.deltaTime, payload.elapsedTime);
    }
}