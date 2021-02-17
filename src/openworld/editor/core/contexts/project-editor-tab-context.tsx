import { ProjectEditorTab, useProjectEditorContext, ProjectEditorContextContainer } from "./project-editor-context";
import { useContext, createContext, useEffect } from "react";

export const ProjectEditorTabContext = createContext<ProjectEditorTab>(undefined as unknown as ProjectEditorTab);
ProjectEditorTabContext.displayName = "ProjectEditorTabContext";

export const ProjectEditorTabContextProvider = ProjectEditorTabContext.Provider;
export const ProjectEditorTabContextConsumer = ProjectEditorTabContext.Consumer;

export function useProjectEditorTabContext() {
    const projectEditorTabContext = useContext(ProjectEditorTabContext);
    return projectEditorTabContext;
}

export function useEditorTabCloseEffect(
    fn: (projectEditorContext: ProjectEditorContextContainer, tab: ProjectEditorTab) => void,
    deps: any[] = []
): void {
    const projectEditorContext = useProjectEditorContext();
    const tab = useProjectEditorTabContext();

    useEffect(() => {
        tab.onClose = () => fn(projectEditorContext, tab);
        projectEditorContext.updateTab(tab);

        return () => {
            tab.onClose = undefined;
            projectEditorContext.updateTab(tab);
        };
    }, [ fn, projectEditorContext, tab, ...deps ]);
}