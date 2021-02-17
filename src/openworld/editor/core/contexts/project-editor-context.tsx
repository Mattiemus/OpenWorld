import JsonInstanceContextSerializer from '../../../engine/datamodel/serialization/json/json-instance-context-serializer';
import Project from '../models/project';
import React, { createContext, useContext } from 'react';
import SceneEditorTab from '../../components/project-editor/tabs/scene-editor-tab';
import { BehaviorSubject, Observable } from 'rxjs';
import EditorInstanceContext from '../../instance-contexts/editor-instance-context';
import Instance from '../../../engine/datamodel/elements/instance';

export enum ProjectEditorTool {
    Pointer,
    Move,
    Scale,
    Rotate
}

export enum ProjectEditorPanel {
    Explorer,
    Content
}

export interface ProjectEditorTab {
    id?: number;
    title: string;
    isClosable: boolean;
    component: React.ReactElement;
    data?: any;
    onClose?: () => void;    
}

export class ProjectEditorContextContainer {
    private _tabIdCounter: number = 0;
    private _editorInstanceContext: EditorInstanceContext;
    private _selectedPanel$ = new BehaviorSubject<ProjectEditorPanel>(ProjectEditorPanel.Explorer);
    private _activeTabs$ = new BehaviorSubject<Array<ProjectEditorTab>>([]);
    private _selectedTabId$ = new BehaviorSubject<number | undefined>(undefined);
    private _selectedInstaces$ = new BehaviorSubject<Instance[]>([]);
    private _selectedTool$ = new BehaviorSubject<ProjectEditorTool>(ProjectEditorTool.Pointer);

    public constructor(project: Project) {
        this._editorInstanceContext = new EditorInstanceContext();
        JsonInstanceContextSerializer.deserializeObject(
            project.data,
            this._editorInstanceContext
        );

        this.addTabAndSelect({
            title: 'Scene',
            isClosable: false,
            component: <SceneEditorTab />
        });
    }

    public get editorInstanceContext(): EditorInstanceContext {
        return this._editorInstanceContext;
    }

    public get selectedPanel(): ProjectEditorPanel {
        return this._selectedPanel$.value;
    }
    public set selectedPanel(newValue: ProjectEditorPanel) {
        this._selectedPanel$.next(newValue);
    }
    public get selectedPanel$(): Observable<ProjectEditorPanel> {
        return this._selectedPanel$.asObservable();
    }

    public get activeTabs(): Array<ProjectEditorTab> {
        return this._activeTabs$.value;
    }
    public get activeTabs$(): Observable<Array<ProjectEditorTab>> {
        return this._activeTabs$.asObservable();
    }
    public addTab(tab: ProjectEditorTab): void {
        if (tab.id === undefined) {
            tab.id = this._tabIdCounter++;
        }

        const newTabs = [ ...this.activeTabs, tab ];
        this._activeTabs$.next(newTabs);

        if (this.selectedTabId === undefined) {
            this.selectedTabId = tab.id;
        }
    }
    public addTabAndSelect(tab: ProjectEditorTab): void {
        this.addTab(tab);
        this.selectedTabId = tab.id;
    }
    public updateTab(tab: ProjectEditorTab): void {
        const tabIndex = this.activeTabs.findIndex(t => t.id === tab.id);
        if (tabIndex === -1) {
            return;
        }

        const newTabs = [ ...this.activeTabs ];
        newTabs[tabIndex] = tab;

        this._activeTabs$.next(newTabs);
    }
    public removeTab(tab: ProjectEditorTab): void {
        const tabIndex = this.activeTabs.findIndex(t => t.id === tab.id);
        if (tabIndex === -1) {
            return;
        }

        if (this.selectedTabId === tab.id) {
            const nextTab = 
                this.activeTabs[tabIndex - 1] ||
                this.activeTabs[tabIndex + 1] ||
                undefined;

            this.selectedTabId = nextTab === undefined ? undefined : nextTab.id;
        }
        
        const newTabs = this.activeTabs.filter(t => t.id !== tab.id);
        this._activeTabs$.next(newTabs);
    }

    public get selectedTabId(): number | undefined {
        return this._selectedTabId$.value;
    }
    public set selectedTabId(newValue: number | undefined) {
        this._selectedTabId$.next(newValue);
    }
    public get selectedTabId$(): Observable<number | undefined> {
        return this._selectedTabId$.asObservable();
    }

    public get selectedInstaces(): Instance[] {
        return this._selectedInstaces$.value;
    }
    public set selectedInstaces(newValue: Instance[]) {
        this._selectedInstaces$.next(newValue);
    }
    public get selectedInstaces$(): Observable<Instance[]> {
        return this._selectedInstaces$.asObservable();
    }

    public get selectedTool(): ProjectEditorTool {
        return this._selectedTool$.value;
    }
    public set selectedTool(newValue: ProjectEditorTool) {
        this._selectedTool$.next(newValue);
    }
    public get selectedTool$(): Observable<ProjectEditorTool> {
        return this._selectedTool$.asObservable();
    }
}

export const ProjectEditorContext = createContext<ProjectEditorContextContainer>(undefined as unknown as ProjectEditorContextContainer);
ProjectEditorContext.displayName = "ProjectEditorContext";

export const ProjectEditorContextProvider = ProjectEditorContext.Provider;
export const ProjectEditorContextConsumer = ProjectEditorContext.Consumer;

export function useProjectEditorContext() {
    const projectEditorContext = useContext(ProjectEditorContext);
    return projectEditorContext;
}

export function useProjectEditorInstanceContext() {
    const projectEditorContext = useContext(ProjectEditorContext);
    return projectEditorContext.editorInstanceContext;    
}