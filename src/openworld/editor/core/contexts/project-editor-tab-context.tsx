import { ProjectEditorTab } from "./project-editor-context";
import { useContext, createContext } from "react";

export const ProjectEditorTabContext = createContext<ProjectEditorTab>(undefined as unknown as ProjectEditorTab);
ProjectEditorTabContext.displayName = "ProjectEditorTabContext";

export const ProjectEditorTabContextProvider = ProjectEditorTabContext.Provider;
export const ProjectEditorTabContextConsumer = ProjectEditorTabContext.Consumer;

export function useProjectEditorTabContext() {
    const projectEditorTabContext = useContext(ProjectEditorTabContext);
    return projectEditorTabContext;
}