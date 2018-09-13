import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { BlmGenerator } from '../modules/BlmGenerator';
import { IBlmEntity } from '../modules/BlmGenerator/model';
import { BlmRanking } from '../modules/BlmRanking';

interface IPanelState {
    blmModel: IBlmEntity[][];
}

export class Panel extends React.Component<{}, IPanelState> {
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
                    <Typography variant="title">BLM Generator</Typography>
                </Grid>
                <BlmGenerator
                    blmModel={(blm: IBlmEntity[][]) => {this.setState({ blmModel: blm }); }}
                />
                <hr style={{width: '200%'}}/>
                <div style={{margin: '0 20px', width: '100%'}}>
                    <BlmRanking blm={blmModel}/>
                </div>
            </Grid>
        );
    }
}
