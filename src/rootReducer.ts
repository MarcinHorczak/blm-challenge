import { combineReducers, Reducer } from 'redux';
import { ILanguageState } from './modules/NavigationBar/model';
import { languageReducer } from './modules/NavigationBar/reducer';

export const reducer: Reducer = combineReducers({
    language: languageReducer,
});

export interface IAppState {
    language: ILanguageState;
}
