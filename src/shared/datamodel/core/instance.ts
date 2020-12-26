import { IDestroyable } from '../../utils/interfaces';
import { Class } from '../../utils/types';
import { Uuid } from '../../utils/uuid';
import { DataModelClass, DataModelClassMetaData, getMetaData } from "../internals/metadata/metadata";
import { PropType } from "../internals/metadata/properties/prop-type";
import { InstanceManager } from '../internals/instance-manager';

import { Signal } from "typed-signals";
import * as _ from "lodash";

@DataModelClass({
    className: 'Instance',
    parent: null,
    attributes: [ 'NotCreatable' ],
    properties: {
        className: {
            name: 'className',
            type: PropType.string,
            attributes: [ 'ReadOnly', 'NotReplicated' ]
        },
        name: {
            name: 'name',
            type: PropType.string,
            attributes: []
        },
        parent: {
            name: 'parent',
            type: PropType.instanceRefT('Instance'),
            attributes: []
        }
    }
})
export abstract class Instance implements IDestroyable
{  
    private _metadata: DataModelClassMetaData;
    private _refId: Uuid;
    private _name: string;
    private _parent: Instance | null = null;
    private _children: Instance[] = [];
    private _isDestroyed: boolean = false;
    
    private _ancestryChanged: Signal<(child: Instance, parent: Instance | null) => void> =
        new Signal<(child: Instance, parent: Instance | null) => void>();
    private _propertyChanged: Signal<(propertyName: string) => void> =
        new Signal<(propertyName: string) => void>();
    private _childAdded: Signal<(child: Instance) => void> =
        new Signal<(child: Instance) => void>();
    private _childRemoved: Signal<(child: Instance) => void> =
        new Signal<(child: Instance) => void>();
    private _descendantAdded: Signal<(child: Instance) => void> =
        new Signal<(descendant : Instance) => void>();
    private _descendantRemoving: Signal<(child: Instance) => void> =
            new Signal<(descendant : Instance) => void>();

    constructor() {
        const selfMetadata = getMetaData(this);
        if (selfMetadata === undefined) {
            throw new Error(`Could not find metadata for class "${this.constructor.name}"`);
        }

        this._metadata = selfMetadata;
        this._refId = InstanceManager.registerInstance(this);
        this._name = selfMetadata.className;
    }

    //
    // Events
    //

    public get ancestryChanged(): Signal<(child: Instance, parent: Instance | null) => void> {
        this.throwIfDestroyed();
        return this._ancestryChanged;
    }

    public get propertyChanged(): Signal<(propertyName: string) => void> {
        this.throwIfDestroyed();
        return this._propertyChanged;
    }

    public get childAdded(): Signal<(child: Instance) => void> {
        this.throwIfDestroyed();
        return this._childAdded;
    }

    public get childRemoved(): Signal<(child: Instance) => void> {
        this.throwIfDestroyed();
        return this._childRemoved;
    }

    public get descendantAdded(): Signal<(child: Instance) => void> {
        this.throwIfDestroyed();
        return this._descendantAdded;
    }

    public get descendantRemoving(): Signal<(child: Instance) => void> {
        this.throwIfDestroyed();
        return this._descendantRemoving;
    }

    //
    // Properties
    //

    public get className(): string {
        this.throwIfDestroyed();
        return this._metadata.className;
    }

    public get name(): string {
        this.throwIfDestroyed();
        return this._name;
    }
    public set name(newName: string) {
        this.throwIfDestroyed();

        if (this._name === newName) {
            return;
        }

        this._name = newName;
        this.onNameChanged(newName);
        this.firePropertyChanged('name');
    }

    public get parent(): Instance | null {
        this.throwIfDestroyed();
        return this._parent;
    }
    public set parent(newParent: Instance | null) {
        this.throwIfDestroyed();

        if (this._parent === newParent) {
            return;
        }

        const oldParent = this._parent;

        if (oldParent !== null) {
            oldParent.fireDescendantRemovingRecursive(this);

        }

        this._parent = newParent;
        this.firePropertyChanged('parent');

        if (oldParent !== null) {
            _.pull(oldParent._children, this);
            oldParent.fireChildRemoved(this);
            oldParent.fireAncestroyChangedRecursive(this, newParent);
        }

        if (newParent !== null) {
            newParent._children.push(this);
            newParent.fireChildAdded(this);
            newParent.fireDescendantAddedRecursive(this);
            newParent.fireAncestroyChangedRecursive(this, newParent);
        }

        this.onParentChanged(newParent);
    }

    //
    // Methods
    //

    public getFullName(): string {
        this.throwIfDestroyed();

        if (this._parent === null) {
            return this._name;
        }
        
        return this._parent.getFullName() + '/' + this._name;
    }

    public getChildren(): Instance[] {
        this.throwIfDestroyed();
        return [ ...this._children ];
    } 

    public getDescendants(): Instance[] {
        this.throwIfDestroyed();

        const descendants = [ ...this._children ];

        for (const child of this._children) {
            descendants.push(...child.getDescendants());
        }

        return descendants;
    } 

    public findFirstChildNamed(name: string, isRecursive: boolean = true): Instance | undefined {
        return this.findFirstChildInternal(i => i.name === name, isRecursive);
    }

    public findFirstChildOfClass<T extends Instance>(className: string | Class<T>, isRecursive: boolean = true): T | undefined {
        return this.findFirstChildInternal(i => i.className === className, isRecursive) as T;
    }

    public findFirstChildWhichIsA<T extends Instance>(className: string | Class<T>, isRecursive: boolean = true): T | undefined {
        return this.findFirstChildInternal(i => i.isA(className), isRecursive) as T;
    }

    public findFirstAncestorNamed(name: string): Instance | undefined {
        return this.findFirstAncestorInternal(i => i.name === name);
    }

    public findFirstAncestorOfClass<T extends Instance>(className: string | Class<T>): T | undefined {
        return this.findFirstAncestorInternal(i => i.className === className) as T;
    }

    public findFirstAncestorWhichIsA<T extends Instance>(className: string | Class<T>): T | undefined {
        return this.findFirstAncestorInternal(i => i.isA(className)) as T;
    }

    public isA<T extends Instance>(className: string | Class<T>): boolean {
        if (!_.isString(className)) {
            const classMetaData = getMetaData(className);
            className = classMetaData.className;
        }

        let metadata = this._metadata;
        while (metadata !== null) {
            if (className === metadata.className) {
                return true;
            }

            if (metadata.parent === null) {
                break;
            } else {
                metadata = getMetaData(metadata.parent);
            }
        }

        return false;
    }

    public clearAllChildren(): void {
        this.throwIfDestroyed();

        for (const child of this._children) {
            child.destroy();
        }
    }

    public destroy(): void {
        if (this._isDestroyed) {
            return;
        }

        this.parent = null;
        this.clearAllChildren();

        this.onDestroy();

        this._isDestroyed = true;
    }

    protected throwIfDestroyed(): void {
        if (this._isDestroyed) {
            throw new Error('Instance has been destroyed');
        }
    }

    protected onParentChanged(newParent: Instance | null): void {
        // No-op
    }

    protected onNameChanged(newName: string): void {
        // No-op
    }

    protected onPropertyChanged(propertyName: string): void {
        // No-op
    }

    protected onChildRemoved(child: Instance): void {
        // No-op
    }

    protected onChildAdded(child: Instance): void {
        // No-op
    }

    protected onAncestroyChanged(child: Instance, parent: Instance | null): void {
        // No-op
    }

    protected onDescendantRemoving(descendant: Instance): void {
        // No-op
    }

    protected onDescendantAdded(descendant: Instance): void {
        // No-op  
    }

    protected onDestroy(): void {
        this._ancestryChanged.disconnectAll();
        this._propertyChanged.disconnectAll();
        this._childAdded.disconnectAll();
        this._childRemoved.disconnectAll();
        this._descendantAdded.disconnectAll();
        this._descendantRemoving.disconnectAll();
    }

    private findFirstChildInternal(predicate: (inst: Instance) => boolean, isRecursive: boolean = true): Instance | undefined {
        this.throwIfDestroyed();

        const maxDepth = isRecursive ? undefined : 1;
        
        const result = this.findFirstChildRecursiveInternal(predicate, maxDepth, 0);
        if (result !== undefined) {
            return result[0];
        }

        return undefined;
    }

    private findFirstChildRecursiveInternal(
        predicate: (inst: Instance) => boolean,
        maxDepth: number | undefined,
        depthCounter: number
    ): [Instance, number] | undefined {        
        for (const child of this._children) {
            if (predicate(child)) {
                return [child, depthCounter];
            }
        }

        const nextDepth = depthCounter + 1;
        if (maxDepth !== undefined && nextDepth >= maxDepth) {
            return undefined;
        }

        const results: [Instance, number][] = [];
        for (const child of this._children) {
            const result = child.findFirstChildRecursiveInternal(predicate, maxDepth, nextDepth);
            if (result !== undefined) {
                results.push(result);
            }
        }

        const nearestResult = _.minBy(results, ([_, n]) => n);
        return nearestResult;
    }

    private findFirstAncestorInternal(predicate: (inst: Instance) => boolean): Instance | undefined {
        this.throwIfDestroyed();
        
        const result = this.findFirstAncestorRecursiveInternal(predicate, undefined, 0);
        if (result !== undefined) {
            return result[0];
        }

        return undefined;
    }

    private findFirstAncestorRecursiveInternal(
        predicate: (inst: Instance) => boolean,
        maxDepth: number | undefined,
        depthCounter: number
    ): [Instance, number] | undefined {
        if (predicate(this)) {
            return [this, depthCounter];
        }

        if (this._parent === null) {            
            return undefined;
        }

        const nextDepth = depthCounter + 1;
        if (maxDepth !== undefined && nextDepth >= maxDepth) {
            return undefined;
        }

        return this._parent.findFirstAncestorRecursiveInternal(predicate, maxDepth, nextDepth);
    }

    protected firePropertyChanged(propertyName: string): void {
        this.onPropertyChanged(propertyName);
        this._propertyChanged.emit(propertyName);
    }

    private fireChildRemoved(child: Instance): void {
        this.onChildRemoved(child);
        this._childRemoved.emit(this);
    }

    private fireChildAdded(child: Instance): void {
        this.onChildAdded(child);
        this._childAdded.emit(this);
    }

    private fireAncestroyChangedRecursive(child: Instance, parent: Instance | null): void {
        this.onAncestroyChanged(child, parent);
        this._ancestryChanged.emit(child, parent);

        for (const childInstance of this._children) {
            childInstance.fireAncestroyChangedRecursive(child, parent);
        }
    }

    private fireDescendantRemovingRecursive(descendant: Instance): void {
        this.onDescendantRemoving(descendant);
        this._descendantRemoving.emit(descendant);

        if (this._parent !== null) {
            this._parent.fireDescendantRemovingRecursive(descendant);
        }
    }

    private fireDescendantAddedRecursive(descendant: Instance): void {
        this.onDescendantAdded(descendant);
        this._descendantAdded.emit(descendant);

        if (this._parent !== null) {
            this._parent.fireDescendantAddedRecursive(descendant);
        }        
    }
}