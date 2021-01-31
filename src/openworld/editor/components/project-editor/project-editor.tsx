import Project from '../../core/models/project';
import ProjectEditorPanels from './panels/project-editor-panels';
import ProjectEditorTabs from './tabs/project-editor-tabs';
import React from 'react';
import useConstant from '../../core/hooks/use-constant';
import { makeStyles } from '@material-ui/core';
import { ProjectEditorContextContainer, ProjectEditorContextProvider } from '../../core/contexts/project-editor-context';

const useStyles = makeStyles(() => ({
    body: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row'
    }
}));

export type ProjectEditorProps = {
    project: Project
};

export default function ProjectEditor(props: ProjectEditorProps) {
    const { project } = props;

    const classes = useStyles();

    const editorContextContainer = useConstant(() => {
        const container = new ProjectEditorContextContainer(project);
        return container;
    });

    return (
        <ProjectEditorContextProvider value={editorContextContainer}>
            <div className={classes.body}>
                <ProjectEditorPanels />                
                <ProjectEditorTabs />
            </div>  
        </ProjectEditorContextProvider>
    );
}
