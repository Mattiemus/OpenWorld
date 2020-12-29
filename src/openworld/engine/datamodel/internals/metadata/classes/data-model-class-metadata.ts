import { Class } from '../../../../utils/types';
import { DataModelPropertyMetaData } from '../properties/data-model-property-metadata';
import { DataModelClassAttribute, IDataModelClassMetaData } from '../metadata';

export class DataModelClassMetaData
{
    private _className: string;
    private _parent: Class<any> | null;
    private _attributes: DataModelClassAttribute[];
    private _properties: Map<string, DataModelPropertyMetaData>;

    constructor(metadata: IDataModelClassMetaData) {
        this._className = metadata.className;
        this._parent = metadata.parent;
        this._attributes = metadata.attributes;
        this._properties = new Map<string, DataModelPropertyMetaData>();

        for (const prop in metadata.properties) {
            this._properties.set(prop, new DataModelPropertyMetaData(metadata.properties[prop]));
        }
    }

    public get className(): string {
        return this._className;
    }

    public get parent(): Class<any> | null {
        return this._parent;
    }

    public get attributes(): DataModelClassAttribute[] {
        return this._attributes;
    }

    public get properties(): Map<string, DataModelPropertyMetaData> {
        return this._properties;
    }
    
    public hasAttribute(attribute: DataModelClassAttribute): boolean {
        return this._attributes.some(a => a === attribute);
    }
}
