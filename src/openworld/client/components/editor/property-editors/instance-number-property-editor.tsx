import Instance from '../../../../engine/datamodel/elements/instance';
import React, { useEffect, useState } from 'react';
import { getMetaData } from '../../../../engine/datamodel/internals/metadata/metadata';
import { Input } from '@material-ui/core';

type Props = {
    instance: Instance;
    propertyName: string;
};

export function InstanceNumberPropertyEditor(props: Props) {
    const { instance, propertyName } = props;
    const unsafeInstance = instance as any;

    const metadata = getMetaData(instance);
    const propertyMetadata = metadata.properties.get(propertyName);
    if (propertyMetadata === undefined) {
        throw new Error(`Cannot created string property editor for property "${propertyName}" as it does not exist on parent instance "${instance['_refId']}"`);
    }

    const [ value, setValue ] = useState(unsafeInstance[propertyName]);
    useEffect(() => setValue(unsafeInstance[propertyName]), [ instance, propertyName ]);

    useEffect(() => {
        const propertyChangedSignal = instance.getPropertyChangedSignal(propertyName)!;
        const propertyChangedConnection = propertyChangedSignal.connect(() => {
            setValue(unsafeInstance[propertyName]);
        });

        return () => {
            propertyChangedConnection.disconnect();
        }
    }, [ instance, propertyName ]);

    useEffect(() => {
        if (!propertyMetadata.hasAttribute('ReadOnly')) {
            unsafeInstance[propertyName] = value;
        }
    }, [ value ]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <Input
            type='number'
            fullWidth
            disabled={propertyMetadata.hasAttribute('ReadOnly')}
            value={value}
            onChange={onChange}
        />
    );
}