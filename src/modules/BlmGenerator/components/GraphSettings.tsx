import * as React from 'react';

import { Grid, IconButton, Menu } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IAppState } from '../../../rootReducer';
import { graphSettingsSelector } from '../../BlmChart/selectors';
import { graphSettingsAction } from '../actions';
import { IGraphSettingsEntity } from '../model';
import { GraphSettingsItem } from './GraphSettingsItem';

interface IGraphSettingsProps {
    setSettings: (set: IGraphSettingsEntity) => ThunkAction<void, IAppState, never, AnyAction>;
    settings: IGraphSettingsEntity;
}

interface IGraphSettingsState {
    anchorEl: any;
}

class GraphSettingsComponent extends React.Component<IGraphSettingsProps, IGraphSettingsState> {
    constructor(props: IGraphSettingsProps) {
        super(props);
        this.state = {
            anchorEl: undefined,
        };
    }

    public render() {
        const { anchorEl } = this.state;
        const { settings } = this.props;
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
                    <GraphSettingsItem
                        name="Drag View"
                        option="dragView"
                        settings={settings}
                        updateSettings={(option: any) => this.updateSettings(option)}
                    />
                    <GraphSettingsItem
                        name="Navigation Buttons"
                        option="navigationButtons"
                        settings={settings}
                        updateSettings={(option: any) => this.updateSettings(option)}
                    />
                    <GraphSettingsItem
                        name="Zoom View"
                        option="zoomView"
                        settings={settings}
                        updateSettings={(option: any) => this.updateSettings(option)}
                    />
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

export const GraphSettings = connect(
    (state: IAppState) => ({
        settings: graphSettingsSelector(state),
    }),
    {
        setSettings: graphSettingsAction,
    },
)(GraphSettingsComponent);
