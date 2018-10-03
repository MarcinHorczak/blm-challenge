import * as React from 'react';

import { AppBar, Button, Drawer, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { BorderColor, Folder, School, Settings } from '@material-ui/icons';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { T } from '../../FormattedText';
import { languageAction } from '../actions';
import { NavBarItem } from './NavBarItem';

interface INavigationBarProps {
    language: (lang: string) => AnyAction;
}

interface INavigationBarState {
    isDrawerOpened: boolean;
}

class NavigationBarContent extends React.Component<INavigationBarProps, INavigationBarState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isDrawerOpened: false,
        };
    }

    public render() {
        const { isDrawerOpened } = this.state;
        return (
            <AppBar position="static" color="primary" className="nav-bar">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Menu"
                        style={{marginLeft: -12, marginRight: 20}}
                        onClick={() => this.setState({ isDrawerOpened: true })}
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant="title" color="inherit" style={{flex: 1}}>
                        <T value="title"/>
                    </Typography>
                    <Button color="inherit" onClick={() => this.setLanguage('pl')}>pl</Button>
                    <Button color="inherit" onClick={() => this.setLanguage('en')}>en</Button>
                </Toolbar>
                <Drawer
                    open={isDrawerOpened}
                    onClose={this.toggleDrawer}
                    color="primary"
                    className="nav-bar-drawer"
                >
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer}
                        onKeyDown={this.toggleDrawer}
                    >
                        <NavBarItem link="" name="menu" disabled/>
                        <NavBarItem link="/examples" name="blmExamplesGenerator">
                            <Folder color="secondary"/>
                        </NavBarItem>
                        <NavBarItem link="/practice" name="practiceSection">
                            <BorderColor color="secondary"/>
                        </NavBarItem>
                        <NavBarItem link="/learn" name="learn">
                            <School color="secondary"/>
                        </NavBarItem>
                        <NavBarItem link="/settings" name="settings">
                            <Settings color="secondary"/>
                        </NavBarItem>
                    </div>
                </Drawer>
            </AppBar>
        );
    }

    private setLanguage(lang: string) {
        localStorage.setItem('lang', lang);
        this.props.language(lang);
    }

    private toggleDrawer = () => {
        this.setState({ isDrawerOpened: false });
    }
}

export const NavigationBar = connect(
    null,
    {language: (lang: string): any => languageAction( lang )},
)(NavigationBarContent);
