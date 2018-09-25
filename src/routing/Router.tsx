import * as React from 'react';
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom';

import { App, Example, NotFound } from '../containers/index';

export class Router extends React.Component {
    public render() {
        return (
        <BrowserRouter>
            <Switch>
                <Route path="/notFound" component={NotFound} />
                <Route path="/" render={() => {
                    return (
                    <App>
                        <Switch>
                            <Route exact path="/" component={Example} />
                            <Route exact path="/examples" component={Example} />
                            <Redirect to="/notFound"/>
                        </Switch>
                    </App>
                    ); }
                }/>
            </Switch>
        </BrowserRouter>
        );
    }
}
