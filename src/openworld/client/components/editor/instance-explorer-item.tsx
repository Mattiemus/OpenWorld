import Instance from '../../../engine/datamodel/elements/instance';
import React, { useState, useEffect } from 'react';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import { makeStyles } from '@material-ui/core/styles';
import { getMetaData } from '../../../engine/datamodel/internals/metadata/metadata';
import InstanceLabel from './instance-label';

const useStyles = makeStyles((theme) => ({
    label: {
      fontWeight: 'inherit',
      color: 'inherit',
      padding: theme.spacing(0.5, 0)
    }
}));

type Props = {
    instance: Instance
} & Partial<Omit<TreeItemProps, 'label' | 'nodeId' | 'key'>>;

function createChildExplorerItems(props: Props) {
    const { instance, ...otherProps } = props;

    return instance.getChildren().map(inst => {
        const metadata = getMetaData(inst);
        if (metadata.hasAttribute('EditorHidden')) {
            return null;
        }

        return (<InstanceExplorerItem {...otherProps} key={inst['_refId']} instance={inst} />);
    });
};

export default function InstanceExplorerItem(props: Props) {
    const { instance, ...otherProps } = props;

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
    }, [ instance ]);

    return (
        <TreeItem
            {...otherProps}
            nodeId={instance['_refId']}
            key={instance['_refId']}
            label={<InstanceLabel instance={instance} />}
            classes={{
                ...otherProps.classes,
                label: classes.label
            }}
        >
            { childExplorerItems }
        </TreeItem>
    );
}