import React from 'react';
import {
    Divider,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    MenuProps,
    SvgIcon,
    TypographyProps
    } from '@material-ui/core';

//
// Styles
//

const useStyles = makeStyles(() => ({
    menuItem: {
        minWidth: '300px'
    }
}));

//
// Component
//

export type DataDrivenMenuItem = DataDrivenItemMenuItem | DataDrivenDividerMenuItem;

export type DataDrivenItemMenuItem = {
    type: 'item'
    icon?: JSX.Element;
    primaryText?: string;
    secondaryText?: string;
    disabled?: boolean;
    onClick?: () => void;
};

export type DataDrivenDividerMenuItem = {
    type: 'divider'
};

export type DataDrivenMenuProps = {
    items: DataDrivenMenuItem[]
} & MenuProps;

export default function DataDrivenMenu(props: DataDrivenMenuProps) {
    const { items, ...menuProps } = props;

    const classes = useStyles();

    const secondaryTextTypographyProps: TypographyProps = {
        color: 'textSecondary'
    }

    return (
        <Menu
            {...menuProps}
        >
            {
                items.map((item, index) => {
                    if (item.type === 'divider') {
                        return (<Divider key={index} orientation="horizontal" />);
                    }

                    return (
                        <MenuItem
                            key={index}
                            dense
                            className={classes.menuItem}
                            disabled={item.disabled}
                            onClick={item.onClick}           
                        >
                            <ListItemIcon>	
                                {
                                    item.icon !== undefined
                                        ? React.cloneElement(item.icon, { fontSize: 'small' })
                                        : <SvgIcon fontSize='small' />
                                }
                            </ListItemIcon>

                            {
                                item.primaryText &&
                                <ListItemText primary={item.primaryText} />
                            }

                            {
                                item.secondaryText &&
                                <ListItemSecondaryAction>                                
                                    <ListItemText
                                        primary={item.secondaryText}
                                        primaryTypographyProps={secondaryTextTypographyProps}
                                    />
                                </ListItemSecondaryAction>
                            }
                        </MenuItem>
                    );
                })
            }
        </Menu>
    );
}