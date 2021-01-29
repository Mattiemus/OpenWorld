import Color3 from '../../../engine/math/color3';
import Content from '../../../engine/datamodel/data-types/content';
import DataModelPropertyMetaData from '../../../engine/datamodel/internals/metadata/properties/data-model-property-metadata';
import Instance from '../../../engine/datamodel/elements/instance';
import InstanceLabel from './instance-label';
import InstanceUtils from '../../../engine/datamodel/utils/InstanceUtils';
import MathEx from '../../../engine/math/mathex';
import PropertyType from '../../../engine/datamodel/internals/metadata/properties/property-type';
import Quaternion from '../../../engine/math/quaternion';
import ClearIcon from '@material-ui/icons/Clear';
import React, {
    useEffect,
    useMemo,
    useState
    } from 'react';
import useThrottle from '../../../editor/core/hooks/use-throttle';
import Vector3 from '../../../engine/math/vector3';
import Vector3Input from '../../../editor/core/components/inputs/vector3-input';
import { getMetaData } from '../../../engine/datamodel/internals/metadata/metadata';
import {
    Button,
    Input,
    MenuItem,
    Select,
    Switch,
    TextField,
    IconButton,
    makeStyles,
    } from '@material-ui/core';

export type PropertyEditorProps = {
    instance: Instance;
    propertyName: string;
};

type PropertyEditorRenderProps<T> = {
    instance: Instance;
    propertyName: string;
    propertyMetadata: DataModelPropertyMetaData;
    value: T;
    setValue: (newValue: T) => void;
    throttledValue: T;
    hasFocus: boolean,
    setHasFocus: React.Dispatch<React.SetStateAction<boolean>>
};

function createInstancePropertyEditor<T>(render: (renderProps: PropertyEditorRenderProps<T>) => JSX.Element | null) {
    return (props: PropertyEditorProps) => {
        const { instance, propertyName } = props;

        const propertyMetadata = useMemo(() => {
            const metadata = getMetaData(instance);
            const propMetadata = metadata.properties.get(propertyName);
            if (propMetadata === undefined) {
                const instanceRefId = InstanceUtils.getRefId(instance);
                throw new Error(`Cannot create property editor for property "${propertyName}" as it does not exist on parent instance "${instanceRefId}"`);
            }
            return propMetadata;
        }, [ instance, propertyName ]);
    
        const [ value, _setValue ] = useState<T>(InstanceUtils.unsafeGetProperty(instance, propertyName));    
        const throttledValue = useThrottle(value, 150);
    
        useEffect(() => {
            _setValue(InstanceUtils.unsafeGetProperty(instance, propertyName));

            const propertyChangedSignal = instance.getPropertyChangedSignal(propertyName)!;
            const propertyChangedConnection = propertyChangedSignal.connect(() => {
                _setValue(InstanceUtils.unsafeGetProperty(instance, propertyName));
            });
    
            return () => {
                propertyChangedConnection.disconnect();
            }
        }, [ instance, propertyName ]);
        
        const [ hasFocus, setHasFocus ] = useState(false);
    
        const setValue = (newValue: T) => {
            if (!propertyMetadata.hasAttribute('ReadOnly')) {
                InstanceUtils.unsafeSetProperty(instance, propertyName, newValue);
            }
        };

        return render({
            instance,
            propertyName,
            propertyMetadata,
            value,
            setValue,
            throttledValue,
            hasFocus,
            setHasFocus
        });
    };
}

//
// Number Editor
//

export const InstanceNumberPropertyEditor =
    createInstancePropertyEditor<number>((renderProps) => {
        const {
            propertyMetadata,
            value,
            setValue,
            throttledValue,
            hasFocus,
            setHasFocus
        } = renderProps;

        return (
            <Input
                type='number'
                fullWidth
                disabled={propertyMetadata.hasAttribute('ReadOnly')}
                value={hasFocus ? value : throttledValue}
                onChange={(e) => {
                    const newValue = Number.parseFloat(e.target.value);
                    if (!Number.isNaN(newValue)) {
                        setValue(newValue);
                    }
                }}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
            />
        );
    });

//
// Boolean Editor
//

export const InstanceBooleanPropertyEditor =
    createInstancePropertyEditor<boolean>((renderProps) => {
        const {
            propertyMetadata,
            value,
            setValue,
            throttledValue,
            hasFocus,
            setHasFocus
        } = renderProps;

        return (
            <Switch
                size='small'
                color='primary'
                disabled={propertyMetadata.hasAttribute('ReadOnly')}
                checked={hasFocus ? value : throttledValue}
                onChange={(e) => setValue(e.target.checked)}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
            />
        );
    });

//
// String Editor
//

export const InstanceStringPropertyEditor =
    createInstancePropertyEditor<string>((renderProps) => {
        const {
            propertyMetadata,
            value,
            setValue,
            throttledValue,
            hasFocus,
            setHasFocus
        } = renderProps;

        return (
            <TextField
                fullWidth
                disabled={propertyMetadata.hasAttribute('ReadOnly')}
                value={hasFocus ? value : throttledValue}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
            />
        );
    });

//
// Color3 Editor
//

export const InstanceColor3PropertyEditor =
    createInstancePropertyEditor<Color3>((renderProps) => {
        const {
            propertyMetadata,
            value,
            setValue,
            throttledValue,
            hasFocus,
            setHasFocus
        } = renderProps;

        return (
            <Input
                type='color'
                fullWidth
                disabled={propertyMetadata.hasAttribute('ReadOnly')}
                value={hasFocus ? value.toHex() : throttledValue.toHex()}
                onChange={(e) => {
                    const newColor = Color3.fromHex(e.target.value);
                    if (newColor !== undefined) {
                        setValue(newColor);
                    }
                }}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
            />
        );
    });

//
// Vector3 Editor
//

export const InstanceVector3PropertyEditor =
    createInstancePropertyEditor<Vector3>((renderProps) => {
        const {
            propertyMetadata,
            value,
            setValue,
            throttledValue,
            hasFocus,
            setHasFocus
        } = renderProps;

        // TODO: Add focus handling!

        return (
            <Vector3Input
                disabled={propertyMetadata.hasAttribute('ReadOnly')}
                value={throttledValue}
                onChange={setValue}
            />
        );
    });

//
// Quaternion Editor
//

export const InstanceQuaternionPropertyEditor =
    createInstancePropertyEditor<Quaternion>((renderProps) => {
        const {
            propertyMetadata,
            value,
            setValue,
            throttledValue,
            hasFocus,
            setHasFocus
        } = renderProps;

        // TODO: Add focus handling!

        return (
            <Vector3Input
                disabled={propertyMetadata.hasAttribute('ReadOnly')}
                value={Vector3.multiplyScalar(throttledValue.toEulerAngles(), MathEx.rad2deg)}
                onChange={v => {
                    const newValue = Quaternion.fromEulerAngles(
                        v.x * MathEx.deg2rad,
                        v.y * MathEx.deg2rad,
                        v.z * MathEx.deg2rad
                    );
                    setValue(newValue);
                }}
            />
        );
    });

//
// Content Editor
//

export const InstanceContentPropertyEditor =
    createInstancePropertyEditor<Content>((renderProps) => {
        const {
            propertyMetadata,
            value,
            setValue,
            throttledValue,
            hasFocus,
            setHasFocus
        } = renderProps;

        return (
            <TextField
                fullWidth
                disabled={propertyMetadata.hasAttribute('ReadOnly')}
                value={hasFocus ? value.toString() : throttledValue.toString()}
                onChange={(e) => {
                    const newValue = new Content(e.target.value);
                    setValue(newValue);
                }}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
            />
        );
    });

//
// Enum Editor
//

export const InstanceEnumPropertyEditor =
    createInstancePropertyEditor<string>((renderProps) => {
        const {
            propertyMetadata,
            value,
            setValue,
            throttledValue,
            hasFocus,
            setHasFocus
        } = renderProps;

        return (
            <Select
                fullWidth
                disabled={propertyMetadata.hasAttribute('ReadOnly')}
                value={hasFocus ? value : throttledValue}
                onChange={(e) => setValue(e.target.value as string)}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
            >
                {
                    Object.entries(propertyMetadata.type.enumValue!).map(([ enumKey, enumValue ]) => {
                        return (
                            <MenuItem key={enumKey} value={enumKey}>
                                {enumValue}
                            </MenuItem>
                        );
                    })                    
                }
            </Select>
        );
    });

//
// InstanceRef Editor
//

const useInstanceRefPropertyEditorStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    instanceEditor: {
        flexGrow: 1,
        marginRight: theme.spacing(1)
    }
}));

export const InstanceInstanceRefPropertyEditor =
    createInstancePropertyEditor<Instance | null>((renderProps) => {
        const {
            instance,
            propertyMetadata,
            value,
            setValue,
            throttledValue,
            hasFocus,
            setHasFocus
        } = renderProps;

        const classes = useInstanceRefPropertyEditorStyles();

        const onDeleteButtonClick = () => {
            if (propertyMetadata.name === 'parent') {
                instance.destroy();
                return;
            }

            setValue(null);
        };

        return (
            <div className={classes.root}>
                <div className={classes.instanceEditor}>
                    <InstanceLabel instance={value} />
                </div>
        
                <IconButton size="small" onClick={onDeleteButtonClick}>
                    <ClearIcon />
                </IconButton>
            </div>
        );
    });    

//
// General Property Editor
//

export type InstancePropertyEditorProps = {
    instance: Instance;
    propertyName: string;
};

export default function InstancePropertyEditor(props: InstancePropertyEditorProps) {
    const { instance, propertyName } = props;

    const propertyMetadata = useMemo(() => {
        const metadata = getMetaData(instance);
        const propMetadata = metadata.properties.get(propertyName);
        if (propMetadata === undefined) {
            const instanceRefId = InstanceUtils.getRefId(instance);
            throw new Error(`Cannot create property editor for property "${propertyName}" as it does not exist on parent instance "${instanceRefId}"`);
        }
        return propMetadata;
    }, [ instance, propertyName ]);
    
    if (propertyMetadata.type === PropertyType.number) {
        return (
            <InstanceNumberPropertyEditor
                instance={instance}
                propertyName={propertyName}
            />
        );
    }

    if (propertyMetadata.type === PropertyType.boolean) {
        return (
            <InstanceBooleanPropertyEditor
                instance={instance}
                propertyName={propertyName}
            />
        );
    }

    if (propertyMetadata.type === PropertyType.string) {
        return (
            <InstanceStringPropertyEditor
                instance={instance}
                propertyName={propertyName}
            />
        );
    }

    if (propertyMetadata.type === PropertyType.color3) {
        return (
            <InstanceColor3PropertyEditor
                instance={instance}
                propertyName={propertyName}
            />
        );
    }

    if (propertyMetadata.type === PropertyType.vector3) {
        return (
            <InstanceVector3PropertyEditor
                instance={instance}
                propertyName={propertyName}
            />
        );
    }

    if (propertyMetadata.type === PropertyType.quaternion) {
        return (
            <InstanceQuaternionPropertyEditor 
                instance={instance}
                propertyName={propertyName}
            />
        );
    }

    if (propertyMetadata.type === PropertyType.content) {
        return (
            <InstanceContentPropertyEditor
                instance={instance}
                propertyName={propertyName}
            />
        );
    }

    // TODO
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
            <InstanceEnumPropertyEditor
                instance={instance}
                propertyName={propertyName}
            />     
        );
    }

    if (propertyMetadata.type.isInstanceRef) {
        return (
            <InstanceInstanceRefPropertyEditor             
                instance={instance}
                propertyName={propertyName}
            />            
        );
    }

    return null;
}