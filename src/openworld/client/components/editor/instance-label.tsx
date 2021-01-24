import Instance from '../../../engine/datamodel/elements/instance';
import InstanceIcon from './instance-icon';
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    labelRoot: {
      display: 'flex',
      alignItems: 'center'
    },
    labelIcon: {
      marginRight: theme.spacing(0.5)
    },
    labelText: {
      fontWeight: 'inherit',
      flexGrow: 1
    },
}));

type Props = {
    instance: Instance
} & Partial<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

export default function InstanceLabel(props: Props) {
    const { instance, ...otherProps } = props;

    const classes = useStyles();

    const [ instanceName, setInstanceName ] = useState(instance.name);
    useEffect(() => setInstanceName(instance.name), [ instance ]);

    useEffect(() => {
        const instanceNameChangedSignal = instance.getPropertyChangedSignal('name')!;
        const instanceNameChangedConnection =
            instanceNameChangedSignal.connect(() => {
                setInstanceName(instance.name);
            });

        return () => {
            instanceNameChangedConnection.disconnect();
        };
    }, [ instance ]);

    return (
        <div 
            {...otherProps}
            className={classes.labelRoot}
        >
            <InstanceIcon className={classes.labelIcon} instance={instance} />
            <Typography className={classes.labelText} variant='body2'>{instanceName}</Typography>
        </div>
    );
}