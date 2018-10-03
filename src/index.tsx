import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Router } from './routing/Router';

import { MuiThemeProvider } from '@material-ui/core';

import { theme } from './theme';

import './assets/scss/index.scss';

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Router/>
    </MuiThemeProvider>,
    document.getElementById('root'),
);
