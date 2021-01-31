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
import { ProjectEditorTabContextProvider } from '../../../core/contexts/project-editor-tab-context';

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
    const selectedTabId = useObservable(editorContext.selectedTabId$, editorContext.selectedTabId);
    const activeTabs = useObservable(editorContext.activeTabs$, editorContext.activeTabs);

    const setSelectedTab = (newTabId: number | undefined) => {
        return () => {
            editorContext.selectedTabId = newTabId;
        }
    }

    const closeTab = (tab: ProjectEditorTab) => {
        return (event: React.MouseEvent) => {
            event.stopPropagation();
            if (tab.onClose !== undefined) {
                tab.onClose();
            }
        }
    };

    return (
        <div className={classes.root}>
            <Paper square elevation={0}>
                <Tabs indicatorColor='primary' textColor='primary' value={selectedTabId}>
                    {
                        activeTabs.map(tab => {
                            return (
                                <Tab 
                                    key={tab.id}
                                    value={tab.id} 
                                    onClick={setSelectedTab(tab.id)}
                                    label={
                                        <div>
                                            {tab.title}
                                            {
                                                tab.isClosable &&
                                                <IconButton
                                                    className={classes.tabCloseButton}
                                                    component="div"
                                                    size='small'
                                                    onClick={closeTab(tab)}
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
                        <div key={tab.id} className={selectedTabId === tab.id ? classes.openedTab : classes.closedTab}>
                            <ProjectEditorTabContextProvider value={tab}>
                                {tab.component}
                            </ProjectEditorTabContextProvider>
                        </div>
                    );
                })
            }
        </div>
    );
}