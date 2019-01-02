import * as React from 'react';

import { Grid } from '@material-ui/core';
import { Footer } from '../modules/Footer';
import { NavigationBar } from '../modules/NavigationBar';

export class App extends React.Component {
    public render() {
        return (
            <>
                <NavigationBar/>
                <Grid
                    container
                    className="app-wrapper"
                >
                    {this.props.children}
                </Grid>
                <Footer/>
            </>
        );
    }
}
