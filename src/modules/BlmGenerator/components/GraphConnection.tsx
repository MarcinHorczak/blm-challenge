import * as React from 'react';

import { Grid } from '@material-ui/core';
import { IBlmEntity } from '../model';

interface IGraphConnection {
    item: IBlmEntity;
    elementSize: number;
}

export class GraphConnection extends React.Component<IGraphConnection, {}> {
    public render() {
        const { item, elementSize } = this.props;
        return(
            <Grid
                style={{
                    width: (item.next.top || item.next.middle || item.next.bottom) ? `${elementSize / 2}px` : 0,
                    height: `${elementSize / 2}px`,
                }}
            >
                {
                    item.next.bottom
                    ? <div
                        className="arrow"
                        style={{
                            transform:
                                `matrix(${Math.SQRT2},-${Math.SQRT2},${Math.SQRT2},${Math.SQRT2},0,0) scale(0.5)`,
                            marginLeft: 5,
                            marginTop: 8,
                        }}
                    >
                        <div className="oval"/>
                        <div className="connection-line" style={{height: ((elementSize + 2) / 2) - 18}}/>
                        <div className="end"/>
                    </div>
                    : null
                }
                {
                    item.next.middle
                    ? <div className="arrow" style={{transform: 'rotate(-90deg)', marginLeft: 14}}>
                        <div className="oval"/>
                        <div className="connection-line" style={{height: ((elementSize + 2) / 2) - 18}}/>
                        <div className="end"/>
                    </div>
                    : null
                }
                {
                    item.next.top
                    ? <div
                        className="arrow"
                        style={{
                            transform:
                                `rotate(-135deg)`,
                                marginLeft: 5,
                                marginTop: -8,
                        }}
                    >
                        <div className="oval"/>
                        <div className="connection-line" style={{height: ((elementSize + 2) / 2) - 18}}/>
                        <div className="end"/>
                    </div>
                    : null
                }
            </Grid>
        );
    }
}
