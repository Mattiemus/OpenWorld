import { Class, Constructor } from '../../../utils/types';
import { Instance } from '../../elements/core/instance';
import { BasePropType } from './properties/base-prop-type';

import * as _ from "lodash";
import { injectable } from "inversify";

//
// Reflection
//

export class DataModelPropertyMetaData
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
            this._properties.set(
                prop,
                new DataModelPropertyMetaData(metadata.properties[prop]));
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

let dataModelConstables = new Map<string, Class<Instance>>();

let registeredDataModelTypes = new Map<Class<Instance>, IDataModelClassMetaData>();
let finalizedDataModelTypes = new Map<Class<Instance>, DataModelClassMetaData>();

function getMetaDataByClass<T extends Instance>(instanceClass: Class<T>): DataModelClassMetaData {
    const cachedDataModel = finalizedDataModelTypes.get(instanceClass);
    if (cachedDataModel !== undefined) {
        return cachedDataModel;
    }

    const finalizedDataModelTemplate = registeredDataModelTypes.get(instanceClass);
    if (finalizedDataModelTemplate === undefined) {
        throw new Error(`Internal error while compiling metadata for "${instanceClass.name}"`);
    }

    let finalizedDataModel = { ...finalizedDataModelTemplate };

    let parent = finalizedDataModel.parent;
    while (parent !== null) {
        const parentDataModel = registeredDataModelTypes.get(parent);
        if (parentDataModel === undefined) {
            throw new Error(`Internal error while compiling metadata for "${instanceClass.name}", parent "${parent.name}" not found in reflection database`);
        }

        finalizedDataModel.properties = { ...finalizedDataModel.properties, ...parentDataModel.properties };

        parent = parentDataModel.parent;
    }

    const finalizedDataModelClass = new DataModelClassMetaData(finalizedDataModel);
    finalizedDataModelTypes.set(instanceClass, finalizedDataModelClass);

    return finalizedDataModelClass;
}

export function getMetaData<T extends Instance>(instanceTypeOrStringOrInstance: Instance | Class<T> | string): DataModelClassMetaData {
    if (instanceTypeOrStringOrInstance instanceof Instance) {
        const cachedResult = instanceTypeOrStringOrInstance['_metadata'];
        if (cachedResult !== undefined) {
            return cachedResult;
        }

        return getMetaDataByClass(instanceTypeOrStringOrInstance.constructor);
    }

    if (_.isFunction(instanceTypeOrStringOrInstance)) {
        return getMetaDataByClass(instanceTypeOrStringOrInstance);
    }

    if (_.isString(instanceTypeOrStringOrInstance)) {
        const instanceType = dataModelConstables.get(instanceTypeOrStringOrInstance);
        if (instanceType === undefined) {
            throw new Error(`Unknown data model type ${instanceTypeOrStringOrInstance}`);
        }

        return getMetaDataByClass(instanceType);
    }

    throw new Error('Unknown argument passed to getMetaData');
}

export function getConstructor(className: string): Constructor<any> {
    const instanceType = dataModelConstables.get(className);
    if (instanceType === undefined) {
        throw new Error(`Unknown data model type ${className}`);
    }

    // TODO: Ensure not abstract

    return instanceType as Constructor<any>;
}

//
// Class MetaData
//

export type DataModelClassAttribute = "Service" | "NotCreatable" | "NotReplicated";

export interface IDataModelClassMetaData {
    className: string;
    parent: Class<any> | null;
    attributes: DataModelClassAttribute[];
    properties: { [key: string]: IDataModelPropertyMetaData };
}

export function DataModelClass(metadata: IDataModelClassMetaData) {
    return function(constructor: Function) {
        if (registeredDataModelTypes.has(constructor)) {
            throw new Error(`Class "${constructor.name}" should only have a single "DataModelClass" decorator`);
        }

        if (dataModelConstables.has(metadata.className)) {
            throw new Error(`Class "${constructor.name}" duplicates the class name "${metadata.className}"`);

        }

        injectable()(constructor);

        registeredDataModelTypes.set(constructor, metadata);
        dataModelConstables.set(metadata.className, constructor);
    }
}

//
// Property MetaData
//

export type DataModelPropertyAttribute = "ReadOnly" | "NotReplicated";

export interface IDataModelPropertyMetaData {
    name: string;
    type: BasePropType;
    attributes: DataModelPropertyAttribute[];
}

