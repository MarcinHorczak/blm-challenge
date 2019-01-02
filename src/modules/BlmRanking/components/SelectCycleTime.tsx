import * as React from 'react';

import { Grid, TextField } from '@material-ui/core';
import { maxTimeRange } from '../../../settings';
import { T } from '../../FormattedText';

interface ISelectCycleTimeProps {
    getTime: (time: number) => void;
    time: number;
    hidden: boolean;
    disabled?: boolean;
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
        const { time, hidden, disabled } = this.props;
        const { isError, errorMessage } = this.state;
        return(
            <Grid container>
                {
                    hidden
                    ? null
                    : <TextField
                        id="standard-number"
                        label={<T value="operation"/>}
                        value={time}
                        onChange={(event: any) => this.onChange(event.target.value)}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                        error={isError}
                        helperText={errorMessage}
                        disabled={disabled}
                    />
                }
            </Grid>
        );
    }

    private onChange(value: any) {
        if (value < maxTimeRange - 1) {
            this.setState({ isError: true, errorMessage: `Value cannot be lower then ${maxTimeRange}` });
        } else {
            this.props.getTime(value);
            this.setState({ isError: false, errorMessage: '' });
        }
    }
}
