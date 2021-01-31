import EditorAppBar from './editor-app-bar';
import EditorBody from './editor-body';
import React from 'react';
import { makeStyles } from '@material-ui/core';

//
// Styles
//

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexBasis: '100%',
        flexDirection: 'column'
    }
}));

//
// Component
//

export type EditorAppProps = {
};

export default function EditorApp(props: EditorAppProps) {
    const classes = useStyles();

    return (
        <div className={classes.root} onContextMenu={(e)=> e.preventDefault()}>
            <EditorAppBar />
            <EditorBody />
        </div>
    );
}