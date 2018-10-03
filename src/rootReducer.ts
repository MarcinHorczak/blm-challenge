import { combineReducers, Reducer } from 'redux';
import { graphSettingsReducer } from './modules/BlmChart/reducers';

import { IGraphSettingsEntity } from './modules/BlmGenerator/model';
import { ILanguageState } from './modules/NavigationBar/model';
import { languageReducer } from './modules/NavigationBar/reducer';

export const reducer: Reducer = combineReducers({
    settings: graphSettingsReducer,
    language: languageReducer,
});

export interface IAppState {
    settings: IGraphSettingsEntity;
    language: ILanguageState;
}
