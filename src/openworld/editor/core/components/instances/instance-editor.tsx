import BaseScript from '../../../../engine/datamodel/elements/base-script';
import EditIcon from '@material-ui/icons/Edit';
import Instance from '../../../../engine/datamodel/elements/instance';
import InstancePropertyEditor from './instance-property-editor';
import React, { useMemo } from 'react';
import ScriptEditorTab from '../../../components/project-editor/tabs/script-editor-tab';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { camel2title } from '../../../../engine/utils/text-utils';
import { getMetaData } from '../../../../engine/datamodel/internals/metadata/metadata';
import { useProjectEditorContext } from '../../contexts/project-editor-context';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flex: '1',
        flexDirection: 'column'
    },
    propertyTable: {
        tableLayout: 'fixed',
        width: '100%'
    },
    propertyNameColumn: {
        width: '38%'
    }
}));

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
    
    return (
        <div className={classes.root}>
            <table className={classes.propertyTable}>
                <tbody>
                    { 
                        Array.from(metadata.properties.values()).map(property => {
                            if (property.hasAttribute('EditorHidden')) {
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
        </div>
    );
}