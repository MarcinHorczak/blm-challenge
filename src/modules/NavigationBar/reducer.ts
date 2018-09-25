import { isNull } from 'lodash';
import { AnyAction } from 'redux';
import { LANGUAGE } from './actionTypes';
import { ILanguageState } from './model';

const lang = localStorage.getItem('lang');

export const languageReducer = (
        state: ILanguageState = { language: isNull(lang) ? 'en' : lang },
        action: AnyAction,
    ) => {
    switch (action.type) {
        case LANGUAGE:
            return {
                language: action.lang,
            };
        default:
            return state;
    }
};
