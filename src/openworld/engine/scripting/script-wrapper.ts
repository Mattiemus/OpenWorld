import { SignalConnection } from 'typed-signals';

export default abstract class ScriptWrapper
{
    private _isRunning = false;
    private _signalConnections = new Set<SignalConnection>();

    //
    // Methods
    //

    public run(): void {
        if (this._isRunning) {
            return;
        }

        this.onRun();
    }

    public stop(): void {
        if (!this._isRunning) {
            return;
        }

        this._signalConnections.forEach(c => c.disconnect());
        this._signalConnections.clear();

        this.onStop();
    }

    protected onRun(): void {
        // No-op
    }

    protected onStop(): void {
        // No-op
    }
    
    protected addSignalConnection(connection: SignalConnection): void {
        this._signalConnections.add(connection);
    }
}
