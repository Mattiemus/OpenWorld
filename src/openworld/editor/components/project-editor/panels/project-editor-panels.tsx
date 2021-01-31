import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ContentPanel from './content-panel';
import ExplorerPanel from './explorer-panel';
import React from 'react';
import useObservable from '../../../core/hooks/use-observable';
import WorkIcon from '@material-ui/icons/Work';
import { ProjectEditorPanel, useProjectEditorContext } from '../../../core/contexts/project-editor-context';
import {
    List,
    ListItem,
    makeStyles,
    } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: theme.spacing(50),
        display: 'flex',
        flexDirection: 'row'
    },
    closedPanel: {
        display: 'none'
    },
    openedPanel: {
        display: 'flex',
        flex: '1'
    }
}));

export type ProjectEditorPanelsProps = {
};

export default function ProjectEditorPanels(props: ProjectEditorPanelsProps) {
    const editorContext = useProjectEditorContext();
    const selectedPanel = useObservable(editorContext.selectedPanel$, editorContext.selectedPanel);
    
    const classes = useStyles({ selectedPanel });

    const setSelectedPanel = (newPanel: ProjectEditorPanel) => {
        return () => {
            editorContext.selectedPanel = newPanel;
        }
    }

    return (
        <div className={classes.root}>
            <List component="nav">
                <ListItem
                    button
                    selected={selectedPanel === ProjectEditorPanel.Explorer}
                    onClick={setSelectedPanel(ProjectEditorPanel.Explorer)}
                >
                    <AccountTreeIcon />
                </ListItem>

                <ListItem
                    button
                    selected={selectedPanel === ProjectEditorPanel.Content}
                    onClick={setSelectedPanel(ProjectEditorPanel.Content)}
                >
                    <WorkIcon />
                </ListItem>
            </List>

            <div className={selectedPanel === ProjectEditorPanel.Explorer ? classes.openedPanel : classes.closedPanel}>
                <ExplorerPanel />
            </div>

            <div className={selectedPanel === ProjectEditorPanel.Content ? classes.openedPanel : classes.closedPanel}>
                <ContentPanel />
            </div>
        </div>
    );
}