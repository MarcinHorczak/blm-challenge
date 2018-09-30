import * as React from 'react';

import { Footer } from '../modules/Footer';
import { NavigationBar } from '../modules/NavigationBar';

export class App extends React.Component {
    public render() {
        return (
            <>
                <NavigationBar/>
                {this.props.children}
                <Footer/>
            </>
        );
    }
}
