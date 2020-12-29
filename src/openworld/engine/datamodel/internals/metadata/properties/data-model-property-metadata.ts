import BasePropType from './types/base-prop-type';
import { DataModelPropertyAttribute, IDataModelPropertyMetaData } from '../metadata';

export default class DataModelPropertyMetaData
{
    private _name: string;
    private _type: BasePropType;
    private _attributes: DataModelPropertyAttribute[];

    constructor(metadata: IDataModelPropertyMetaData) {
        this._name = metadata.name;
        this._type = metadata.type;
        this._attributes = metadata.attributes;
    }

    public get name(): string {
        return this._name;
    }

    public get type(): BasePropType {
        return this._type;
    }

    public get attributes(): DataModelPropertyAttribute[] {
        return this._attributes;
    }
    
    public hasAttribute(attribute: DataModelPropertyAttribute): boolean {
        return this._attributes.some(a => a === attribute);
    }
}
