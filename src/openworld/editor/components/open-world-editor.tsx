import EditorAppBar from './editor-app-bar';
import EditorBody from './editor-body';
import EditorServiceContainer from '../core/services/editor-service-container';
import InstanceContext from '../../engine/datamodel/internals/instance-context';
import React, { useMemo } from 'react';
import { EditorContextProvider } from '../core/contexts/editor-context';
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

export type OpenWorldEditorProps = {
    instanceContext: InstanceContext
};

export default function OpenWorldEditor(props: OpenWorldEditorProps) {
    const { instanceContext } = props;

    const classes = useStyles();

    const editorServices = useMemo(() => new EditorServiceContainer(), []);

    return (
        <EditorContextProvider value={editorServices}>
            <div className={classes.root}>
                <EditorAppBar />
                <EditorBody instanceContext={instanceContext} />
            </div>
        </EditorContextProvider>
    );
}