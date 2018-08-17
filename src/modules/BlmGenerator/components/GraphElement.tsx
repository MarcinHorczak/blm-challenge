import * as React from 'react';

import { Grid } from '@material-ui/core';

interface IGraphElementProps {
    item: boolean;
}

export class GraphElement extends React.Component<IGraphElementProps, {}> {
    public render() {
        return(
            <Grid>
                {
                    this.props.item
                        ? <div style={{backgroundColor: '#0cb555'}} className="blm-graph-element"/>
                        : <div className="blm-graph-element"/>
                }
            </Grid>
        );
    }
}
