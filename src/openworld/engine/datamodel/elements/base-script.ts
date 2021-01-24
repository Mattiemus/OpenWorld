import { DataModelClass } from '../internals/metadata/metadata';
import Instance from './instance';
import PropertyType from '../internals/metadata/properties/property-type';

export enum ScriptLanguage {
    javascript = 'JavaScript'
}

@DataModelClass({
    className: 'BaseScript',
    parent: Instance,
    attributes: [ 'NotCreatable' ],
    properties: {
        language: {
            name: 'language',
            type: PropertyType.enum(ScriptLanguage),
            attributes: [ 'EditorHidden' ]
        },
        source: {
            name: 'source',
            type: PropertyType.string,
            attributes: [ 'EditorHidden' ]
        },
    }
})
export default abstract class BaseScript extends Instance
{    
    private _lang = ScriptLanguage.javascript;
    private _source: string | null = null;

    //
    // Properties
    //

    public get language(): ScriptLanguage {
        this.throwIfDestroyed();
        return this._lang;
    }
    public set language(newValue: ScriptLanguage) {
        this.throwIfDestroyed();

        if (this._lang === newValue) {
            return;
        }

        this._lang = newValue;
        this.firePropertyChanged('language');
    }

    public get source(): string | null {
        this.throwIfDestroyed();
        return this._source;
    }
    public set source(newValue: string | null) {
        this.throwIfDestroyed();

        if (this._source === newValue) {
            return;
        }

        this._source = newValue;
        this.firePropertyChanged('source');
    }
}