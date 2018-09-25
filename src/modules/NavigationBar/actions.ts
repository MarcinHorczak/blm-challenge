import { LANGUAGE } from './actionTypes';

export const languageAction = (lang: string) => ({
    type: LANGUAGE,
    lang,
});
