import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MuiThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux';
import { Router } from './routing/Router';
import { store } from './store';
import { theme } from './theme';

import './assets/scss/index.scss';

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <Router/>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
