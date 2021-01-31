import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import useObservable from '../../../core/hooks/use-observable';
import {
    IconButton,
    makeStyles,
    Paper,
    Tab,
    Tabs
    } from '@material-ui/core';
import { ProjectEditorTab, useProjectEditorContext } from '../../../core/contexts/project-editor-context';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column'
    },
    tabCloseButton: {
        marginLeft: '8px'
    },
    closedTab: {
        display: 'none'
    },
    openedTab: {
        display: 'flex',
        flex: '1'
    }
}));

export type ProjectEditorTabsProps = {
};

export default function ProjectEditorTabs(props: ProjectEditorTabsProps) {
    const classes = useStyles();

    const editorContext = useProjectEditorContext();
    const activeTabs = useObservable(editorContext.activeTabs$, editorContext.activeTabs);
    const selectedTab = useObservable(editorContext.selectedTab$, editorContext.selectedTab);

    const setSelectedTab = (newTab: ProjectEditorTab | null) => {
        return () => {
            editorContext.selectedTab = newTab;
        }
    }

    return (
        <div className={classes.root}>
            <Paper square elevation={0}>
                <Tabs indicatorColor='primary' textColor='primary' value={selectedTab}>
                    {
                        activeTabs.map(tab => {
                            return (
                                <Tab 
                                    key={tab.tabId}
                                    onClick={setSelectedTab(tab)}
                                    value={tab} 
                                    label={
                                        <div>
                                            {tab.title}
                                            {
                                                tab.isClosable &&
                                                <IconButton
                                                    className={classes.tabCloseButton}
                                                    component="div"
                                                    size='small'
                                                    onClick={tab.onClose}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            }
                                        </div>
                                    } 
                                />
                            );
                        })
                    }
                </Tabs>
            </Paper>

            {
                activeTabs.map(tab => {
                    return (
                        <div key={tab.tabId} className={selectedTab === tab ? classes.openedTab : classes.closedTab}>
                            {tab.component}
                        </div>
                    );
                })
            }
        </div>
    );
}