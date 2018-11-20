import * as React from 'react';

import { Button, Grid } from '@material-ui/core';

export class WorkingStation extends React.Component {
    public render() {
        return(
            <Grid container>
                <Button>Add to working station</Button>
                <Button>Open new working station</Button>
            </Grid>
        );
    }
}
