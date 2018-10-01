import * as React from 'react';

import { Grid, TextField } from '@material-ui/core';

interface ISelectCycleTimeProps {
    getTime: (time: number) => void;
    time: number;
    blmMinTime: number;
}

interface ISelectCycleTimeState {
    isError: boolean;
}

export class SelectCycleTime extends React.Component<ISelectCycleTimeProps, ISelectCycleTimeState> {
    constructor(props: ISelectCycleTimeProps) {
        super(props);
        this.state = {
            isError: false,
        };
    }

    public render() {
        const { time } = this.props;
        const { isError } = this.state;
        return(
            <Grid container>
                <TextField
                    id="standard-number"
                    label="Cycle Time"
                    value={time}
                    onChange={(event: any) => this.onChange(event.target.value)}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                    error={isError}
                />
            </Grid>
        );
    }

    private onChange(value: any) {
        if (value < this.props.blmMinTime) {
            this.setState({ isError: true });
        } else {
            this.props.getTime(value);
            this.setState({ isError: false });
        }
    }
}
