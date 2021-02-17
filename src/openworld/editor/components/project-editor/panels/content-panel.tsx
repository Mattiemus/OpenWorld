import PanelHeader from './shared/panel-header';
import React from 'react';
import { makeStyles } from '@material-ui/core';

//
// Styles
//

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flex: '1',
        flexDirection: 'column'
    }
}));

//
// Component
//

export type ContentPanelProps = {
};

export default function ContentPanel(props: ContentPanelProps) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <PanelHeader>
                Content
            </PanelHeader>
        </div>
    );
}