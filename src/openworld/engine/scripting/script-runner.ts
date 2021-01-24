import InstanceContext from '../datamodel/internals/instance-context';
import Destroyable from '../utils/destroyable';

export default abstract class ScriptRunner extends Destroyable
{
    private _isRunning = false;

    //
    // Constructor
    //

    constructor(private _context: InstanceContext) {
        super();
    }

    //
    // Properties
    //

    public get context(): InstanceContext {
        this.throwIfDestroyed();
        return this._context;
    }

    public get isRunning(): boolean {
        this.throwIfDestroyed();
        return this._isRunning;
    }

    //
    // Methods
    //

    public run(): void {
        this.throwIfDestroyed();

        if (this._isRunning) {
            return;
        }

        this.onRun();
    }

    public stop(): void {
        this.throwIfDestroyed();

        if (!this._isRunning) {
            return;
        }

        this.onStop();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.stop();
    }

    protected onRun(): void {
        // No-op
    }

    protected onStop(): void {
        // No-op
    }
}
