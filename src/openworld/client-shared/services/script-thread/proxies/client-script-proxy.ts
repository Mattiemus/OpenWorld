import ClientScript from '../../../../engine/datamodel/elements/client-script';
import Destroyable from '../../../../engine/utils/destroyable';
import { SignalConnection } from 'typed-signals';
import ScriptRunner from '../../../../engine/scripting/script-runner';
import { ScriptLanguage } from '../../../../engine/datamodel/elements/base-script';
import JavascriptScriptRunner from '../../../../engine/scripting/javascript-script-runner';

export default class ClientScriptProxy extends Destroyable
{
    private _scriptRunner: ScriptRunner | null = null;

    private _languageChangedConnection: SignalConnection;
    private _sourceChangedConnection: SignalConnection;
    
    //
    // Constructor
    //

    constructor(private _clientScript: ClientScript) {
        super();

        const languageChangedSignal = _clientScript.getPropertyChangedSignal('language')!;
        this._languageChangedConnection = languageChangedSignal.connect(this.onLanguageChanged.bind(this));

        const sourceChangedSignal = _clientScript.getPropertyChangedSignal('source')!;
        this._sourceChangedConnection = sourceChangedSignal.connect(this.onSourceChanged.bind(this));

        this.createScriptRunnerAndRun();
    }

    //
    // Methods
    //

    protected onDestroy(): void {
        super.onDestroy();

        this._languageChangedConnection.disconnect();
        this._sourceChangedConnection.disconnect();

        this.destroyScriptRunner();
    }

    private onLanguageChanged(): void {
        this.destroyScriptRunner();
        this.createScriptRunnerAndRun();
    }

    private onSourceChanged(): void {
        this.destroyScriptRunner();
        this.createScriptRunnerAndRun();
    }

    private createScriptRunnerAndRun(): void {
        if (this._clientScript.language === ScriptLanguage.javascript) {
            this._scriptRunner = new JavascriptScriptRunner(this._clientScript['_context'], this._clientScript.source);
        } else {
            throw new Error(`Unknown script language "${this._clientScript.language}"`);
        }

        this._scriptRunner.run();
    }

    private destroyScriptRunner(): void {
        if (this._scriptRunner !== null) {
            this._scriptRunner.destroy();
            this._scriptRunner = null;
        }
    }
}