import * as React from 'react';

import { MenuItem, Switch } from '@material-ui/core';
import { get } from 'lodash';
import { IGraphSettingsEntity } from '../model';

interface IGraphSettingsItemProps {
    settings: IGraphSettingsEntity;
    option: string;
    updateSettings: (option: string) => void;
    name: string;
}

export class GraphSettingsItem extends React.Component<IGraphSettingsItemProps, {}> {
    public render() {
        const { settings, option, updateSettings, name } = this.props;
        return(
            <MenuItem>
                <Switch
                    checked={get(settings, option)}
                    onChange={() => updateSettings(option)}
                    color="primary"
                />
                {name}
            </MenuItem>
        );
    }
}
