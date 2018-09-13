import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { IBlmEntity } from '../model';

interface IGraphElementProps {
    item: IBlmEntity;
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
                        >
                            <Typography>
                                {item.id}({item.time})
                            </Typography>
                        </div>
                        : <div style={{width: size, height: size}}/>
                }
            </Grid>
        );
    }
}
