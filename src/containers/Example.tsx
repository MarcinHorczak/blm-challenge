import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import BlmChart from '../modules/BlmChart/components/BlmChart';
import { BlmGenerator } from '../modules/BlmGenerator';
import { IBlmEntity } from '../modules/BlmGenerator/model';
import { BlmRanking } from '../modules/BlmRanking';
import { T } from '../modules/FormattedText';

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
                        <T value="blmExamplesGenerator"/>
                    </Typography>
                </Grid>
                <BlmGenerator
                    blmModel={(blm: IBlmEntity[][]) => {this.setState({ blmModel: blm }); }}
                />
                {/* <BlmGraph blm={blmModel}/> */}
                <BlmChart blm={blmModel}/>
                <Grid item container className="blm-ranking">
                    <BlmRanking blm={blmModel}/>
                </Grid>
            </Grid>
        );
    }
}
