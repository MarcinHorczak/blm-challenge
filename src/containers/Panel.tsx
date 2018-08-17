import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { BlmGenerator } from '../modules/BlmGenerator';

export class Panel extends React.Component {
    public render() {
        return (
            <Grid container direction="row" className="blm">
                <Grid item container>
                    <Typography variant="title">BLM Generator</Typography>
                </Grid>
                <BlmGenerator/>
            </Grid>
        );
    }
}
