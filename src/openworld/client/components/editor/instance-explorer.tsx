import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Instance from '../../../engine/datamodel/elements/instance';
import InstanceExplorerItem from './instance-explorer-item';
import React from 'react';
import TreeView, { TreeViewProps } from '@material-ui/lab/TreeView';
import { isString } from '../../../engine/utils/type-guards';

type Props = {
    instance: Instance;
    multiSelect?: boolean;
    onInstanceSelect?: (event: React.ChangeEvent<{}>, instances: Instance | Instance[]) => void;
} & Omit<TreeViewProps, 'defaultExpanded' | 'defaultSelected' | 'selected' | 'multiSelect' | 'defaultCollapseIcon' | 'defaultExpandIcon' | 'onNodeSelect'>;

export default function InstanceExplorer(props: Props) {
    const { instance, multiSelect, onInstanceSelect, ...treeViewProps } = props;

    const onNodeSelect = (event: React.ChangeEvent<{}>, nodeIds: string | string[]) => {
        if (onInstanceSelect === undefined) {
            return;
        }

        const context = instance['_context'];

        if (isString(nodeIds)) {
            const selectedInstance = context.findInstance(nodeIds);
            if (selectedInstance !== undefined) {                
                onInstanceSelect(event, selectedInstance);
            } else {                
                onInstanceSelect(event, []);
            }
        } else {
            const selectedInstances =
                nodeIds
                    .map(i => context.findInstance(i))
                    .filter(i => i !== undefined) as Instance[];

            onInstanceSelect(event, selectedInstances);
        }
    };

    return (
        <TreeView 
            {...treeViewProps}
            multiSelect={multiSelect as any}
            defaultExpanded={[ instance['_refId'] ]}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            onNodeSelect={onNodeSelect}
        >
            <InstanceExplorerItem instance={instance} />
        </TreeView>
    );
}