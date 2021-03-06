import { DataModelPropertyAttribute, IDataModelPropertyMetaData } from '../metadata';
import PropertyType from './property-type';

export default class DataModelPropertyMetaData
{
    private _name: string;
    private _type: PropertyType;
    private _attributes: DataModelPropertyAttribute[];

    constructor(metadata: IDataModelPropertyMetaData) {
        this._name = metadata.name;
        this._type = metadata.type;
        this._attributes = metadata.attributes;
    }

    public get name(): string {
        return this._name;
    }

    public get type(): PropertyType {
        return this._type;
    }

    public get attributes(): DataModelPropertyAttribute[] {
        return this._attributes;
    }
    
    public hasAttribute(attribute: DataModelPropertyAttribute): boolean {
        return this._attributes.some(a => a === attribute);
    }
}
