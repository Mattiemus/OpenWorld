import BaseScript from '../../../../engine/datamodel/elements/base-script';
import React from 'react';
import SimpleBar from 'simplebar-react';
import { useEditorTabCloseEffect } from '../../../core/contexts/project-editor-tab-context';
import { makeStyles } from '@material-ui/core';

//
// Styles
//

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flex: '1'
    }
}));

//
// Component
//

export type ScriptEditorTabProps = {
    script: BaseScript
};

export default function ScriptEditorTab(props: ScriptEditorTabProps) {
    const { script } = props;

    const classes = useStyles();

    useEditorTabCloseEffect((projectEditorContext, tab) => {
        projectEditorContext.removeTab(tab);
    });

    return (
        <SimpleBar className={classes.root}>
            <pre>{script.source}</pre>
        </SimpleBar>
    );
}