import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { IBlmEntity } from '../model';

interface IGraphElementProps {
    item: IBlmEntity;
    viewDetails: (item: IBlmEntity | undefined) => void;
    elementSize: number;
}

export class GraphElement extends React.Component<IGraphElementProps, {}> {
    public render() {
        const { item, elementSize } = this.props;
        const isExist: string = item.isExist ? 'blm-graph-element' : '';
        const size: number = (elementSize - 2) / 2;
        return(
            <Grid>
                {
                    item.isExist
                        ? <div
                            style={{width: size, height: size}}
                            className={`blm-graph-element ${isExist}`}
                            onMouseOver={() => this.props.viewDetails(this.props.item)}
                            onMouseLeave={() => this.props.viewDetails(undefined)}
                        >
                            <Typography>
                                {item.id}
                            </Typography>
                        </div>
                        : <div style={{width: size, height: size}}/>
                }
            </Grid>
        );
    }
}
