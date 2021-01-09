import Content from '../data-types/content';
import Instance from './instance';
import InstanceContext from '../internals/instance-context';
import PropertyType from '../internals/metadata/properties/property-type';
import { DataModelClass } from '../internals/metadata/metadata';

@DataModelClass({
    className: 'Sky',
    parent: Instance,
    attributes: [],
    properties: {
        skyboxTop: {
            name: 'skyboxTop',
            type: PropertyType.content,
            attributes: []
        },
        skyboxBottom: {
            name: 'skyboxBottom',
            type: PropertyType.content,
            attributes: []
        },
        skyboxLeft: {
            name: 'skyboxLeft',
            type: PropertyType.content,
            attributes: []
        },
        skyboxRight: {
            name: 'skyboxRight',
            type: PropertyType.content,
            attributes: []
        },
        skyboxFront: {
            name: 'skyboxFront',
            type: PropertyType.content,
            attributes: []
        },
        skyboxBack: {
            name: 'skyboxBack',
            type: PropertyType.content,
            attributes: []
        },
    }
})
export default class Sky extends Instance
{
    private _skyboxTop: Content | null = null;
    private _skyboxBottom: Content | null = null;
    private _skyboxLeft: Content | null = null;
    private _skyboxRight: Content | null = null;
    private _skyboxFront: Content | null = null;
    private _skyboxBack: Content | null = null;

    //
    // Constructor
    //

    constructor(context: InstanceContext, refId?: string) {
        super(context, refId);
        this.finishConstruction(refId);
    }

    //
    // Properties
    //

    public get skyboxTop(): Content | null {
        this.throwIfDestroyed();
        return this._skyboxTop;
    }
    public set skyboxTop(newSkyboxTop: Content | null) {
        this.throwIfDestroyed();

        if (this._skyboxTop === newSkyboxTop) {
            return;
        }

        this._skyboxTop = newSkyboxTop;
        this.firePropertyChanged('skyboxTop');
    }

    public get skyboxBottom(): Content | null {
        this.throwIfDestroyed();
        return this._skyboxBottom;
    }
    public set skyboxBottom(newSkyboxBottom: Content | null) {
        this.throwIfDestroyed();

        if (this._skyboxBottom === newSkyboxBottom) {
            return;
        }

        this._skyboxBottom = newSkyboxBottom;
        this.firePropertyChanged('skyboxBottom');
    }

    public get skyboxLeft(): Content | null {
        this.throwIfDestroyed();
        return this._skyboxLeft;
    }
    public set skyboxLeft(newSkyboxLeft: Content | null) {
        this.throwIfDestroyed();

        if (this._skyboxLeft === newSkyboxLeft) {
            return;
        }

        this._skyboxLeft = newSkyboxLeft;
        this.firePropertyChanged('skyboxLeft');
    }

    public get skyboxRight(): Content | null {
        this.throwIfDestroyed();
        return this._skyboxRight;
    }
    public set skyboxRight(newSkyboxRight: Content | null) {
        this.throwIfDestroyed();

        if (this._skyboxRight === newSkyboxRight) {
            return;
        }

        this._skyboxRight = newSkyboxRight;
        this.firePropertyChanged('skyboxRight');
    }

    public get skyboxFront(): Content | null {
        this.throwIfDestroyed();
        return this._skyboxFront;
    }
    public set skyboxFront(newSkyboxFront: Content | null) {
        this.throwIfDestroyed();

        if (this._skyboxFront === newSkyboxFront) {
            return;
        }

        this._skyboxFront = newSkyboxFront;
        this.firePropertyChanged('skyboxFront');
    }

    public get skyboxBack(): Content | null {
        this.throwIfDestroyed();
        return this._skyboxBack;
    }
    public set skyboxBack(newSkyboxBack: Content | null) {
        this.throwIfDestroyed();
        
        if (this._skyboxBack === newSkyboxBack) {
            return;
        }

        this._skyboxBack = newSkyboxBack;
        this.firePropertyChanged('skyboxBack');
    }
}