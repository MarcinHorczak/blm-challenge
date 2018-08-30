import * as React from 'react';

import { Grid } from '@material-ui/core';
import { IBlmEntity } from '../model';

interface IGraphElementProps {
    item: IBlmEntity;
    viewDetails: (item: IBlmEntity | undefined) => void;
}

export class GraphElement extends React.Component<IGraphElementProps, {}> {
    public render() {
        const { item } = this.props;
        const isHighlighted: string = item.isMainLine ? 'blm-graph-element-highlighted' : '';
        const isExist: string = item.isExist ? 'blm-graph-element-hover' : '';
        return(
            <Grid>
                {
                    item.isExist
                        ? <div
                            style={{backgroundColor: '#0cb555'}}
                            // className="blm-graph-element"
                            className={`blm-graph-element ${isHighlighted} ${isExist}`}
                            onMouseOver={() => this.props.viewDetails(this.props.item)}
                            onMouseLeave={() => this.props.viewDetails(undefined)}
                        />
                        : <div
                            className="blm-graph-element"
                            onMouseOver={() => this.props.viewDetails(this.props.item)}
                            onMouseLeave={() => this.props.viewDetails(undefined)}
                        />
                }
            </Grid>
        );
    }
}
