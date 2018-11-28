import * as React from 'react';

import { Grid, IconButton, Menu } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IAppState } from '../../../rootReducer';
import { graphSettingsSelector } from '../../BlmChart/selectors';
import { graphSettingsAction } from '../../BlmGenerator/actions';
import { IGraphSettingsEntity } from '../../BlmGenerator/model';
import { IMenuOptionsEntity } from '../model';
import { SettingsItem } from './SettingsItem';

interface ISettingsMenuProps {
    setSettings: (set: IGraphSettingsEntity) => ThunkAction<void, IAppState, never, AnyAction>;
    settings: IGraphSettingsEntity;
    menuSettings: IMenuOptionsEntity[];
}

interface ISettingsMenuState {
    anchorEl: any;
}

class SettingsMenuComponent extends React.Component<ISettingsMenuProps, ISettingsMenuState> {
    constructor(props: ISettingsMenuProps) {
        super(props);
        this.state = {
            anchorEl: undefined,
        };
    }

    public render() {
        const { menuSettings, settings } = this.props;
        const { anchorEl } = this.state;
        return(
            <Grid>
                <IconButton
                    onClick={(event: any) => this.setState({ anchorEl: event.currentTarget })}
                >
                    <Settings color="primary"/>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => this.setState({ anchorEl: undefined })}
                >
                    {
                        menuSettings.map((o: IMenuOptionsEntity, i: number) => {
                            return (
                            <SettingsItem
                                name={o.name}
                                option={o.option}
                                settings={settings}
                                updateSettings={(option: any) => this.updateSettings(option)}
                                key={i}
                            />
                        ); })
                    }
                </Menu>
            </Grid>
        );
    }

    private updateSettings(set: keyof IGraphSettingsEntity) {
        const settings = {...this.props.settings};
        settings[set] = !settings[set];
        this.props.setSettings(settings);
    }
}

export const SettingsMenu = connect(
    (state: IAppState) => ({
        settings: graphSettingsSelector(state),
    }),
    {
        setSettings: graphSettingsAction,
    },
)(SettingsMenuComponent);
