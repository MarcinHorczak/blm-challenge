import { isNull } from 'lodash';
import { AnyAction } from 'redux';
import { SET_SETTINGS } from '../BlmGenerator/actionTypes';
import { graphDefaultSettings } from '../BlmGenerator/constants';
import { IGraphSettingsEntity } from '../BlmGenerator/model';

export const GRAPH_SETTINGS_KEY = 'graphSettings';
const getDefaultSettings = () => {
    const graphSettings = localStorage.getItem(GRAPH_SETTINGS_KEY);
    return isNull(graphSettings) ? graphDefaultSettings : JSON.parse(graphSettings);
};

export const graphSettingsReducer = (
        state: IGraphSettingsEntity = getDefaultSettings(),
        action: AnyAction,
    ): IGraphSettingsEntity => {
    switch (action.type) {
        case SET_SETTINGS:
            return action.data;
        default:
            return state;
    }
};
