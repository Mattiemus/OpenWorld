import { createContext, useContext } from "react";
import EditorServiceContainer from "../services/editor-service-container";

export const EditorContext = createContext(new EditorServiceContainer());
EditorContext.displayName = "EditorContext";

export const EditorContextProvider = EditorContext.Provider;
export const EditorContextConsumer = EditorContext.Consumer;

export function useEditorContext() {
    const value = useContext(EditorContext);
    return value;
}