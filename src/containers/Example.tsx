import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import BlmChart from '../modules/BlmChart/components/BlmChart';
import { BlmGenerator } from '../modules/BlmGenerator';
import { IBlmEntity } from '../modules/BlmGenerator/model';
import { BlmRanking } from '../modules/BlmRanking';
import { T } from '../modules/FormattedText';

interface IExampleState {
    blmModel: IBlmEntity[][];
    blmMinTime: number;
}

export class Example extends React.Component<{}, IExampleState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            blmModel: [],
            blmMinTime: 0,
        };
    }

    public render() {
        const { blmModel, blmMinTime } = this.state;
        return (
            <Grid container direction="row" className="blm">
                <Grid item container>
                    <Typography variant="title">
                        <T value="blmExamplesGenerator"/>
                    </Typography>
                </Grid>
                <BlmGenerator
                    blmModel={(blm: IBlmEntity[][]) => this.setState({ blmModel: blm })}
                    blmElementMinTime={(time: number) => this.setState({ blmMinTime: time })}
                />
                <BlmChart blm={blmModel}/>
                <BlmRanking blm={blmModel} blmMinTime={blmMinTime}/>
            </Grid>
        );
    }
}
