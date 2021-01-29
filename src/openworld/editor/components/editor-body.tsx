import DataModelDebugger from '../../client/components/data-model-debugger';
import OpenWorldCanvas from '../../client/components/openworld-canvas';
import React from 'react';
import {
    AppBar,
    Divider,
    IconButton,
    List,
    ListItem,
    Paper,
    Tab,
    Tabs,
    Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import InstanceContext from '../../engine/datamodel/internals/instance-context';
import ProjectEditor from './project-editor/project-editor';

//
// Components
//

export type EditorBodyProps = {
    instanceContext: InstanceContext
};

export default function EditorBody(props: EditorBodyProps) {
    const { instanceContext } = props;

    return (
        <ProjectEditor instanceContext={instanceContext} />
    );
}