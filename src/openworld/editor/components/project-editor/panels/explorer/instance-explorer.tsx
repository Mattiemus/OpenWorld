import AssignmentIcon from '@material-ui/icons/Assignment';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CutIcon from '../../../../core/components/icons/cut-icon';
import DataDrivenMenu, { DataDrivenMenuItem } from '../../../../core/components/data-driven/data-driven-menu';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Instance from '../../../../../engine/datamodel/elements/instance';
import InstanceExplorerItem from './instance-explorer-item';
import InstanceUtils from '../../../../../engine/datamodel/utils/InstanceUtils';
import React, { useCallback, useMemo, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import SimpleBar from 'simplebar-react';
import TreeView from '@material-ui/lab/TreeView';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import useObservable from '../../../../core/hooks/use-observable';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import {
    IconButton,
    InputAdornment,
    makeStyles,
    TextField
    } from '@material-ui/core';
import { isString } from '../../../../../engine/utils/type-guards';
import { useProjectEditorContext } from '../../../../core/contexts/project-editor-context';

//
// Styles
//

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexBasis: '100%',
        flexDirection: 'column'
    },
    searchRoot: {
        display: 'flex', 
        alignItems: 'center',
        marginBottom: theme.spacing(1)
    },
    searchBar: {
        flexGrow: 1
    },
    explorerTreeRoot: {
        display: 'flex',
        flex: '1'
    },
    explorerTreeContainer: {
        display: 'flex',
        flex: '1',
        width: '100%'
    },
    explorerTree: {
        width: '100%'
    }
}));

//
// Component
//

export type InstanceExplorerProps = {
    instance: Instance;
    multiSelect?: boolean;
};

export default function InstanceExplorer(props: InstanceExplorerProps) {
    const {
        instance, 
        multiSelect
    } = props;

    const classes = useStyles();

    const editorContext = useProjectEditorContext();

    const selectedInstances = useObservable(editorContext.selectedInstaces$, editorContext.selectedInstaces);

    const [ contextMenuMouseState, setContextMenuMouseState ] =
        useState<{ mouseX: number | null, mouseY: number | null }>({ mouseX: null, mouseY: null });

    const onExplorerItemContextMenu = useCallback((event: React.MouseEvent<HTMLLIElement, MouseEvent>, instance: Instance) => {
        event.preventDefault();
        event.stopPropagation();

        if (selectedInstances.findIndex(i => i === instance) === -1) {
            editorContext.selectedInstaces = [ instance ];
        }

        setContextMenuMouseState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    }, [ selectedInstances, editorContext, setContextMenuMouseState ]);
  
    const closeExplorerItemContextMenu = useCallback(() => {
        setContextMenuMouseState({ mouseX: null, mouseY: null });
    }, [ setContextMenuMouseState ]);
  
    const onExplorerItemDuplicateClick = useCallback(() => {
        const clonedInstances: Instance[] = [];
        for (const instance of selectedInstances) {
            const clonedInstance = instance.clone();
            clonedInstance.parent = instance.parent;

            if (!clonedInstance.name.endsWith('Clone')) {
                clonedInstance.name += ' Clone';
            }

            clonedInstances.push(clonedInstance);
        }
        
        editorContext.selectedInstaces = [ ...selectedInstances, ...clonedInstances ];
        setContextMenuMouseState({ mouseX: null, mouseY: null });
    }, [ selectedInstances, editorContext, setContextMenuMouseState ]);
  
    const onExplorerItemDeleteClick = useCallback(() => {
        for (const instance of selectedInstances) {
            instance.destroy();
        }
        
        editorContext.selectedInstaces = [];
        setContextMenuMouseState({ mouseX: null, mouseY: null });
    }, [ selectedInstances, editorContext, setContextMenuMouseState ]);

    const onNodeSelect = (event: React.ChangeEvent<{}>, nodeIds: string | string[]) => {
        const context = instance['_context'];

        if (isString(nodeIds)) {
            const selectedInstance = context.findInstance(nodeIds);
            if (selectedInstance !== undefined) { 
                editorContext.selectedInstaces = [ selectedInstance ];
            } else {                
                editorContext.selectedInstaces = [];
            }
        } else {
            const selectedInstances =
                nodeIds
                    .map(i => context.findInstance(i))
                    .filter(i => i !== undefined) as Instance[];

            editorContext.selectedInstaces = selectedInstances;
        }
    };

    const [ showHiddenInstances, setShowHiddenInstances ] = useState(false);
    const [ filter, setFilter ] = useState<string | undefined>(undefined);

    const contextMenuItems = useMemo<DataDrivenMenuItem[]>(() => [
        {
            type: 'item',
            disabled: true,
            onClick: closeExplorerItemContextMenu,
            icon: <CutIcon />,
            primaryText: 'Cut',
            secondaryText: 'Ctrl+X'
        },
        {
            type: 'item',
            disabled: true,
            onClick: closeExplorerItemContextMenu,
            icon: <FileCopyIcon />,
            primaryText: 'Copy',
            secondaryText: 'Ctrl+C'
        },
        {
            type: 'item',
            disabled: true,
            onClick: closeExplorerItemContextMenu,
            icon: <AssignmentIcon />,
            primaryText: 'Paste',
            secondaryText: 'Ctrl+V'
        },
        {
            type: 'item',
            disabled: true,
            onClick: closeExplorerItemContextMenu,
            primaryText: 'Paste Into',
            secondaryText: 'Ctrl+Shift+V'
        },
        {
            type: 'item',
            onClick: onExplorerItemDuplicateClick,
            icon: <FileCopyIcon />,
            primaryText: 'Duplicate',
            secondaryText: 'Ctrl+D'
        },
        {
            type: 'item',
            onClick: onExplorerItemDeleteClick,
            icon: <DeleteIcon />,
            primaryText: 'Delete',
            secondaryText: 'Del'
        },
        {
            type: 'item',
            disabled: true,
            onClick: closeExplorerItemContextMenu,
            primaryText: 'Rename',
            secondaryText: 'F2'
        },
        { type: 'divider' },                                
        {
            type: 'item',
            disabled: true,
            onClick: closeExplorerItemContextMenu,
            primaryText: 'Insert Primitive'
        },                           
        {
            type: 'item',
            disabled: true,
            onClick: closeExplorerItemContextMenu,
            primaryText: 'Insert'
        },                           
        {
            type: 'item',
            disabled: true,
            onClick: closeExplorerItemContextMenu,
            primaryText: 'Insert from File...'
        },
        { type: 'divider' },
        {
            type: 'item',
            disabled: true,
            onClick: onExplorerItemDuplicateClick,
            primaryText: 'Save to File...'
        },  
        {
            type: 'item',
            disabled: true,
            onClick: onExplorerItemDuplicateClick,
            primaryText: 'Save as Prefab...'
        },  
        { type: 'divider' },    
        {
            type: 'item',
            disabled: true,
            onClick: onExplorerItemDuplicateClick,
            primaryText: 'Help'
        }
    ], [ closeExplorerItemContextMenu, onExplorerItemDeleteClick, onExplorerItemDuplicateClick ]);

    return (
        <div className={classes.root}>
            <div className={classes.searchRoot}>
                <div className={classes.searchBar}>
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

                <IconButton
                    size="small"
                    onClick={() => setShowHiddenInstances(!showHiddenInstances)}
                >
                    {
                        showHiddenInstances
                            ? <VisibilityOffIcon />
                            : <VisibilityIcon />
                    }
                </IconButton>

                <IconButton size="small">
                    <UnfoldLessIcon />
                </IconButton>
            </div>

            <SimpleBar className={classes.explorerTreeRoot}>
                <div className={classes.explorerTreeContainer}>
                    <TreeView
                        className={classes.explorerTree}
                        multiSelect={multiSelect as any}
                        defaultExpanded={[ InstanceUtils.getRefId(instance) ]}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        selected={selectedInstances.map(i => InstanceUtils.getRefId(i))}
                        onNodeSelect={onNodeSelect}
                    >
                        <InstanceExplorerItem
                            onContextMenu={onExplorerItemContextMenu}
                            showEditorHiddenInstances={showHiddenInstances}
                            instance={instance} />
                        
                        <DataDrivenMenu
                            keepMounted
                            open={contextMenuMouseState.mouseY !== null}
                            onClose={closeExplorerItemContextMenu}
                            anchorReference="anchorPosition"
                            anchorPosition={
                                contextMenuMouseState.mouseY !== null && contextMenuMouseState.mouseX !== null
                                    ? { top: contextMenuMouseState.mouseY, left: contextMenuMouseState.mouseX }
                                    : undefined
                            }
                            items={contextMenuItems}
                        />
                    </TreeView>
                </div>
            </SimpleBar>
        </div>
    );
}