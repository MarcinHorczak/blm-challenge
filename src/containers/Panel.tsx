import * as React from 'react';

import { Grid } from '@material-ui/core';
import { BlmGenerator } from '../modules/BlmGenerator';

export class Panel extends React.Component {
    public render() {
        return (
            <Grid container direction="row" spacing={40} className="blm">
                <Grid item>
                    BLM Generator
                    <BlmGenerator/>
                </Grid>
            </Grid>
        );
    }
}
