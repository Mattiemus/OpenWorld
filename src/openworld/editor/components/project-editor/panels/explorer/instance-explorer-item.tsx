import Instance from '../../../../../engine/datamodel/elements/instance';
import React, { useState, useEffect } from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeStyles } from '@material-ui/core/styles';
import { getMetaData } from '../../../../../engine/datamodel/internals/metadata/metadata';
import InstanceLabel from '../../../../core/components/instances/instance-label';
import InstanceUtils from '../../../../../engine/datamodel/utils/InstanceUtils';

//
// Styles
//

const useStyles = makeStyles((theme) => ({
    label: {
      padding: theme.spacing(0.5, 0)
    }
}));

//
// Component
//

export type InstanceExplorerItemProps = {
    instance: Instance;
    showEditorHiddenInstances?: boolean;
    onContextMenu?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>, instance: Instance) => void;
};

function createChildExplorerItems(props: InstanceExplorerItemProps) {
    const { instance, showEditorHiddenInstances, ...otherProps } = props;

    return instance.getChildren().map(inst => {
        if (showEditorHiddenInstances === undefined || !showEditorHiddenInstances) {
            const metadata = getMetaData(inst);
            if (metadata.hasAttribute('EditorHidden')) {
                return null;
            }
        }

        return (
            <InstanceExplorerItem
                {...otherProps}
                key={InstanceUtils.getRefId(inst)}
                instance={inst} />
        );
    });
};

export default function InstanceExplorerItem(props: InstanceExplorerItemProps) {
    const { instance, onContextMenu } = props;

    const classes = useStyles();

    const [ childExplorerItems, setChildExplorerItems ] = useState(createChildExplorerItems(props));
    useEffect(() => setChildExplorerItems(createChildExplorerItems(props)), [ props ]);

    useEffect(() => {
        const instanceChildAddedConnection =
            instance.childAdded.connect(() => {
                setChildExplorerItems(createChildExplorerItems(props));
            });

        const instanceChildRemovedConnection =
            instance.childRemoved.connect(() => {
                setChildExplorerItems(createChildExplorerItems(props));
            });

        return () => {
            instanceChildAddedConnection.disconnect();
            instanceChildRemovedConnection.disconnect();
        };
    }, [ instance, props ]);

    return (
        <TreeItem
            onContextMenu={onContextMenu === undefined ? undefined : (e) => onContextMenu(e, instance)}
            nodeId={InstanceUtils.getRefId(instance)}
            key={InstanceUtils.getRefId(instance)}
            label={<InstanceLabel instance={instance} />}
            classes={{
                label: classes.label
            }}
        >
            { childExplorerItems }
        </TreeItem>
    );
}