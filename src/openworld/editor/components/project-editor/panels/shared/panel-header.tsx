import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

//
// Styles
//

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: 'none',
        height: theme.spacing(6),
        alignItems: 'center'
    },
    typography: {
        paddingLeft: theme.spacing(2)
    }
}));

//
// Component
//

export type PanelHeaderProps = {
};

export default function PanelHeader(props: React.PropsWithChildren<PanelHeaderProps>) {
    const { children } = props;

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography
                className={classes.typography}
                variant="button"
            >
                {children}
            </Typography>
        </div>
    );
}