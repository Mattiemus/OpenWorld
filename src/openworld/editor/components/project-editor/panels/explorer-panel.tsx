import Instance from '../../../../engine/datamodel/elements/instance';
import InstanceContext from '../../../../engine/datamodel/internals/instance-context';
import InstanceEditor from '../../../core/components/instances/instance-editor';
import InstanceExplorer from '../../_to-organise/instance-explorer';
import React, { useState } from 'react';
import SimpleBar from 'simplebar-react';
import { isArray } from '../../../../engine/utils/type-guards';
import { makeStyles } from '@material-ui/core';
import PanelHeader from '../../../core/components/panels/panel-header';
import { useProjectEditorInstanceContext } from '../../../core/contexts/project-editor-context';

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
    },
    instancePropertiesSimpleBar: {
        display: 'flex',
        flex: '1'
    }
}));

export type ExplorerPanelProps = {
};

export default function ExplorerPanel(props: ExplorerPanelProps) {
    const classes = useStyles();

    const editorInstanceContext = useProjectEditorInstanceContext();

    const [ selectedInstance, setSelectedInstance ] = useState<Instance | null>(null);

    const onInstanceSelect = (_event: React.ChangeEvent<{}>, instances: Instance | Instance[]) => {
        if (isArray(instances)) {
            if (instances.length === 0) {                
                setSelectedInstance(null);
            } else {
                setSelectedInstance(instances[0]);
            }
        } else {
            setSelectedInstance(instances);
        }
    };

    return (
        <div className={classes.root}>
            <PanelHeader>
                Explorer
            </PanelHeader>
            
            <div className={classes.instanceExplorer}>
                <InstanceExplorer
                    instance={editorInstanceContext.dataModel}
                    showEditorHiddenInstances={true}
                    multiSelect={true}
                    onInstanceSelect={onInstanceSelect}
                />
            </div>
            
            <PanelHeader>
                Properties
            </PanelHeader>

            <div className={classes.instanceProperties}>
                { 
                    selectedInstance &&
                    <SimpleBar className={classes.instancePropertiesSimpleBar}>
                        <InstanceEditor
                            instance={selectedInstance} 
                        />
                    </SimpleBar>
                }
            </div>
        </div>
    );
}