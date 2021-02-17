import Project from '../../core/models/project';
import ProjectEditorAppBar from './project-editor-app-bar';
import ProjectEditorPanels from './panels/project-editor-panels';
import ProjectEditorTabs from './tabs/project-editor-tabs';
import React from 'react';
import useConstant from '../../core/hooks/use-constant';
import { makeStyles } from '@material-ui/core';
import { ProjectEditorContextContainer, ProjectEditorContextProvider } from '../../core/contexts/project-editor-context';

//
// Styles
//

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexBasis: '100%',
        flexDirection: 'column'
    },
    body: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row'
    }
}));

//
// Component
//

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

    const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
    };

    return (
        <ProjectEditorContextProvider value={editorContextContainer}>
            <div className={classes.root} onContextMenu={onContextMenu}>
                <ProjectEditorAppBar />

                <div className={classes.body}>
                    <ProjectEditorPanels />                
                    <ProjectEditorTabs />
                </div>  
            </div>
        </ProjectEditorContextProvider>
    );
}
