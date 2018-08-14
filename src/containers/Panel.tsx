import * as React from 'react';

import { Grid } from '@material-ui/core';
import { BlmGenerator } from '../modules/BlmGenerator';
import { lineHeight, lineLength, machines } from '../settings';

export class Panel extends React.Component {
    public render() {
        return (
            <Grid container direction="row" spacing={40} className="blm">
                <Grid item>
                    BLM Generator
                    <BlmGenerator
                        machines={machines}
                        lineLength={lineLength}
                        lineHeight={lineHeight}
                    />
                </Grid>
            </Grid>
        );
    }
}
