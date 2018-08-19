import * as React from 'react';

import { Grid } from '@material-ui/core';
import { GraphElement } from '..';
import { IBlmEntity } from '../model';

interface IGraphColumnProps {
    column: IBlmEntity[];
    blmLineLength: number;
    viewDetails: (item: IBlmEntity | undefined) => void;
}

export class GraphColumn extends React.Component<IGraphColumnProps, {}> {
    public render() {
        const { blmLineLength } = this.props;
        const columnWidth: number = 100 / blmLineLength;
        return(
            <Grid item className="blm-graph-column" style={{width: `${columnWidth}%`}}>
                {
                    this.props.column.map((item: IBlmEntity, i: number) => {
                        return (
                            <Grid item key={i}>
                                <GraphElement
                                    item={item}
                                    viewDetails={(el: IBlmEntity | undefined) => this.props.viewDetails(el)}
                                />
                            </Grid>
                        );
                    })
                }
                <br/>
            </Grid>
        );
    }
}
