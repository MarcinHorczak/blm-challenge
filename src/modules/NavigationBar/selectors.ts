import { createSelector } from 'reselect';
import { IAppState } from '../../rootReducer';
import { ILanguageState } from './model';

export const languageSelector = createSelector(
    (state: IAppState) => state.language,
    (state: ILanguageState) => (state.language),
);
