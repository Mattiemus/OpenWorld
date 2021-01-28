import BaseScript from '../../engine/datamodel/elements/base-script';
import DataModel from '../../engine/datamodel/elements/datamodel';
import EditIcon from '@material-ui/icons/Edit';
import Instance from '../../engine/datamodel/elements/instance';
import InstanceExplorer from './editor/instance-explorer';
import InstancePropertyEditor from './editor/instance-property-editor';
import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { camel2title } from '../../engine/utils/text-utils';
import { getMetaData } from '../../engine/datamodel/internals/metadata/metadata';
import { isArray } from '../../engine/utils/type-guards';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'

type Props = {
    instance: Instance
};

export function InstanceEditor(props: Props) {
    const { instance } = props;

    const metadata = getMetaData(instance);

    // TODO: Create specialised editor components
    let extraButtons: JSX.Element | null = null;
    if (instance instanceof BaseScript) {
        extraButtons = (
            <Button
                style={{ float: 'right' }}
                size='small'
                variant="contained"
                color="default"
                startIcon={<EditIcon />}
            >
                Edit Script
            </Button>
        );
    }
    
    return (
        <>
            <table style={{ tableLayout: 'fixed', width: '100%' }}>
                <tbody>
                    { 
                        Array.from(metadata.properties.values()).map(property => {
                            if (property.hasAttribute('EditorHidden')) {
                                return null;
                            }

                            return (
                                <tr key={property.name}>
                                    <td style={{ width: '38%' }}>
                                        <Typography variant='body2'>{camel2title(property.name)}</Typography> 
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

export default function DataModelDebugger(props: { dataModel: DataModel }) {
    const { dataModel } = props;

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
        <DndProvider backend={HTML5Backend}>
            <div style={{ height: '100%' }}>
                <div style={{ height: '60%', overflowY: 'auto', overflowX: 'hidden' }}>
                    <InstanceExplorer
                        style={{ height: '100%', width: '100%' }}
                        instance={dataModel}
                        showEditorHiddenInstances={true}
                        multiSelect={true}
                        onInstanceSelect={onInstanceSelect}
                    />
                </div>

                <div style={{ height: '40%', overflowY: 'auto', overflowX: 'hidden' }}>
                    { selectedInstance && <InstanceEditor instance={selectedInstance} /> }
                </div>
            </div>
        </DndProvider>
    );
}