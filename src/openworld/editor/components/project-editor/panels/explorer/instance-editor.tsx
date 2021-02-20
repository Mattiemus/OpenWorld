import BaseScript from '../../../../../engine/datamodel/elements/base-script';
import EditIcon from '@material-ui/icons/Edit';
import Instance from '../../../../../engine/datamodel/elements/instance';
import InstancePropertyEditor from '../../../../core/components/instances/instance-property-editor';
import React, { useMemo, useState } from 'react';
import ScriptEditorTab from '../../tabs/script-editor-tab';
import SearchIcon from '@material-ui/icons/Search';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import SimpleBar from 'simplebar-react';
import {
    Button,
    IconButton,
    InputAdornment,
    makeStyles,
    TextField,
    Typography
    } from '@material-ui/core';
import { camel2title } from '../../../../../engine/utils/text-utils';
import { getMetaData } from '../../../../../engine/datamodel/metadata/metadata';
import { useProjectEditorContext } from '../../../../core/contexts/project-editor-context';

//
// Styles
//

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flex: '1',
        flexDirection: 'column'
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(1)
    },
    searchTextField: {
        flexGrow: 1
    },
    propertyTable: {
        tableLayout: 'fixed',
        width: '100%'
    },
    propertyNameColumn: {
        width: '38%'
    }
}));

//
// Component
//

export type InstanceEditorProps = {
    instance: Instance;
};

export default function InstanceEditor(props: InstanceEditorProps) {
    const { instance } = props;

    const classes = useStyles();

    const editorContext = useProjectEditorContext();

    const metadata = useMemo(() => {
        return getMetaData(instance);
    }, [ instance ]);

    let extraButtons: JSX.Element | null = null;
    if (instance instanceof BaseScript) {
        extraButtons = (
            <Button
                size='small'
                variant="contained"
                color="default"
                startIcon={<EditIcon />}
                onClick={() => {
                    for (const tab of editorContext.activeTabs) {
                        if (tab.data === instance) {
                            editorContext.selectedTabId = tab.id;
                            return;
                        }
                    }

                    editorContext.addTabAndSelect({
                        title: instance.name,
                        isClosable: true,
                        component: <ScriptEditorTab script={instance} />,
                        data: instance
                    });                    
                }}
            >
                Edit
            </Button>
        );
    }

    const [ showHiddenFields, setShowHiddenFields ] = useState(false);
    const [ filter, setFilter ] = useState<string | undefined>(undefined);
    
    return (
        <div className={classes.root}>
            <div className={classes.searchContainer}>
                <div className={classes.searchTextField}>
                    <TextField
                        fullWidth
                        placeholder="Filter Properties"
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
                    onClick={() => setShowHiddenFields(!showHiddenFields)}
                >
                    {
                        showHiddenFields
                            ? <VisibilityOffIcon />
                            : <VisibilityIcon />
                    }
                </IconButton>
            </div>

            <SimpleBar>
                <table className={classes.propertyTable}>
                    <tbody>
                        { 
                            Array.from(metadata.properties.values()).map(property => {
                                if (filter !== undefined && !property.name.includes(filter)) {
                                    return null;
                                }

                                if (!showHiddenFields && property.hasAttribute('EditorHidden')) {
                                    return null;
                                }

                                return (
                                    <tr key={property.name}>
                                        <td className={classes.propertyNameColumn}>
                                            <Typography variant='body2'>
                                                {camel2title(property.name)}
                                            </Typography> 
                                        </td>
                                        <td>
                                            <InstancePropertyEditor 
                                                instance={instance}
                                                propertyName={property.name}
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                { extraButtons }
            </SimpleBar>
        </div>
    );
}