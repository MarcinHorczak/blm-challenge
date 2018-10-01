import * as React from 'react';

import { Grid, TextField } from '@material-ui/core';

interface ISelectCycleTimeProps {
    getTime: (time: number) => void;
    time: number;
    blmMinTime: number;
}

interface ISelectCycleTimeState {
    isError: boolean;
    errorMessage: string;
}

export class SelectCycleTime extends React.Component<ISelectCycleTimeProps, ISelectCycleTimeState> {
    constructor(props: ISelectCycleTimeProps) {
        super(props);
        this.state = {
            isError: false,
            errorMessage: '',
        };
    }

    public render() {
        const { time } = this.props;
        const { isError, errorMessage } = this.state;
        return(
            <Grid container>
                <TextField
                    id="standard-number"
                    label="Series"
                    value={time}
                    onChange={(event: any) => this.onChange(event.target.value)}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                    error={isError}
                    helperText={errorMessage}
                />
            </Grid>
        );
    }

    private onChange(value: any) {
        const { blmMinTime } = this.props;
        if (value < blmMinTime) {
            this.setState({ isError: true, errorMessage: `Value cannot be lower then ${blmMinTime}` });
        } else {
            this.props.getTime(value);
            this.setState({ isError: false, errorMessage: '' });
        }
    }
}
