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
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import WorkIcon from '@material-ui/icons/Work';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import InstanceContext from '../../../engine/datamodel/internals/instance-context';
import DataModelDebugger from '../../../client/components/data-model-debugger';
import OpenWorldCanvas from '../../../client/components/openworld-canvas';

//
// Components
//

export type ProjectEditorProps = {
    instanceContext: InstanceContext
};

export default function ProjectEditor(props: ProjectEditorProps) {
    const { instanceContext } = props;

    return (
        <>
            <AppBar position="static" color="default" elevation={3}>
                <Toolbar variant="dense">
                    <IconButton edge="start" style={{ marginRight: '16px' }} color="inherit">
                        <MenuIcon />
                    </IconButton>

                    <IconButton edge="start" style={{ marginRight: '16px' }} color="inherit">
                        <MenuIcon />
                    </IconButton>

                    <Divider orientation='vertical' style={{ marginRight: '16px' }} />

                    <IconButton edge="start" style={{ marginRight: '16px' }} color="inherit">
                        <MenuIcon />
                    </IconButton>

                    <IconButton edge="start" style={{ marginRight: '16px' }} color="inherit">
                        <MenuIcon />
                    </IconButton>

                    <IconButton edge="start" style={{ marginRight: '16px' }} color="inherit">
                        <MenuIcon />
                    </IconButton>

                    <IconButton edge="start" style={{ marginRight: '16px' }} color="inherit">
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'row' }}>
                <div style={{ width: '400px', display: 'flex', flexDirection: 'row' }}>
                    <div>
                        <List component="nav">
                            <ListItem button selected>
                                <AccountTreeIcon />
                            </ListItem>
                            <ListItem button>
                                <WorkIcon />
                            </ListItem>
                        </List>
                    </div>

                    <div style={{ flexGrow: 1 }}>
                        <DataModelDebugger dataModel={instanceContext.dataModel} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
                    <Paper square elevation={0}>
                        <Tabs value={0} indicatorColor='primary' textColor='primary' >
                            <Tab label={
                                <span>
                                    Scene
                                    <IconButton style={{ marginLeft: '8px' }} component="div" size='small'>
                                        <CloseIcon />
                                    </IconButton>
                                </span>
                            } value={0} />

                            <Tab label={
                                <span>
                                    Server Script
                                    <IconButton style={{ marginLeft: '8px' }} component="div" size='small'>
                                        <CloseIcon />
                                    </IconButton>
                                </span>
                            } value={1} />

                            <Tab label={
                                <span>
                                    Client Script
                                    <IconButton style={{ marginLeft: '8px' }} component="div" size='small'>
                                        <CloseIcon />
                                    </IconButton>
                                </span>
                            } value={2} />
                        </Tabs>
                    </Paper>

                    <div style={{ flexGrow: 1 }}>
                        <OpenWorldCanvas instanceContext={instanceContext} />
                    </div>
                </div>
            </div>  
        </>
    );
}