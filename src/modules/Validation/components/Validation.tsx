import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';

interface IValidationProps {
    validation: string[];
}

export class Validation extends React.Component<IValidationProps, {}> {
    public render() {
        const { validation } = this.props;
        return(
            <Grid>
                {validation.map((val: string, i: number) => {
                    return(
                        <Typography key={i}>{val}</Typography>
                    );
                })}
            </Grid>
        );
    }
}
