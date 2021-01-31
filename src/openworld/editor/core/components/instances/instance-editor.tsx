import BaseScript from '../../../../engine/datamodel/elements/base-script';
import EditIcon from '@material-ui/icons/Edit';
import Instance from '../../../../engine/datamodel/elements/instance';
import InstancePropertyEditor from './instance-property-editor';
import React, { useMemo } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { camel2title } from '../../../../engine/utils/text-utils';
import { getMetaData } from '../../../../engine/datamodel/internals/metadata/metadata';
import { useProjectEditorContext } from '../../contexts/project-editor-context';
import SimpleBar from 'simplebar-react';

const useStyles = makeStyles(() => ({
    propertyTable: {
        tableLayout: 'fixed',
        width: '100%'
    },
    propertyNameColumn: {
        width: '38%'
    },
    rightButton: {
        float: 'right'
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
                className={classes.rightButton}
                size='small'
                variant="contained"
                color="default"
                startIcon={<EditIcon />}
                onClick={() => {
                    editorContext.addTabAndSelect({
                        tabId: Math.random().toString(),
                        isClosable: true,
                        title: instance.name,
                        onClose: () => {},
                        component: <SimpleBar style={{ display: 'flex', flex: '1' }}><pre>{instance.source}</pre></SimpleBar>
                    });                    
                }}
            >
                Edit Script
            </Button>
        );
    }
    
    return (
        <>
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
        </>
    );
}