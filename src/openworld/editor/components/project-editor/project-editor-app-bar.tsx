import ArrowExpandIcon from '../../core/components/icons/arrow-expand-icon';
import ArrowMoveIcon from '../../core/components/icons/arrow-move-icon';
import CursorIcon from '../../core/components/icons/cursor-icon';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import React from 'react';
import RedoIcon from '@material-ui/icons/Redo';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import SettingsIcon from '@material-ui/icons/Settings';
import StopIcon from '@material-ui/icons/Stop';
import UndoIcon from '@material-ui/icons/Undo';
import useObservable from '../../core/hooks/use-observable';
import {
    AppBar,
    Button,
    ButtonGroup,
    IconButton,
    makeStyles,
    Toolbar,
    Typography
    } from '@material-ui/core';
import { ProjectEditorTool, useProjectEditorContext } from '../../core/contexts/project-editor-context';

//
// Styles
//

const useStyles = makeStyles((theme) => ({
    toolbar: {
        justifyContent: 'space-between'
    },
    toolbarLeft: {
        display: 'flex',
        flex: '1',
    },
    toolbarMiddle: {
        display: 'flex',
        flex: '3',
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

export type ProjectEditorAppBarProps = {
};

export default function ProjectEditorAppBar(props: ProjectEditorAppBarProps) {
    const classes = useStyles();

    const editorContext = useProjectEditorContext();

    const selectedTool = useObservable(editorContext.selectedTool$, editorContext.selectedTool);

    const onUndoClick = () => {
        // TODO
    };

    const onRedoClick = () => {
        // TODO
    };

    const onCursorToolClick = () => {
        editorContext.selectedTool = ProjectEditorTool.Pointer;
    };

    const onMoveToolClick = () => {
        editorContext.selectedTool = ProjectEditorTool.Move;
    };

    const onScaleToolClick = () => {
        editorContext.selectedTool = ProjectEditorTool.Scale;
    };

    const onRotateToolClick = () => {
        editorContext.selectedTool = ProjectEditorTool.Rotate;
    };

    const onPlayClick = () => {
        // TODO
    };

    const onStopClick = () => {
        // TODO
    };

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
                        <Button onClick={onUndoClick}>
                            <UndoIcon />
                        </Button>
                        <Button onClick={onRedoClick}>
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
                        <Button onClick={onCursorToolClick}>
                            <CursorIcon color={selectedTool === ProjectEditorTool.Pointer ? 'inherit' : 'disabled'} />
                        </Button>
                        <Button onClick={onMoveToolClick}>
                            <ArrowMoveIcon color={selectedTool === ProjectEditorTool.Move ? 'inherit' : 'disabled'} />
                        </Button>
                        <Button onClick={onScaleToolClick}>
                            <ArrowExpandIcon color={selectedTool === ProjectEditorTool.Scale ? 'inherit' : 'disabled'} />
                        </Button>
                        <Button onClick={onRotateToolClick}>
                            <RotateRightIcon color={selectedTool === ProjectEditorTool.Rotate ? 'inherit' : 'disabled'} />
                        </Button>
                    </ButtonGroup>

                    <ButtonGroup
                        disableElevation
                        className={classes.buttonLeftMargin}
                        variant="contained"
                        color="default"
                        size="small"
                    >
                        <Button onClick={onPlayClick}>
                            <PlayArrowIcon />
                        </Button>
                        <Button onClick={onStopClick}>
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