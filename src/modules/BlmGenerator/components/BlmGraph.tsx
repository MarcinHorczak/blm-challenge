import * as React from 'react';

import { Grid } from '@material-ui/core';
import { minBlmElementSize } from '../../../settings';
import { IBlmEntity } from '../model';
import { GraphColumn } from './GraphColumn';

interface IBlmGraphProps {
    blm: IBlmEntity[][];
}

interface IBlmGraphState {
    screenWidth: number;
}

export class BlmGraph extends React.Component<IBlmGraphProps, IBlmGraphState> {
    constructor(props: IBlmGraphProps) {
        super (props);
        this.state = {
            screenWidth: 0,
        };
        this.updateWindowWidth = this.updateWindowWidth.bind(this);
    }

    public componentDidMount() {
        window.addEventListener('resize', this.updateWindowWidth);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowWidth);
    }

    public updateWindowWidth() {
        this.setState({ screenWidth: window.innerWidth });
    }

    public render() {
        const { blm } = this.props;
        const { screenWidth } = this.state;
        return (
            <Grid container className="blm-graph" style={{minWidth: blm.length * minBlmElementSize}}>
                {
                    blm.map((item: IBlmEntity[], i: number) => {
                        return (
                            <GraphColumn
                                column={item}
                                key={i}
                                blmLineLength={blm.length}
                                screenWidth={screenWidth - 30}
                            />
                        );
                    })
                }
            </Grid>
        );
    }
}
