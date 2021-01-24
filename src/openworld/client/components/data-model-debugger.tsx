import BaseScript from '../../engine/datamodel/elements/base-script';
import Color3 from '../../engine/math/color3';
import Content from '../../engine/datamodel/data-types/content';
import DataModel from '../../engine/datamodel/elements/datamodel';
import EditIcon from '@material-ui/icons/Edit';
import Instance from '../../engine/datamodel/elements/instance';
import InstanceExplorer from './editor/instance-explorer';
import InstanceLabel from './editor/instance-label';
import PropertyType from '../../engine/datamodel/internals/metadata/properties/property-type';
import React, { useState } from 'react';
import Vector3 from '../../engine/math/vector3';
import {
    Button,
    MenuItem,
    Select,
    Typography
    } from '@material-ui/core';
import { camel2title } from '../../engine/utils/text-utils';
import { getMetaData } from '../../engine/datamodel/internals/metadata/metadata';
import { InstanceBooleanPropertyEditor } from './editor/property-editors/instance-boolean-property-editor';
import { InstanceNumberPropertyEditor } from './editor/property-editors/instance-number-property-editor';
import { InstanceStringPropertyEditor } from './editor/property-editors/instance-string-property-editor';
import { isArray } from '../../engine/utils/type-guards';
import { Vector3InputField } from './editor/custom-form-inputs/vector3-input-field';

type Props = {
    instance: Instance
};

function createEditorForProperty(instance: Instance, propertyName: string) {
    const unsafeInstance = instance as any;

    const metadata = getMetaData(instance);
    const propertyMetadata = metadata.properties.get(propertyName);
    if (propertyMetadata === undefined) {
        throw new Error(`Cannot created string property editor for property "${propertyName}" as it does not exist on parent instance "${instance['_refId']}"`);
    }

    if (propertyMetadata.type === PropertyType.number) {
        return <InstanceNumberPropertyEditor instance={instance} propertyName={propertyName} />
    }

    if (propertyMetadata.type === PropertyType.boolean) {
        return <InstanceBooleanPropertyEditor instance={instance} propertyName={propertyName} />
    }

    if (propertyMetadata.type === PropertyType.string) {
        return <InstanceStringPropertyEditor instance={instance} propertyName={propertyName} />
    }

    if (propertyMetadata.type === PropertyType.color3) {
        return (
            <Button
                size="small"
                variant="outlined"
                fullWidth
                style={{ 
                    textTransform: 'none',
                    height: '32px',
                    background: '#' + (unsafeInstance[propertyName] as Color3).toHex()
                }}
            />
        );
    }

    if (propertyMetadata.type === PropertyType.vector3) {
        return (
            <Vector3InputField 
                value={(unsafeInstance[propertyName] as Vector3)}
            />
        );
    }

    if (propertyMetadata.type === PropertyType.quaternion) {
        return (
            <Vector3InputField 
                value={new Vector3(1, 2, 3)}
            />
        );
    }

    if (propertyMetadata.type === PropertyType.content) {
        return (
            <Button
                size="small"
                variant="outlined"
                fullWidth
                style={{ textTransform: 'none' }}
            >
                { (unsafeInstance[propertyName] as Content).toString() }
            </Button>
        );
    }

    if (propertyMetadata.type === PropertyType.material) {
        return (
            <Button
                size="small"
                variant="outlined"
                fullWidth
                style={{ textTransform: 'none' }}
            >
                Material
            </Button>
        );
    }

    if (propertyMetadata.type.isEnum) {
        return (
            <Select
                fullWidth
                value={1}
            >
                <MenuItem value={1}>Enum Value A</MenuItem>
                <MenuItem value={2}>Enum Value B</MenuItem>
                <MenuItem value={3}>Enum Value C</MenuItem>
            </Select>
        );
    }

    if (propertyMetadata.type.isInstanceRef) {
        return (
            <Button
                size="small"
                variant="outlined"
                fullWidth
                style={{ textTransform: 'none' }}
            >
                <InstanceLabel instance={unsafeInstance[propertyName]} />
            </Button>
        );
    }

    return <span>no editor</span>;
}

export function InstanceEditor(props: Props) {
    const { instance } = props;

    const metadata = getMetaData(instance);

    let extraButtons: JSX.Element | null = null;
    if (instance instanceof BaseScript) {
        extraButtons = (
            <Button
                style={{ float: 'right' }}
                size='small'
                variant="contained"
                color="primary"
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
                                <tr key={`${instance['_refId']}_${property.name}`}>
                                    <td style={{ width: '38%' }}>
                                        <Typography variant='body2'>{camel2title(property.name)}</Typography> 
                                    </td>
                                    <td>
                                        { createEditorForProperty(instance, property.name) }
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

    let selectedInstanceComponent: JSX.Element | null = null;
    if (selectedInstance !== null) {
        selectedInstanceComponent = 
            <InstanceEditor
                //style={{ height: '100%', width: '100%' }}
                instance={selectedInstance}
            />;
    }

    return (
        <div style={{ position: 'absolute', top: '32px', left: '32px', width: '400px', height: '800px', background: 'white' }}>
            <div style={{ height: '60%', overflowY: 'auto', overflowX: 'hidden' }}>
                <InstanceExplorer
                    style={{ height: '100%', width: '100%' }}
                    instance={dataModel}
                    multiSelect={true}
                    onInstanceSelect={onInstanceSelect}
                />
            </div>

            <div style={{ height: '40%', overflowY: 'auto', overflowX: 'hidden' }}>
                { selectedInstanceComponent }
            </div>
        </div>
    );
}