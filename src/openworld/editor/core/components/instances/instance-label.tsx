import Instance from '../../../../engine/datamodel/elements/instance';
import InstanceIcon from './instance-icon';
import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { getMetaData } from '../../../../engine/datamodel/internals/metadata/metadata';

const useStyles = makeStyles((theme) => ({
    labelRoot: {
      display: 'flex',
      alignItems: 'center'
    },
    hiddenLabelRoot: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.text.secondary
    },
    labelIcon: {
      marginRight: theme.spacing(0.5)
    },
    labelText: {
      fontWeight: 'inherit',
      flexGrow: 1
    }
}));

export type InstanceLabelProps = {
    style?: React.CSSProperties;
    instance: Instance | null;
};

const InstanceLabel = forwardRef<HTMLDivElement, InstanceLabelProps>((props, ref) => {
    const { style, instance } = props;

    const classes = useStyles();

    const isEditorHidden = useMemo(() => {
        if (instance !== null) {
            const metadata = getMetaData(instance);
            return metadata.hasAttribute('EditorHidden');
        }

        return false;
    }, [ instance ]);

    const [ instanceName, setInstanceName ] = useState(instance === null ? null : instance.name);
    useEffect(() => setInstanceName(instance === null ? null : instance.name), [ instance ]);

    useEffect(() => {
        if (instance != null) {
            const instanceNameChangedSignal = instance.getPropertyChangedSignal('name')!;
            const instanceNameChangedConnection =
                instanceNameChangedSignal.connect(() => {
                    setInstanceName(instance.name);
                });

            return () => {
                instanceNameChangedConnection.disconnect();
            };
        }
    }, [ instance ]);   

    if (instance === null) {
        return (
            <div 
                ref={ref}
                style={style}
                className={classes.labelRoot}
            >    
                <Typography 
                    className={classes.labelText}
                    variant='body2'                
                >
                    null
                </Typography>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            style={style}
            className={isEditorHidden ? classes.hiddenLabelRoot : classes.labelRoot}
        >
            <InstanceIcon
                className={classes.labelIcon}
                instance={instance}
            />

            <Typography 
                className={classes.labelText}
                variant='body2'                
            >
                {instanceName}
            </Typography>
        </div>
    );
});
export default InstanceLabel;