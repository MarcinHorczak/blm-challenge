import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';

export class Footer extends React.Component {
    public render() {
        return(
            <Grid item container className="footer">
                <Typography className="footer-text">
                    Copyright &copy; Marcin Horczak - Engineer Thesis 2018
                </Typography>
            </Grid>
        );
    }
}
