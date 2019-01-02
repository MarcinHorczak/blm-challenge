import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { BlmChart } from '../modules/BlmChart';
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
            <Grid className="blm">
                <Grid item container>
                    <Typography variant="title">
                        <T value="blmExamplesGenerator"/>
                    </Typography>
                </Grid>
                <BlmGenerator
                    blmModel={(blm: IBlmEntity[][]) => this.setState({ blmModel: blm })}
                />
                <BlmChart blm={blmModel}/>
                <BlmRanking blm={blmModel}/>
            </Grid>
        );
    }
}
