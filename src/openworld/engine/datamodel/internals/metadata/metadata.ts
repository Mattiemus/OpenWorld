import { Class, Constructor } from '../../../utils/types';
import DataModelClassMetaData from './classes/data-model-class-metadata';
import PropertyType from './properties/property-type';
import { isFunction, isString } from '../../../utils/type-guards';
import { injectable } from 'inversify';

// TODO: Fix this!
type Instance = any;
type InstanceContext = any;

export let dataModelConstables = new Map<string, Class<Instance>>();

export let registeredDataModelTypes = new Map<Class<Instance>, IDataModelClassMetaData>();
export let finalizedDataModelTypes = new Map<Class<Instance>, DataModelClassMetaData>();

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

        finalizedDataModel.properties = { ...parentDataModel.properties, ...finalizedDataModel.properties };

        parent = parentDataModel.parent;
    }

    const finalizedDataModelClass = new DataModelClassMetaData(finalizedDataModel);
    finalizedDataModelTypes.set(instanceClass, finalizedDataModelClass);

    return finalizedDataModelClass;
}

export function getMetaData<T extends Instance>(instanceTypeOrStringOrInstance: Instance | Class<T> | string): DataModelClassMetaData {
    const cachedResult = instanceTypeOrStringOrInstance['_metadata'];
    if (cachedResult !== undefined) {
        return cachedResult;
    }

    if (isFunction(instanceTypeOrStringOrInstance)) {
        return getMetaDataByClass(instanceTypeOrStringOrInstance);
    }

    if (isString(instanceTypeOrStringOrInstance)) {
        const instanceType = dataModelConstables.get(instanceTypeOrStringOrInstance);
        if (instanceType === undefined) {
            throw new Error(`Unknown data model type ${instanceTypeOrStringOrInstance}`);
        }

        return getMetaDataByClass(instanceType);
    }

    if (instanceTypeOrStringOrInstance.constructor !== undefined) {
        return getMetaDataByClass(instanceTypeOrStringOrInstance.constructor);
    }

    throw new Error('Unknown argument passed to getMetaData');
}

export function getConstructor(className: string): Constructor<Instance, [InstanceContext, string?]> {
    const instanceType = dataModelConstables.get(className);
    if (instanceType === undefined) {
        throw new Error(`Unknown data model type ${className}`);
    }

    // TODO: Ensure not abstract

    return instanceType as Constructor<Instance, [InstanceContext, string?]>;
}

//
// Class MetaData
//

export type DataModelClassAttribute = "Service" | "NotCreatable" | "NotReplicated" | "EditorHidden";

export interface IDataModelClassMetaData {
    className: string;
    parent: Class<Instance> | null;
    attributes: DataModelClassAttribute[];
    properties: { [key: string]: IDataModelPropertyMetaData };
}

export function DataModelClass(metadata: IDataModelClassMetaData) {
    return function(constructor: Function): void {
        if (registeredDataModelTypes.has(constructor)) {
            throw new Error(`Class "${constructor.name}" declaring as "${metadata.className}" should only have a single "DataModelClass" decorator`);
        }

        if (dataModelConstables.has(metadata.className)) {
            throw new Error(`Class "${constructor.name}" duplicates the class name "${metadata.className}"`);
        }

        // TODO!
        //if (DataModelUtils.getAllTypes().findIndex(x => x === constructor) === -1) {
        //    throw new Error(`Class "${constructor.name}" declaring as "${metadata.className}" has not been added to DataModelUtils`);
        //}

        for (const propKey in metadata.properties) {
            const propName = metadata.properties[propKey].name;
            if (propKey !== propName) {
                throw new Error(`Class "${constructor.name}" declaring as "${metadata.className}" contains a property with the key "${propKey}" but given the name "${propName}" which do not match`);
            }
        }

        registeredDataModelTypes.set(constructor, metadata);
        dataModelConstables.set(metadata.className, constructor);
    }
}

//
// Property MetaData
//

export type DataModelPropertyAttribute = "ReadOnly" | "NotReplicated" | "EditorHidden";

export interface IDataModelPropertyMetaData {
    name: string;
    type: PropertyType;
    attributes: DataModelPropertyAttribute[];
}

//
// Service impl metadata
//

export function DataModelServiceImpl() {
    return function(constructor: Function): void {
        injectable()(constructor);
    }
}