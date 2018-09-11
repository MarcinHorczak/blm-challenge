import * as React from 'react';

import { Grid } from '@material-ui/core';
import { GraphElement } from '..';
import { maxBlmElementSize, minBlmElementSize } from '../../../settings';
import { IBlmEntity } from '../model';
import { GraphConnection } from './GraphConnection';

interface IGraphColumnProps {
    column: IBlmEntity[];
    blmLineLength: number;
    viewDetails: (item: IBlmEntity | undefined) => void;
    screenWidth: number;
}

export class GraphColumn extends React.Component<IGraphColumnProps, {}> {
    public render() {
        const { blmLineLength, screenWidth, column } = this.props;
        const elementSize: number =
            screenWidth / blmLineLength < maxBlmElementSize
                ? screenWidth / blmLineLength > minBlmElementSize
                    ? screenWidth / blmLineLength
                    : minBlmElementSize
                : maxBlmElementSize;
        return(
            <>
                <Grid item>
                    {
                        column.map((item: IBlmEntity, i: number) => {
                            return (
                                <Grid item key={i}>
                                    <GraphElement
                                        item={item}
                                        viewDetails={(el: IBlmEntity | undefined) => this.props.viewDetails(el)}
                                        elementSize={elementSize}
                                    />
                                </Grid>
                            );
                        })
                    }
                </Grid>
                <Grid item>
                    {
                        column.map((item: IBlmEntity, i: number) => {
                            return (
                                <Grid item key={i}>
                                    <GraphConnection item={item} elementSize={elementSize}/>
                                </Grid>
                            );
                        })
                    }
                </Grid>
            </>
        );
    }
}
