import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { BlmGenerator } from '../modules/BlmGenerator';
import { IBlmEntity } from '../modules/BlmGenerator/model';
import { BlmRanking } from '../modules/BlmRanking';

interface IExampleState {
    blmModel: IBlmEntity[][];
}

export class Example extends React.Component<{}, IExampleState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            blmModel: [],
        };
    }

    public render() {
        const { blmModel } = this.state;
        return (
            <Grid container direction="row" className="blm">
                <Grid item container>
                    <Typography variant="title">
                        BLM Examples Generator
                    </Typography>
                </Grid>
                <BlmGenerator
                    blmModel={(blm: IBlmEntity[][]) => {this.setState({ blmModel: blm }); }}
                />
                <Grid item container className="blm-ranking">
                    <BlmRanking blm={blmModel}/>
                </Grid>
            </Grid>
        );
    }
}
