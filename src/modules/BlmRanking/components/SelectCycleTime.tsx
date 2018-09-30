import * as React from 'react';

import { Grid, TextField } from '@material-ui/core';

interface ISelectCycleTimeProps {
    getTime: (time: number) => void;
    time: number;
}

export class SelectCycleTime extends React.Component<ISelectCycleTimeProps, {}> {
    public render() {
        const { time, getTime } = this.props;
        return(
            <Grid container>
                <TextField
                    id="standard-number"
                    label="Cycle Time"
                    value={time}
                    onChange={(event: any) => getTime(event.target.value)}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
            </Grid>
        );
    }
}
