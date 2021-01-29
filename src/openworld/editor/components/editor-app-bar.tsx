import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    makeStyles
} from '@material-ui/core';
import { useEditorContext } from '../core/contexts/editor-context';
import useObservable from '../core/hooks/use-observable';

//
// Styles
//

const useStyles = makeStyles((theme) => ({
    leftSideButton: {
        marginRight: theme.spacing(2)
    },
    rightSideButton: {
        marginLeft: theme.spacing(2)
    },
    titleText: {
        flexGrow: 1
    }
}));

//
// Component
//

export type EditorAppBarProps = {
};

export default function EditorAppBar(props: EditorAppBarProps) {
    const classes = useStyles();

    const { accountDataService } = useEditorContext();
    const currentAccount = useObservable(accountDataService.getCurrentAccount$());

    return (
        <AppBar position="static" color="primary" elevation={3}>
            <Toolbar variant="dense">
                <IconButton className={classes.leftSideButton} edge="start" color="inherit">
                    <MenuIcon />
                </IconButton>

                <Typography className={classes.titleText} variant="h6">
                    OpenWorld Editor
                </Typography>

                <IconButton className={classes.rightSideButton} edge="end" color="inherit">
                    <SettingsIcon />
                </IconButton>

                <IconButton className={classes.rightSideButton} edge="end" color="inherit">
                    <PersonIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}