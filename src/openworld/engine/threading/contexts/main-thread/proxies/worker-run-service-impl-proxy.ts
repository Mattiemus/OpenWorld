import Destroyable from "../../../../utils/destroyable";
import InterThreadCommunication from "../../../inter-thread-communication";
import RunServiceImpl from "../../../../datamodel/services/impl/run-service-impl";
import { SignalConnection } from "typed-signals";

export default class WorkerRunServiceImplProxy extends Destroyable
{
    private _runServicePreRenderConnection: SignalConnection;
    private _runServicePostRenderConnection: SignalConnection;
    private _runServicePreSimulationConnection: SignalConnection;
    private _runServicePostSimulationConnection: SignalConnection;

    //
    // Constructor
    //

    constructor(private _comms: InterThreadCommunication, runServiceImpl: RunServiceImpl) {
        super();

        this._runServicePreRenderConnection =
            runServiceImpl.preRender.connect(this.onRunServicePreRender.bind(this));

        this._runServicePostRenderConnection =
            runServiceImpl.postRender.connect(this.onRunServicePostRender.bind(this));

        this._runServicePreSimulationConnection =
            runServiceImpl.preSimulation.connect(this.onRunServicePreSimulation.bind(this));

        this._runServicePostSimulationConnection =
            runServiceImpl.postSimulation.connect(this.onRunServicePostSimulation.bind(this));
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
    }

    private onRunServicePreRender(deltaTime: number, elapsedTime: number): void {
        this._comms.fireSignal('RunService:PreRender', { deltaTime, elapsedTime });
    }

    private onRunServicePostRender(deltaTime: number, elapsedTime: number): void {
        this._comms.fireSignal('RunService:PostRender', { deltaTime, elapsedTime });
    }

    private onRunServicePreSimulation(deltaTime: number, elapsedTime: number): void {
        this._comms.fireSignal('RunService:PreSimulation', { deltaTime, elapsedTime });
    }

    private onRunServicePostSimulation(deltaTime: number, elapsedTime: number): void {
        this._comms.fireSignal('RunService:PostSimulation', { deltaTime, elapsedTime });
    }
}