import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    makeStyles,
    ButtonGroup,
    Button
} from '@material-ui/core';

//
// Styles
//

const useStyles = makeStyles((theme) => ({
    toolbar: {
        justifyContent: 'space-between'
    },
    toolbarLeft: {
        display: 'flex',
        flex: '1'
    },
    toolbarMiddle: {
        display: 'flex',
        flex: '1',
        justifyContent: 'center'
    },
    toolbarRight: {
        display: 'flex',
        flex: '1',
        justifyContent: 'flex-end'
    },
    buttonLeftMargin: {
        marginLeft: theme.spacing(2)
    },
    buttonRightMargin: {
        marginRight: theme.spacing(2)
    }
}));

//
// Component
//

export type EditorAppBarProps = {
};

export default function EditorAppBar(props: EditorAppBarProps) {
    const classes = useStyles();

    return (
        <AppBar position="static" color="primary" elevation={3}>
            <Toolbar variant="dense" className={classes.toolbar}>
                <div className={classes.toolbarLeft}>
                    <IconButton
                        className={classes.buttonRightMargin}
                        edge="start"
                        color="inherit"
                        size="small"
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6">
                        OpenWorld Editor
                    </Typography>
                </div>

                <div className={classes.toolbarMiddle}>
                    <ButtonGroup
                        disableElevation
                        variant="contained"
                        color="default"
                        size="small"
                    >
                        <Button>
                            <UndoIcon />
                        </Button>

                        <Button>
                            <RedoIcon />
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup
                        disableElevation
                        className={classes.buttonLeftMargin}
                        variant="contained"
                        color="default"
                        size="small"
                    >
                        <Button>
                            <PlayArrowIcon />
                        </Button>

                        <Button>
                            <StopIcon />
                        </Button>
                    </ButtonGroup>
                </div>

                <div className={classes.toolbarRight}>
                    <IconButton color="inherit" size="small">
                        <SettingsIcon />
                    </IconButton>

                    <IconButton
                        className={classes.buttonLeftMargin}
                        edge="end"
                        color="inherit"
                        size="small"
                    >
                        <PersonIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
}