import * as React from 'react';

import { get, isNull } from 'lodash';
import { connect } from 'react-redux';
import { IAppState } from '../../../rootReducer';
import { t } from '../../../translations';
import { languageSelector } from '../../NavigationBar/selectors';

interface IFormattedTextProps {
    value: string;
    language: string;
}

class FormattedTextComponent extends React.Component<IFormattedTextProps, {}> {
    constructor(props: IFormattedTextProps) {
        super(props);
        const lang = localStorage.getItem('lang');
        this.state = {
            language: isNull(lang) ? 'en' : lang,
        };
    }

    public componentDidUpdate(prevProps: IFormattedTextProps, _: any) {
        const lang = localStorage.getItem('lang');
        if (prevProps.language !== (isNull(lang) ? 'en' : lang)) {
            this.setState({ language: isNull(lang) ? 'en' : lang });
        }
    }

    public render() {
        const { language, value } = this.props;
        return (
            get(t, `${language}.${value}`)
        );
    }
}

export const FormattedText = connect(
    (state: IAppState, _: any): any => ({
        language: languageSelector(state),
    }),
    null,
)(FormattedTextComponent);
