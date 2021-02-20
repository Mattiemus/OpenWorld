import { SignalConnection } from 'typed-signals';
import ScriptRunner from './script-runner';
import InstanceContext from '../datamodel/context/instance-context';
import CFrame from '../math/cframe';
import Color3 from '../math/color3';
import MathEx from '../math/mathex';
import Vector2 from '../math/vector2';
import World from '../datamodel/services/world';
import Mouse from '../datamodel/services/mouse';
import RunService from '../datamodel/services/run-service';
import Quaternion from '../math/quaternion';
import Vector3 from '../math/vector3';
import Primitive from '../datamodel/elements/primitive';
import Content from '../datamodel/data-types/content';
import Material from '../datamodel/data-types/material';

export default class JavascriptScriptRunner extends ScriptRunner
{
    private _signalConnections = new Set<SignalConnection>();

    //
    // Constructor
    //

    constructor(context: InstanceContext, private _source: string | null = null) {
        super(context);
    }

    //
    // Properties
    //

    public get source(): string | null {
        this.throwIfDestroyed();
        return this._source;
    }
    public set source(newValue: string | null) {
        this.throwIfDestroyed();
        this._source = newValue;     
        if (this.isRunning) {
            this.stop();
            this.run();
        }
    }

    //
    // Methods
    //

    protected onRun(): void {
        if (this._source === null) {
            return;
        }

        const code =
            new Function(
                'sandbox',
                `with (sandbox) { return (function () { "use strict"; ${this._source} }).call(this); }`);

        const scriptInputs = this.generateInputs();
        code.call(scriptInputs, scriptInputs);
    }

    protected onStop(): void {
        for (const signalConnection of this._signalConnections) {
            signalConnection.disconnect();
        }
        this._signalConnections.clear();
    }
    
    protected addSignalConnection(connection: SignalConnection): void {
        this._signalConnections.add(connection);
    }

    private generateInputs(): { [key: string]: any } {
        // TODO: Add more!
        return {
            globalThis: undefined,

            runner: this,
            context: this.context,
            dataModel: this.context.dataModel,
            world: this.context.dataModel.getService(World),

            Math: Math,
            console: console,

            CFrame: CFrame,
            Color3: Color3,
            MathEx: MathEx,
            Quaternion: Quaternion,
            Vector2: Vector2,
            Vector3: Vector3,

            Content: Content,
            Material: Material,

            World: World,
            Mouse: Mouse,
            RunService: RunService,
            Primitive: Primitive
        };
    }
}
