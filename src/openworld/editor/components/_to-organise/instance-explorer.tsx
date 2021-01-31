import AssignmentIcon from '@material-ui/icons/Assignment';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CutIcon from '../../core/components/icons/cut-icon';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Instance from '../../../engine/datamodel/elements/instance';
import InstanceExplorerItem from './instance-explorer-item';
import InstanceUtils from '../../../engine/datamodel/utils/InstanceUtils';
import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import SimpleBar from 'simplebar-react';
import TreeView from '@material-ui/lab/TreeView';
import VisibilityIcon from '@material-ui/icons/Visibility';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import {
    IconButton,
    InputAdornment,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    SvgIcon,
    TextField,
    Divider,
    MenuItemProps,
    ListItemSecondaryAction,
    ListItem
    } from '@material-ui/core';
import { isString } from '../../../engine/utils/type-guards';

export type InstanceExplorerProps = {
    instance: Instance;
    multiSelect?: boolean;
    showEditorHiddenInstances?: boolean;
    onInstanceSelect?: (event: React.ChangeEvent<{}>, instances: Instance | Instance[]) => void;
};

export default function InstanceExplorer(props: InstanceExplorerProps) {
    const {
        instance, 
        multiSelect, 
        showEditorHiddenInstances, 
        onInstanceSelect
    } = props;

    const [ selectedInstances, setSelectedInstances ] = useState<Instance[]>([]);

    const [ contextMenuMouseState, setContextMenuMouseState ] =
        useState<{ mouseX: number | null, mouseY: number | null }>({ mouseX: null, mouseY: null });

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
        <div style={{ display: 'flex', flexBasis: '100%', flexDirection: 'column' }}>
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
                    <VisibilityIcon />
                </IconButton>

                <IconButton size="small">
                    <UnfoldLessIcon />
                </IconButton>
            </div>

            <SimpleBar style={{ display: 'flex', flex: '1' }}>
                <div style={{ display: 'flex', flex: '1', width: '100%' }}>
                    <TreeView
                        style={{ width: '100%' }}
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
                            <MenuItem dense disabled onClick={closeExplorerItemContextMenu} style={{ minWidth: '300px' }}>
                                <ListItemIcon>									
                                    <CutIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Cut" />
                                <ListItemSecondaryAction>                                
                                    <ListItemText primary="Ctrl+X" primaryTypographyProps={{ color: 'textSecondary' }} />
                                </ListItemSecondaryAction>
                            </MenuItem>

                            <MenuItem dense disabled onClick={closeExplorerItemContextMenu}>
                                <ListItemIcon>									
                                    <FileCopyIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Copy" />
                                <ListItemSecondaryAction>                                
                                    <ListItemText primary="Ctrl+C" primaryTypographyProps={{ color: 'textSecondary' }} />
                                </ListItemSecondaryAction>
                            </MenuItem>

                            <MenuItem dense disabled onClick={closeExplorerItemContextMenu}>
                                <ListItemIcon>									
                                    <AssignmentIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Paste" />
                                <ListItemSecondaryAction>                                
                                    <ListItemText primary="Ctrl+V" primaryTypographyProps={{ color: 'textSecondary' }} />
                                </ListItemSecondaryAction>
                            </MenuItem>

                            <MenuItem dense disabled onClick={closeExplorerItemContextMenu}>
                                <ListItemIcon>									
                                    <SvgIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Paste Into" />
                                <ListItemSecondaryAction>                                
                                    <ListItemText primary="Ctrl+Shirt+V" primaryTypographyProps={{ color: 'textSecondary' }} />
                                </ListItemSecondaryAction>
                            </MenuItem>

                            <MenuItem dense onClick={onExplorerItemDuplicateClick}>
                                <ListItemIcon>									
                                    <FileCopyIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Duplicate" />
                                <ListItemSecondaryAction>                                
                                    <ListItemText primary="Ctrl+D" primaryTypographyProps={{ color: 'textSecondary' }} />
                                </ListItemSecondaryAction>
                            </MenuItem>

                            <MenuItem dense onClick={onExplorerItemDeleteClick}>
                                <ListItemIcon>									
                                    <DeleteIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Delete" />
                                <ListItemSecondaryAction>                                
                                    <ListItemText primary="Del" primaryTypographyProps={{ color: 'textSecondary' }} />
                                </ListItemSecondaryAction>
                            </MenuItem>

                            <MenuItem dense disabled onClick={closeExplorerItemContextMenu}>
                                <ListItemIcon>									
                                    <SvgIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Rename" />
                                <ListItemSecondaryAction>                                
                                    <ListItemText primary="F2" primaryTypographyProps={{ color: 'textSecondary' }} />
                                </ListItemSecondaryAction>
                            </MenuItem>

                            <Divider orientation="horizontal" />

                            <MenuItem dense onClick={onExplorerItemDeleteClick}>
                                <ListItemIcon>									
                                    <SvgIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Insert Primitive" />
                            </MenuItem>

                            <MenuItem dense onClick={onExplorerItemDeleteClick}>
                                <ListItemIcon>									
                                    <SvgIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Insert" />
                            </MenuItem>

                            <MenuItem dense onClick={onExplorerItemDeleteClick}>
                                <ListItemIcon>									
                                    <SvgIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Insert from File..." />
                            </MenuItem>

                            <Divider orientation="horizontal" />

                            <MenuItem dense onClick={onExplorerItemDeleteClick}>
                                <ListItemIcon>									
                                    <SvgIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Save to File..." />
                            </MenuItem>

                            <MenuItem dense onClick={onExplorerItemDeleteClick}>
                                <ListItemIcon>									
                                    <SvgIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Save as Prefab..." />
                            </MenuItem>

                            <Divider orientation="horizontal" />

                            <MenuItem dense onClick={onExplorerItemDeleteClick}>
                                <ListItemIcon>									
                                    <SvgIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Help" />
                            </MenuItem>
                        </Menu>
                    </TreeView>
                </div>
            </SimpleBar>
        </div>
    );
}