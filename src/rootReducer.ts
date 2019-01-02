import { combineReducers, Reducer } from 'redux';

import { IGraphSettingsEntity } from './modules/BlmGenerator/model';
import { graphSettingsReducer } from './modules/BlmGenerator/reducers';
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
