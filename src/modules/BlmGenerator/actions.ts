import { GRAPH_SETTINGS_KEY } from '../BlmChart/reducers';
import { SET_SETTINGS } from './actionTypes';
import { IGraphSettingsEntity } from './model';

export const graphSettingsAction = (data: IGraphSettingsEntity) => (dispatch: any) => {
    dispatch({ type: SET_SETTINGS, data });
    localStorage.setItem(GRAPH_SETTINGS_KEY, JSON.stringify(data));
};
