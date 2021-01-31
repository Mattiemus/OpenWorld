import PanelHeader from '../../../core/components/panels/panel-header';
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: '1',
        flexDirection: 'column'
    }
}));

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