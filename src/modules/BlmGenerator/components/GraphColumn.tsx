import * as React from 'react';

import { Grid } from '@material-ui/core';
import { GraphElement } from '..';

interface IGraphColumnProps {
    column: boolean[];
    blmLineLength: number;
}

export class GraphColumn extends React.Component<IGraphColumnProps, {}> {
    public render() {
        const { blmLineLength } = this.props;
        const columnWidth: number = 100 / blmLineLength;
        return(
            <Grid item className="blm-graph-column" style={{width: `${columnWidth}%`}}>
                {
                    this.props.column.map((item: boolean, i: number) => {
                        return (
                            <Grid item key={i}>
                                <GraphElement item={item}/>
                            </Grid>
                        );
                    })
                }
                <br/>
            </Grid>
        );
    }
}
