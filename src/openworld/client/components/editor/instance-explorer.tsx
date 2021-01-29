import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Instance from '../../../engine/datamodel/elements/instance';
import InstanceExplorerItem from './instance-explorer-item';
import React, { useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { isString } from '../../../engine/utils/type-guards';
import SearchIcon from '@material-ui/icons/Search';
import { Menu, MenuItem, ListItemIcon, ListItemText, SvgIcon, TextField, InputAdornment, IconButton } from '@material-ui/core';
import CutIcon from '../../../editor/core/components/icons/cut-icon';
import InstanceUtils from '../../../engine/datamodel/utils/InstanceUtils';

export type InstanceExplorerProps = {
    style?: React.CSSProperties;
    instance: Instance;
    multiSelect?: boolean;
    showEditorHiddenInstances?: boolean;
    onInstanceSelect?: (event: React.ChangeEvent<{}>, instances: Instance | Instance[]) => void;
};

export default function InstanceExplorer(props: InstanceExplorerProps) {
    const { 
        style, 
        instance, 
        multiSelect, 
        showEditorHiddenInstances, 
        onInstanceSelect
    } = props;

    const [ selectedInstances, setSelectedInstances ] = useState<Instance[]>([]);

    const [ contextMenuMouseState, setContextMenuMouseState ] =
        React.useState<{ mouseX: number | null, mouseY: number | null }>({ mouseX: null, mouseY: null });

    const onExplorerItemContextMenu = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, instance: Instance) => {
        event.preventDefault();
        event.stopPropagation();

        if (selectedInstances.findIndex(i => i === instance) === -1) {
            setSelectedInstances([ instance ]);
        }

        setContextMenuMouseState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };
  
    const closeExplorerItemContextMenu = () => {
        setContextMenuMouseState({ mouseX: null, mouseY: null });
    };
  
    const onExplorerItemDuplicateClick = () => {
        const clonedInstances: Instance[] = [];
        for (const instance of selectedInstances) {
            const clonedInstance = instance.clone();
            clonedInstance.parent = instance.parent;

            if (!clonedInstance.name.endsWith('Clone')) {
                clonedInstance.name += ' Clone';
            }

            clonedInstances.push(clonedInstance);
        }
        
        setSelectedInstances([ ...selectedInstances, ...clonedInstances ]);
        setContextMenuMouseState({ mouseX: null, mouseY: null });
    };
  
    const onExplorerItemDeleteClick = () => {
        for (const instance of selectedInstances) {
            instance.destroy();
        }
        
        setSelectedInstances([]);
        setContextMenuMouseState({ mouseX: null, mouseY: null });
    };

    const onNodeSelect = (event: React.ChangeEvent<{}>, nodeIds: string | string[]) => {
        if (onInstanceSelect === undefined) {
            return;
        }

        const context = instance['_context'];

        if (isString(nodeIds)) {
            const selectedInstance = context.findInstance(nodeIds);
            if (selectedInstance !== undefined) { 
                setSelectedInstances([ selectedInstance ]);               
                onInstanceSelect(event, selectedInstance);
            } else {                
                setSelectedInstances([]);  
                onInstanceSelect(event, []);
            }
        } else {
            const selectedInstances =
                nodeIds
                    .map(i => context.findInstance(i))
                    .filter(i => i !== undefined) as Instance[];

            setSelectedInstances(selectedInstances);  
            onInstanceSelect(event, selectedInstances);
        }
    };

    const [ filter, setFilter ] = useState<string | undefined>(undefined);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ flexGrow: 1, marginLeft: '4px' }}>   
                    <TextField
                        fullWidth
                        placeholder="Filter Elements"
                        value={filter === undefined ? '' : filter}
                        onChange={e => {
                            setFilter(e.target.value.length === 0 ? undefined : e.target.value);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>

                <IconButton size="small">
                    <DeleteIcon />
                </IconButton>

                <IconButton size="small">
                    <DeleteIcon />
                </IconButton>

                <IconButton size="small">
                    <DeleteIcon />
                </IconButton>
            </div>

            <TreeView 
                style={style}
                multiSelect={multiSelect as any}
                defaultExpanded={[ InstanceUtils.getRefId(instance) ]}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                selected={selectedInstances.map(i => InstanceUtils.getRefId(i))}
                onNodeSelect={onNodeSelect}
            >
                <InstanceExplorerItem
                    onContextMenu={onExplorerItemContextMenu}
                    showEditorHiddenInstances={showEditorHiddenInstances}
                    instance={instance} />
                
                <Menu
                    keepMounted
                    open={contextMenuMouseState.mouseY !== null}
                    onClose={closeExplorerItemContextMenu}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenuMouseState.mouseY !== null && contextMenuMouseState.mouseX !== null
                            ? { top: contextMenuMouseState.mouseY, left: contextMenuMouseState.mouseX }
                            : undefined
                    }
                >
                    <MenuItem dense disabled onClick={closeExplorerItemContextMenu}>
                        <ListItemIcon>									
                            <CutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Cut" />
                    </MenuItem>

                    <MenuItem dense disabled onClick={closeExplorerItemContextMenu}>
                        <ListItemIcon>									
                            <FileCopyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Copy" />
                    </MenuItem>

                    <MenuItem dense disabled onClick={closeExplorerItemContextMenu}>
                        <ListItemIcon>									
                            <AssignmentIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Paste" />
                    </MenuItem>

                    <MenuItem dense disabled onClick={closeExplorerItemContextMenu}>
                        <ListItemIcon>									
                            <SvgIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Paste Into" />
                    </MenuItem>

                    <MenuItem dense onClick={onExplorerItemDuplicateClick}>
                        <ListItemIcon>									
                            <FileCopyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Duplicate" />
                    </MenuItem>

                    <MenuItem dense onClick={onExplorerItemDeleteClick}>
                        <ListItemIcon>									
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Delete" />
                    </MenuItem>
                </Menu>
            </TreeView>
        </div>
    );
}