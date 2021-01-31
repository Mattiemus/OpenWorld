import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import {
    AppBar,
    Divider,
    IconButton,
    Toolbar,
    makeStyles
} from '@material-ui/core';
import ProjectEditorPanels from './panels/project-editor-panels';
import ProjectEditorTabs from './tabs/project-editor-tabs';
import { ProjectEditorContextContainer, ProjectEditorContextProvider } from '../../core/contexts/project-editor-context';
import useConstant from '../../core/hooks/use-constant';
import Project from '../../core/models/project';
import InstanceContextRenderCanvas from '../../../client-shared/components/instance-context-render-canvas';

//
// Components
//

type ToolbarItem = {
    type: 'item';
    icon: React.ReactElement;
};

type ToolbarDivider = {
    type: 'divider';
};

function createToolbar(items: Array<ToolbarItem | ToolbarDivider>): JSX.Element {
    const childItems: Array<JSX.Element> = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        const hasDividerNext =
            (i !== (items.length - 1)) && 
            (items[i + 1].type === 'divider');

        if (item.type === 'item') {
            childItems.push(
                <IconButton key={i} edge="start" style={{ marginRight: (hasDividerNext ? '10px' : '16px') }} color="inherit" size="small">
                    {item.icon}
                </IconButton>
            );
        } else if (item.type === 'divider') {            
            childItems.push(
                <Divider key={i} orientation='vertical' style={{ marginRight: '16px' }} />
            );
        }
    }

    return (
        <AppBar position="static" color="default" elevation={3}>
            <Toolbar variant="dense" children={childItems} />
        </AppBar>
    );
}





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

        container.addTabAndSelect({
            tabId: '1',
            isClosable: false,
            title: 'Scene',
            onClose: () => {},
            component: <InstanceContextRenderCanvas instanceContext={container.editorInstanceContext} />
        });

        return container;
    });

    return (
        <ProjectEditorContextProvider value={editorContextContainer}>
            {
                createToolbar([
                    { type: 'item', icon: <MenuIcon /> },
                    { type: 'item', icon: <MenuIcon /> },
                    { type: 'divider' },
                    { type: 'item', icon: <MenuIcon /> },
                    { type: 'item', icon: <MenuIcon /> },
                    { type: 'item', icon: <MenuIcon /> },
                    { type: 'item', icon: <MenuIcon /> },
                    { type: 'divider' },
                    { type: 'item', icon: <MenuIcon /> },
                    { type: 'item', icon: <MenuIcon /> },
                    { type: 'item', icon: <MenuIcon /> }
                ]) 
            }

            <div className={classes.body}>
                <ProjectEditorPanels />                
                <ProjectEditorTabs />
            </div>  
        </ProjectEditorContextProvider>
    );
}