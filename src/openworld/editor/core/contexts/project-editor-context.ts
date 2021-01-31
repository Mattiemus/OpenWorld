import JsonInstanceContextSerializer from '../../../engine/datamodel/serialization/json/json-instance-context-serializer';
import LocalClientInstanceContext from '../../../client/instance-contexts/local-client-instance-context';
import Project from '../models/project';
import { BehaviorSubject, Observable } from 'rxjs';
import { createContext, useContext } from 'react';

export enum ProjectEditorPanel {
    Explorer,
    Content
}

export interface ProjectEditorTab {
    tabId: string;
    isClosable: boolean;
    title: string;
    onClose: () => void;
    component: React.ReactElement;
}

export class ProjectEditorContextContainer {
    private _editorInstanceContext: LocalClientInstanceContext;
    private _selectedPanel$ = new BehaviorSubject<ProjectEditorPanel>(ProjectEditorPanel.Explorer);
    private _activeTabs$ = new BehaviorSubject<Array<ProjectEditorTab>>([]);
    private _selectedTab$ = new BehaviorSubject<ProjectEditorTab | null>(null);

    public constructor(project: Project) {
        this._editorInstanceContext = new LocalClientInstanceContext();
        JsonInstanceContextSerializer.deserializeObject(
            project.data,
            this._editorInstanceContext
        );
    }

    public get editorInstanceContext(): LocalClientInstanceContext {
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
        const newTabs = [ ...this.activeTabs, tab ];
        this._activeTabs$.next(newTabs);

        if (this.selectedTab === null) {
            this.selectedTab = tab;
        }
    }

    public addTabAndSelect(tab: ProjectEditorTab): void {
        this.addTab(tab);
        this.selectedTab = tab;
    }

    public removeTab(tab: ProjectEditorTab): void {
        const newTabs = this.activeTabs.filter(t => t !== tab);
        this._activeTabs$.next(newTabs);

        if (this.selectedTab === tab) {
            this.selectedTab = this.activeTabs.length === 0 
                ? null
                : this.activeTabs[this.activeTabs.length - 1];
        }
    }

    public get selectedTab(): ProjectEditorTab | null {
        return this._selectedTab$.value;
    }
    public set selectedTab(newValue: ProjectEditorTab | null) {
        this._selectedTab$.next(newValue);
    }
    public get selectedTab$(): Observable<ProjectEditorTab | null> {
        return this._selectedTab$.asObservable();
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