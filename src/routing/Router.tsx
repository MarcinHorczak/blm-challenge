import * as React from 'react';
import {
  BrowserRouter,
  Route,
} from 'react-router-dom';

import { App, NotFound, Panel } from '../containers/index';

export class Router extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <App>
          <Route exact path="/" component={Panel} />
          <Route path="/notFound" component={NotFound} />
        </App>
      </BrowserRouter>
    );
  }
}
