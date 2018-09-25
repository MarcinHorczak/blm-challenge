import * as React from 'react';

import { NavigationBar } from '../modules/NavigationBar';

export class App extends React.Component {
    public render() {
        return (
            <>
                <NavigationBar/>
                {this.props.children}
            </>
        );
    }
}
