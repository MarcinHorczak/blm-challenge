import * as React from 'react';

import { Grid } from '@material-ui/core';

interface IGraphElementProps {
    item: boolean;
}

export class GraphElement extends React.Component<IGraphElementProps, {}> {
    public render() {
        return(
            <Grid className="blm-graph-element">
                {
                    this.props.item
                        ? <div style={{backgroundColor: '#00ff00'}}>:)</div>
                        : <div>:(</div>
                }
            </Grid>
        );
    }
}
