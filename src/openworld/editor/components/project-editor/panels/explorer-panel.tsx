import InstanceEditor from './explorer/instance-editor';
import InstanceExplorer from './explorer/instance-explorer';
import PanelHeader from './shared/panel-header';
import React from 'react';
import useObservable from '../../../core/hooks/use-observable';
import { makeStyles } from '@material-ui/core';
import { useProjectEditorContext, useProjectEditorInstanceContext } from '../../../core/contexts/project-editor-context';

//
// Styles
//

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: '1',
        flexDirection: 'column'
    },
    instanceExplorer: {
        display: 'flex',
        flex: '2',
        padding: theme.spacing(1)
    },
    instanceProperties: {
        display: 'flex',
        flex: '1',
        padding: theme.spacing(1)
    }
}));

//
// Component
//

export type ExplorerPanelProps = {
};

export default function ExplorerPanel(props: ExplorerPanelProps) {
    const classes = useStyles();

    const editorContext = useProjectEditorContext();
    const editorInstanceContext = useProjectEditorInstanceContext();

    const selectedInstances = useObservable(editorContext.selectedInstaces$, editorContext.selectedInstaces);

    return (
        <div className={classes.root}>
            <PanelHeader>
                Explorer
            </PanelHeader>
            
            <div className={classes.instanceExplorer}>
                <InstanceExplorer
                    instance={editorInstanceContext.dataModel}
                    multiSelect={true}
                />
            </div>
            
            <PanelHeader>
                Properties
            </PanelHeader>

            <div className={classes.instanceProperties}>
                { 
                    selectedInstances.length !== 0 &&
                    <InstanceEditor
                        instance={selectedInstances[0]} 
                    />
                }
            </div>
        </div>
    );
}